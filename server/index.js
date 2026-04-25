// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const recipeRoutes = require('./src/routes/recipes');

const Recipe = require('./src/models/Recipe');

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Body:`, req.body);
  next();
});

// ==================== ROUTES ====================
app.use('/api/recipes', recipeRoutes);

// ==================== DATABASE CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeapp';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });


// ==================== EXTRA ROUTES (SAFE) ====================

app.get('/api/all-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==================== AUTH ROUTES ====================
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    res.json({
      success: true,
      user: {
        uid: 'user_' + Date.now(),
        email: 'user@example.com'
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});


// ==================== FEEDBACK ROUTES ====================
app.post('/api/feedback', async (req, res) => {
  try {
    console.log('📝 Feedback received:', req.body);
    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

app.get('/api/feedback/recipe/:recipeId', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
});


// ==================== INITIAL DATA ====================
const initializeSampleData = async () => {
  try {
    const recipeCount = await Recipe.countDocuments();

    if (recipeCount === 0) {
      console.log('📝 Creating sample recipes...');

      await Recipe.insertMany([
        {
          title: "Classic Butter Chicken",
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
          description: "Creamy and flavorful Indian butter chicken.",
          category: "Dinner",
          cookingTime: 45,
          servings: 4,
          difficulty: "Medium",
          ingredients: [],
          instructions: [],
          likes: [],
          savedBy: [],
          createdBy: "Chef Raj",
          createdById: "chef_raj_001",
          isApproved: true
        }
      ]);

      console.log('✅ Sample recipes created');
    } else {
      console.log(`✅ Database already has ${recipeCount} recipes`);
    }

  } catch (error) {
    console.error('❌ Error creating sample recipes:', error);
  }
};


// ==================== HEALTH ====================
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    status: 'OK',
    database: states[dbState] || 'unknown',
  });
});


// ==================== STATUS ====================
app.get('/api/status', (req, res) => {
  res.json({
    message: '🍳 Recipe App API is running!',
    version: '1.0.0'
  });
});


// ==================== ROOT ====================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to Recipe App API'
  });
});


// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await initializeSampleData();
});

module.exports = app;