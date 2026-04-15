// saved-recipes.js
import React, { useState, useEffect, } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSavedRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './SavedRecipes.css';

const SavedRecipes = () => {
  const { currentUser } = useAuth();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Fetch saved recipes when user changes
  useEffect(() => {
    if (currentUser?.uid) {
      fetchSavedRecipes();
    } else {
      setSavedRecipes([]);
      setLoading(false);
    }
  }, [currentUser]);

  // 📡 API Call
  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSavedRecipes(currentUser.uid);

      // ✅ Safe data extraction
      const recipesData = response?.data || [];
      setSavedRecipes(Array.isArray(recipesData) ? recipesData : []);
    } catch (err) {
      console.error('❌ Error fetching saved recipes:', err);

      // ✅ Better error handling
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Failed to load saved recipes');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update single recipe (like/save changes)
  const handleRecipeUpdate = (updatedRecipe) => {
    setSavedRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
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

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="loading">
        Loading saved recipes...
      </div>
    );
  }

  return (
    <div className="saved-recipes">
      <div className="container">

        <h1>Your Saved Recipes</h1>

        {/* ❗ Error UI */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={fetchSavedRecipes} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* 📊 Count */}
        <p className="saved-count">
          {savedRecipes.length}{' '}
          {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
        </p>

        {/* ❌ Empty State */}
        {savedRecipes.length === 0 && !error ? (
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