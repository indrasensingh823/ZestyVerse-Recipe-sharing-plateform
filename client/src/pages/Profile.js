import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { getRecipes } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');

  useEffect(() => {
    if (currentUser) {
      fetchUserRecipes();
    }
  }, [currentUser]);

  const fetchUserRecipes = async () => {
    try {
      const response = await getRecipes();
      // Filter recipes created by current user
      const userRecipes = response.data.recipes.filter(
        recipe => recipe.createdById === currentUser.uid
      );
      setUserRecipes(userRecipes);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const stats = {
    recipes: userRecipes.length,
    likes: userRecipes.reduce((total, recipe) => total + recipe.likes.length, 0),
    saved: userRecipes.reduce((total, recipe) => total + recipe.savedBy.length, 0),
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
              Member since {currentUser.metadata?.creationTime ? 
                new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                'Recent'
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

        {/* Profile Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <span className="tab-icon">📖</span>
            My Recipes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <span className="tab-icon">⭐</span>
            Saved Recipes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="tab-icon">⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'recipes' && (
            <div className="recipes-tab">
              <div className="tab-header">
                <h2>My Recipes</h2>
                <p>Recipes you've created and shared with the community</p>
              </div>

              {loading ? (
                <div className="loading">Loading your recipes...</div>
              ) : userRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {userRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card">
                      <div className="recipe-image">
                        <img src={recipe.image} alt={recipe.title} />
                        <div className="recipe-status">
                          {recipe.isApproved ? (
                            <span className="status approved">✅ Approved</span>
                          ) : (
                            <span className="status pending">⏳ Pending Review</span>
                          )}
                        </div>
                      </div>
                      <div className="recipe-content">
                        <h3>{recipe.title}</h3>
                        <p className="recipe-description">{recipe.description}</p>
                        <div className="recipe-meta">
                          <span>🕒 {recipe.cookingTime} min</span>
                          <span>👥 {recipe.servings}</span>
                          <span>❤️ {recipe.likes.length}</span>
                        </div>
                        <div className="recipe-actions">
                          <button 
                            onClick={() => navigate(`/recipe/${recipe._id}`)}
                            className="view-btn"
                          >
                            View Recipe
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
                  <p>Start sharing your culinary creations with the community!</p>
                  <button 
                    onClick={() => navigate('/create-recipe')}
                    className="create-first-btn"
                  >
                    Create Your First Recipe
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="saved-tab">
              <div className="tab-header">
                <h2>Saved Recipes</h2>
                <p>Recipes you've saved for later</p>
              </div>
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No Saved Recipes</h3>
                <p>Start exploring and save recipes you love!</p>
                <button 
                  onClick={() => navigate('/')}
                  className="explore-btn"
                >
                  Explore Recipes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="tab-header">
                <h2>Account Settings</h2>
                <p>Manage your account preferences</p>
              </div>
              
              <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="setting-item">
                  <label>Display Name</label>
                  <div className="setting-value">
                    {currentUser.displayName || 'Not set'}
                    <button className="edit-setting-btn">Edit</button>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Email Address</label>
                  <div className="setting-value">
                    {currentUser.email}
                    <button className="edit-setting-btn">Change</button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <div className="setting-value">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Recipe Recommendations</label>
                  <div className="setting-value">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Account Actions</h3>
                <div className="danger-actions">
                  <button className="danger-btn">
                    🗑️ Delete Account
                  </button>
                  <button className="danger-btn">
                    📧 Export Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;