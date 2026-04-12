import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import './SubmitRecipe.css';

const SubmitRecipe = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateRecipe = () => {
    if (!currentUser) {
      toast.error('Please login to submit a recipe');
      navigate('/auth');
      return;
    }
    navigate('/create-recipe');
  };

  return (
    <div className="submit-recipe-page">
      <div className="container">
        <div className="submit-hero">
          <h1>Share Your Recipe with the World</h1>
          <p>Join our community of food lovers and share your culinary creations</p>
          
          {currentUser ? (
            <div className="submit-actions">
              <button onClick={handleCreateRecipe} className="create-btn">
                Create New Recipe
              </button>
              <p className="note">
                Your recipe will be reviewed by our team before being published
              </p>
            </div>
          ) : (
            <div className="auth-required">
              <h3>Please login to submit a recipe</h3>
              <button onClick={() => navigate('/auth')} className="login-btn">
                Login / Sign Up
              </button>
            </div>
          )}
        </div>

        <div className="benefits-section">
          <h2>Why Share Your Recipes?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>👥 Reach Food Lovers</h3>
              <p>Share your recipes with thousands of food enthusiasts</p>
            </div>
            <div className="benefit-card">
              <h3>💡 Get Inspiration</h3>
              <p>Discover new ideas from our community feedback</p>
            </div>
            <div className="benefit-card">
              <h3>⭐ Build Reputation</h3>
              <p>Become a recognized chef in our community</p>
            </div>
            <div className="benefit-card">
              <h3>📱 Easy Sharing</h3>
              <p>Simple form makes recipe submission quick and easy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRecipe;