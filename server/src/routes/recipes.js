// routes/recipes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');


// ✅ GET SAVED RECIPES (FIRST - IMPORTANT)
router.get('/saved/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const recipes = await Recipe.find({
      savedBy: userId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json(recipes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET ALL RECIPES
router.get('/', async (req, res) => {
  try {
    let { category, difficulty, search, page = 1, limit = 50 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let query = { isApproved: true };

    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ GET SINGLE RECIPE (AFTER saved route)
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({ success: true, recipe });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ CREATE RECIPE
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      likes: [],
      savedBy: []
    });

    const savedRecipe = await recipe.save();

    res.status(201).json({
      success: true,
      recipe: savedRecipe
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ LIKE RECIPE
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const hasLiked = recipe.likes.includes(userId);

    if (hasLiked) {
      recipe.likes = recipe.likes.filter(id => id !== userId);
    } else {
      recipe.likes.push(userId);
    }

    await recipe.save();

    res.json({ success: true, recipe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ SAVE RECIPE
router.post('/:id/save', async (req, res) => {
  try {
    const { userId } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const hasSaved = recipe.savedBy.includes(userId);

    if (hasSaved) {
      recipe.savedBy = recipe.savedBy.filter(id => id !== userId);
    } else {
      recipe.savedBy.push(userId);
    }

    await recipe.save();

    res.json({ success: true, recipe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;