import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/api';
import { toast } from 'react-toastify';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    servings: '',
    difficulty: 'Easy',
    category: 'Breakfast',
    image: ''
  });
  
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState([{ step: 1, description: '' }]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index].description = value;
    setInstructions(updatedInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { step: instructions.length + 1, description: '' }]);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      const updatedInstructions = instructions.filter((_, i) => i !== index)
        .map((inst, idx) => ({ ...inst, step: idx + 1 }));
      setInstructions(updatedInstructions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to create a recipe');
      return;
    }

    setLoading(true);

    try {
      const recipeData = {
        ...formData,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings),
        ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
        instructions: instructions.filter(inst => inst.description.trim() !== ''),
        createdBy: currentUser.displayName || currentUser.email,
        createdById: currentUser.uid
      };

      await createRecipe(recipeData);
      toast.success('Recipe submitted successfully! It will be visible after admin approval.');
      navigate('/');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Error creating recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Please login to create a recipe</h2>
        <button onClick={() => navigate('/auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="create-recipe">
      <h1>Create New Recipe</h1>
      
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Cooking Time (minutes) *</label>
              <input
                type="number"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Servings *</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Difficulty *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Ingredients</h3>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Unit (cup, tsp, etc.)"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="remove-btn"
                disabled={ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="add-btn">
            Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h3>Instructions</h3>
          {instructions.map((instruction, index) => (
            <div key={index} className="instruction-row">
              <span className="step-number">Step {instruction.step}</span>
              <textarea
                placeholder="Describe this step..."
                value={instruction.description}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                required
                rows="2"
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="remove-btn"
                disabled={instructions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} className="add-btn">
            Add Step
          </button>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;