import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSavedRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './SavedRecipes.css';
import { toast } from 'react-toastify';

const SavedRecipes = () => {
  const { currentUser } = useAuth();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (currentUser) {
      fetchSavedRecipes();
    }
  }, [currentUser]);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      setError(null); // reset error

      const response = await getSavedRecipes(currentUser.uid);

      setSavedRecipes(response.data || []);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load saved recipes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeUpdate = (updatedRecipe) => {
    setSavedRecipes((prev) =>
      prev.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  // 🔒 Not logged in
  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Please login to view saved recipes</h2>
      </div>
    );
  }

  // ⏳ Loading
  if (loading) {
    return <div className="loading">Loading saved recipes...</div>;
  }

  return (
    <div className="saved-recipes">
      <div className="container">

        <h1>Your Saved Recipes</h1>

        {/* ❗ Error UI */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <p className="saved-count">
          {savedRecipes.length}{' '}
          {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
        </p>

        {savedRecipes.length === 0 ? (
          <div className="no-saved">
            <h3>No saved recipes yet</h3>
            <p>Start saving your favorite recipes to see them here!</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onUpdate={handleRecipeUpdate}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;