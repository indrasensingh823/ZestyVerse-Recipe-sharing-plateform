// src/components/RecipeCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { likeRecipe, saveRecipe } from '../services/api';
import { toast } from 'react-toastify';
// React Icons
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaEye,
  FaClock,
  FaUsers
} from 'react-icons/fa';

const RecipeCard = ({ recipe, onLike, onSave, currentUser, onUpdate }) => {
  const navigate = useNavigate();

  const isLiked = currentUser && recipe.likes?.includes(currentUser.uid);
  const isSaved = currentUser && recipe.savedBy?.includes(currentUser.uid);

  // Like
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return toast.error('Please login to like recipes');

    try {
      const res = await likeRecipe(recipe._id, { userId: currentUser.uid });
      if (res.data?.recipe) {
        onUpdate?.(res.data.recipe);
        onLike?.(recipe._id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to like recipe');
    }
  };

  // Save
  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) return toast.error('Please login to save recipes');

    try {
      const res = await saveRecipe(recipe._id, { userId: currentUser.uid });
      if (res.data?.recipe) {
        onUpdate?.(res.data.recipe);
        onSave?.(recipe._id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save recipe');
    }
  };

  // Share
  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/recipe/${recipe._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied!');
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const viewRecipeDetails = () => {
    navigate(`/recipe/${recipe._id}`);
  };

  return (
    <div className="recipe-card" onClick={viewRecipeDetails}>
      
      {/* Image */}
      <div className="recipe-image-container">
        <img src={recipe.image} alt={recipe.title} />

        <div className="overlay">
          <span className="tag category">{recipe.category}</span>
          <span className="tag difficulty">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Content */}
      <div className="recipe-content">

        <h3>{recipe.title}</h3>

        <p>
          {recipe.description || 'A delicious recipe waiting to be discovered!'}
        </p>

        {/* Meta */}
        <div className="recipe-meta">
          <span><FaClock /> {recipe.cookingTime || 30} min</span>
          <span><FaUsers /> {recipe.servings || 4}</span>
          <span><FaHeart /> {recipe.likes?.length || 0}</span>
        </div>

        {/* Actions */}
        <div className="recipe-actions">

          <button onClick={handleLike} className={`btn like ${isLiked ? 'active' : ''}`}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button onClick={handleSave} className={`btn save ${isSaved ? 'active' : ''}`}>
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>

          <button onClick={handleShare} className="btn">
            <FaShareAlt />
          </button>

          <button onClick={viewRecipeDetails} className="btn">
            <FaEye />
          </button>

        </div>

        <div className="author">
          By {recipe.createdBy || 'ZestyVerse Community'}
        </div>

      </div>
    </div>
  );
};

export default RecipeCard;