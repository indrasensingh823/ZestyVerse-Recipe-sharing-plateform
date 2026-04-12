// server/src/models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String }
  }],

  instructions: [{
    step: { type: Number, required: true },
    description: { type: String, required: true }
  }],

  cookingTime: {
    type: Number,
    required: true
  },

  servings: {
    type: Number,
    required: true
  },

  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },

  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Vegan', 'Desserts', 'Quick Bites'],
    required: true
  },

  image: {
    type: String,
    required: true
  },

  createdBy: {
    type: String,
    required: true
  },

  createdById: {
    type: String,
    required: true
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  // ✅ FIX: safe defaults
  likes: {
    type: [String],
    default: []
  },

  savedBy: {
    type: [String],
    default: []
  }

}, { timestamps: true });

// ✅ Search optimization
recipeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);