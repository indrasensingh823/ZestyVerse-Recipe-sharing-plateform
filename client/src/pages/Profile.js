import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getRecipes } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');
  const [error, setError] = useState(null); // ✅ added like saved-recipes

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  // 🔄 Fetch recipes when user changes (same pattern)
  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserRecipes();
    } else {
      setUserRecipes([]);
      setLoading(false);
    }
  }, [currentUser]);

  // 📡 API Call (updated like saved-recipes)
  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecipes();

      // ✅ Safe extraction (same as saved-recipes)
      const allRecipes =
        response?.data?.recipes ||
        response?.data ||
        [];

      // ✅ Filter current user recipes
      const filtered = Array.isArray(allRecipes)
        ? allRecipes.filter(
            (recipe) =>
              recipe?.createdById &&
              currentUser?.uid &&
              String(recipe.createdById) === String(currentUser.uid)
          )
        : [];

      setUserRecipes(filtered);

    } catch (err) {
      console.error('❌ Error fetching user recipes:', err);

      // ✅ Better error handling (same as saved-recipes)
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Failed to load recipes');
      }

      setUserRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Prevent render until redirect handled
  if (!currentUser) return null;

  // ✅ Safe stats calculation
  const stats = {
    recipes: userRecipes.length,
    likes: userRecipes.reduce(
      (total, recipe) => total + (recipe?.likes?.length || 0),
      0
    ),
    saved: userRecipes.reduce(
      (total, recipe) => total + (recipe?.savedBy?.length || 0),
      0
    ),
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Profile Header */}
        <div className="profile-header">

          <div className="profile-avatar-section">
            <div className="avatar-large">
              <img
                src={currentUser.photoURL || '/default-avatar.png'}
                alt={currentUser.displayName || 'User'}
              />
            </div>
            <button className="edit-avatar-btn">
              <span>✏️</span>
            </button>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {currentUser.displayName || 'User'}
            </h1>

            <p className="profile-email">{currentUser.email}</p>

            <p className="profile-join-date">
              Member since {
                currentUser.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                  : 'Recent'
              }
            </p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.recipes}</span>
                <span className="stat-label">Recipes</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">{stats.likes}</span>
                <span className="stat-label">Likes</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">{stats.saved}</span>
                <span className="stat-label">Saves</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={() => navigate('/create-recipe')}
              className="action-btn primary-btn"
            >
              <span className="btn-icon">👨‍🍳</span>
              Create New Recipe
            </button>

            <button
              onClick={() => navigate('/submit-recipe')}
              className="action-btn secondary-btn"
            >
              <span className="btn-icon">➕</span>
              Submit Recipe
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            📖 My Recipes
          </button>

          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            ⭐ Saved Recipes
          </button>

          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">

          {/* My Recipes */}
          {activeTab === 'recipes' && (
            <div className="recipes-tab">

              <div className="tab-header">
                <h2>My Recipes</h2>
                <p>Recipes you've created and shared</p>
              </div>

              {/* ❗ Error UI */}
              {error && (
                <div className="error-box">
                  <p>{error}</p>
                  <button onClick={fetchUserRecipes} className="retry-btn">
                    Retry
                  </button>
                </div>
              )}

              {loading ? (
                <div className="loading">Loading your recipes...</div>
              ) : userRecipes.length > 0 ? (

                <div className="recipes-grid">
                  {userRecipes.map((recipe) => (
                    <div key={recipe._id} className="recipe-card">

                      <div className="recipe-image">
                        <img src={recipe.image} alt={recipe.title} />

                        <div className="recipe-status">
                          {recipe.isApproved ? (
                            <span className="status approved">✅ Approved</span>
                          ) : (
                            <span className="status pending">⏳ Pending</span>
                          )}
                        </div>
                      </div>

                      <div className="recipe-content">
                        <h3>{recipe.title}</h3>

                        <p className="recipe-description">
                          {recipe.description}
                        </p>

                        <div className="recipe-meta">
                          <span>🕒 {recipe.cookingTime} min</span>
                          <span>👥 {recipe.servings}</span>
                          <span>❤️ {recipe?.likes?.length || 0}</span>
                        </div>

                        <div className="recipe-actions">
                          <button
                            onClick={() => navigate(`/recipe/${recipe._id}`)}
                            className="view-btn"
                          >
                            View
                          </button>

                          <button
                            onClick={() => navigate(`/create-recipe?edit=${recipe._id}`)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              ) : (
                <div className="empty-state">
                  <div className="empty-icon">👨‍🍳</div>
                  <h3>No Recipes Yet</h3>
                  <p>Create your first recipe 🚀</p>

                  <button
                    onClick={() => navigate('/create-recipe')}
                    className="create-first-btn"
                  >
                    Create Recipe
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Saved */}
          {activeTab === 'saved' && (
            <div className="saved-tab">
              <h2>Saved Recipes</h2>
              <p>No saved recipes yet</p>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h2>Settings</h2>

              <div className="setting-item">
                <label>Name</label>
                <span>{currentUser.displayName || 'Not set'}</span>
              </div>

              <div className="setting-item">
                <label>Email</label>
                <span>{currentUser.email}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;