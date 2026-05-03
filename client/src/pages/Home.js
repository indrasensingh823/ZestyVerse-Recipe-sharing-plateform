// src/pages/Home.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { getRecipes, likeRecipe, saveRecipe } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import "./Home.css";
import { toast } from 'react-toastify';
import Footer from '../components/Footer';


const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleRecipes, setVisibleRecipes] = useState(12);
  const [error, setError] = useState("");
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Enhanced manual recipes with proper structure
const manualRecipes = useMemo(() => {
  // Helper to generate random user IDs for likes & saves
  const randomUserIds = (min, max) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(`user${Math.floor(Math.random() * 100) + 1}`);
    }
    return [...new Set(ids)]; // unique
  };

  // Use same random seed for each recipe (static, won't change on re‑render)
  const recipesData = [
    {
      _id: "manual1",
      title: "Spaghetti Carbonara",
      image: "https://www.sipandfeast.com/wp-content/uploads/2022/09/spaghetti-carbonara-recipe-snippet.jpg",
      description: "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
      category: "Dinner",
      cookingTime: 20,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Spaghetti", quantity: "400", unit: "g" },
        { name: "Eggs", quantity: "3", unit: "" },
        { name: "Pancetta", quantity: "150", unit: "g" },
        { name: "Parmesan Cheese", quantity: "100", unit: "g" }
      ],
      instructions: [
        { step: 1, description: "Cook spaghetti according to package instructions." },
        { step: 2, description: "Fry pancetta until crispy." },
        { step: 3, description: "Mix eggs and cheese in a bowl." },
        { step: 4, description: "Combine everything and serve immediately." }
      ],
      likes: randomUserIds(3, 12),
      savedBy: randomUserIds(2, 8),
      createdBy: "Chef Mario",
      createdById: "manual1",
      isApproved: true
    },
    {
      _id: "manual2",
      title: "Vegan Buddha Bowl",
      image: "https://simplyceecee.co/wp-content/uploads/2018/07/veganbuddhabowl-2.jpg",
      description: "A nourishing bowl packed with fresh vegetables, grains, and a creamy dressing.",
      category: "Vegan",
      cookingTime: 15,
      servings: 2,
      difficulty: "Easy",
      ingredients: [
        { name: "Quinoa", quantity: "1", unit: "cup" },
        { name: "Sweet Potato", quantity: "1", unit: "" },
        { name: "Avocado", quantity: "1", unit: "" },
        { name: "Chickpeas", quantity: "1", unit: "can" }
      ],
      instructions: [
        { step: 1, description: "Cook quinoa according to package instructions." },
        { step: 2, description: "Roast sweet potato cubes in oven." },
        { step: 3, description: "Arrange all ingredients in a bowl." },
        { step: 4, description: "Drizzle with tahini dressing and serve." }
      ],
      likes: randomUserIds(5, 18),
      savedBy: randomUserIds(3, 10),
      createdBy: "Healthy Eats",
      createdById: "manual2",
      isApproved: true
    },
    {
      _id: "breakfast1",
      title: "Fluffy Pancakes",
      image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/fluffy-pancakes-8ebc2cf.jpg",
      description: "Fluffy pancakes served with maple syrup and fresh fruits.",
      category: "Breakfast",
      cookingTime: 15,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Flour", quantity: "2", unit: "cups" },
        { name: "Milk", quantity: "1.5", unit: "cups" },
        { name: "Eggs", quantity: "2", unit: "" },
        { name: "Baking Powder", quantity: "2", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Mix dry ingredients in a bowl." },
        { step: 2, description: "Add wet ingredients and mix gently." },
        { step: 3, description: "Cook on griddle until bubbles form." },
        { step: 4, description: "Flip and cook until golden brown." }
      ],
      likes: randomUserIds(8, 25),
      savedBy: randomUserIds(4, 12),
      createdBy: "Breakfast Club",
      createdById: "breakfast1",
      isApproved: true
    },
    {
      _id: "breakfast2",
      title: "Masala Dosa",
      image: "https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__1200_0_0_0_auto.jpg",
      description: "A crispy, golden crepe made from fermented rice and lentil batter, stuffed with a spiced potato filling.",
      category: "Breakfast",
      cookingTime: 30,
      servings: 2,
      difficulty: "Medium",
      ingredients: [
        { name: "Dosa Batter", quantity: "2", unit: "cups" },
        { name: "Potatoes", quantity: "3", unit: "" },
        { name: "Mustard Seeds", quantity: "1", unit: "tsp" },
        { name: "Curry Leaves", quantity: "1", unit: "sprig" },
        { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Heat a tawa or griddle and grease it lightly." },
        { step: 2, description: "Pour a ladle of batter and spread it in a circular motion to form a thin crepe." },
        { step: 3, description: "Drizzle oil and cook until the edges lift and the bottom is golden." },
        { step: 4, description: "Place a portion of the spiced potato filling in the center, fold, and serve with chutney." }
      ],
      likes: randomUserIds(10, 30),
      savedBy: randomUserIds(5, 15),
      createdBy: "Home Chef",
      createdById: "breakfast2",
      isApproved: true
    },
    {
      _id: "breakfast3",
      title: "Poha",
      image: "https://www.theloveofspice.com/wp-content/uploads/2019/01/kanda-poha-recipe.jpg",
      description: "Flattened rice cooked with onions, spices, and a hint of lemon, a classic Maharashtrian breakfast.",
      category: "Breakfast",
      cookingTime: 15,
      servings: 2,
      difficulty: "Easy",
      ingredients: [
        { name: "Thick Poha (Flattened Rice)", quantity: "2", unit: "cups" },
        { name: "Onion", quantity: "1", unit: "medium" },
        { name: "Mustard Seeds", quantity: "1", unit: "tsp" },
        { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
        { name: "Lemon Juice", quantity: "1", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Rinse poha in water and set aside." },
        { step: 2, description: "Temper mustard seeds in oil, add chopped onions and sauté." },
        { step: 3, description: "Add turmeric, then the rinsed poha. Mix gently." },
        { step: 4, description: "Cook for 3-4 minutes. Finish with lemon juice and coriander." }
      ],
      likes: randomUserIds(6, 20),
      savedBy: randomUserIds(2, 9),
      createdBy: "Home Chef",
      createdById: "breakfast3",
      isApproved: true
    },
    {
      _id: "breakfast4",
      title: "Aloo Paratha",
      image: "https://i.ytimg.com/vi/3rkXplTcAOA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA3BM4CTpDfbe7QkBOZ57UiSiu2uQ",
      description: "Whole wheat flatbreads stuffed with a flavorful, spiced mashed potato mixture.",
      category: "Breakfast",
      cookingTime: 40,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Whole Wheat Flour", quantity: "2", unit: "cups" },
        { name: "Potatoes", quantity: "3", unit: "large" },
        { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
        { name: "Garam Masala", quantity: "1", unit: "tsp" },
        { name: "Butter or Ghee", quantity: "2", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Boil, peel, and mash the potatoes. Mix in spices." },
        { step: 2, description: "Knead a soft dough with flour and water." },
        { step: 3, description: "Stuff the potato mixture into dough balls and roll out into parathas." },
        { step: 4, description: "Cook on a hot tawa, applying ghee on both sides until golden." }
      ],
      likes: randomUserIds(9, 28),
      savedBy: randomUserIds(4, 14),
      createdBy: "Home Chef",
      createdById: "breakfast4",
      isApproved: true
    },
    {
      _id: "breakfast5",
      title: "Besan Chilla",
      image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/besan-chilla-3.jpg",
      description: "Savory, protein-packed pancakes made from gram flour, perfect for a quick breakfast.",
      category: "Breakfast",
      cookingTime: 15,
      servings: 2,
      difficulty: "Easy",
      ingredients: [
        { name: "Gram Flour (Besan)", quantity: "1", unit: "cup" },
        { name: "Onion", quantity: "1", unit: "small" },
        { name: "Green Chilli", quantity: "1", unit: "" },
        { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
        { name: "Water", quantity: "0.75", unit: "cup" }
      ],
      instructions: [
        { step: 1, description: "Mix gram flour, water, and spices to make a smooth, flowing batter." },
        { step: 2, description: "Add finely chopped onions and chillies." },
        { step: 3, description: "Pour a ladleful onto a hot, greased griddle and spread." },
        { step: 4, description: "Cook until golden on both sides, serve with chutney." }
      ],
      likes: randomUserIds(4, 16),
      savedBy: randomUserIds(1, 7),
      createdBy: "Home Chef",
      createdById: "breakfast5",
      isApproved: true
    },
    // NEW: 6th breakfast recipe
    {
      _id: "breakfast6",
      title: "Idli with Sambar",
      image: "https://static.toiimg.com/thumb/resizemode-4,width-1280,height-720,msid-113810989/113810989.jpg",
      description: "Soft steamed rice cakes served with aromatic lentil vegetable stew.",
      category: "Breakfast",
      cookingTime: 25,
      servings: 3,
      difficulty: "Easy",
      ingredients: [
        { name: "Idli Batter", quantity: "2", unit: "cups" },
        { name: "Toor Dal", quantity: "0.5", unit: "cup" },
        { name: "Sambar Masala", quantity: "1", unit: "tbsp" },
        { name: "Tamarind", quantity: "1", unit: "small" }
      ],
      instructions: [
        { step: 1, description: "Steam idli batter in idli moulds for 10 minutes." },
        { step: 2, description: "Pressure cook toor dal with vegetables and tamarind." },
        { step: 3, description: "Add sambar masala and simmer." },
        { step: 4, description: "Serve hot idli with sambar and coconut chutney." }
      ],
      likes: randomUserIds(12, 35),
      savedBy: randomUserIds(6, 18),
      createdBy: "South Indian Kitchen",
      createdById: "breakfast6",
      isApproved: true
    },
    {
      _id: "vegan1",
      title: "Chana Masala",
      image: "https://www.oliveandmango.com/images/uploads/2023_01_25_creamy_chana_masala_1.jpg",
      description: "A hearty and tangy curry made with chickpeas simmered in an onion-tomato gravy.",
      category: "Vegan",
      cookingTime: 35,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Chickpeas", quantity: "3", unit: "cups" },
        { name: "Onion", quantity: "1", unit: "large" },
        { name: "Tomatoes", quantity: "2", unit: "large" },
        { name: "Chana Masala Spice", quantity: "2", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Sauté onions until golden." },
        { step: 2, description: "Add tomatoes and spices, cook until oil separates." },
        { step: 3, description: "Add chickpeas and water, simmer 15 min." },
        { step: 4, description: "Finish with amchoor powder and coriander." }
      ],
      likes: randomUserIds(7, 22),
      savedBy: randomUserIds(3, 11),
      createdBy: "Home Chef",
      createdById: "vegan1",
      isApproved: true
    },
    {
      _id: "vegan2",
      title: "Baingan Bharta",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Baigan_Bharta_from_Nagpur.JPG",
      description: "Smoky mashed eggplant cooked with peas and tomatoes.",
      category: "Vegan",
      cookingTime: 40,
      servings: 3,
      difficulty: "Medium",
      ingredients: [
        { name: "Eggplant", quantity: "1", unit: "large" },
        { name: "Green Peas", quantity: "0.5", unit: "cup" },
        { name: "Onion", quantity: "1", unit: "large" },
        { name: "Cumin Seeds", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Roast eggplant until charred, peel and mash." },
        { step: 2, description: "Temper cumin, sauté onions." },
        { step: 3, description: "Add tomatoes, spices, peas and mashed eggplant." },
        { step: 4, description: "Cook for 8-10 minutes." }
      ],
      likes: randomUserIds(5, 19),
      savedBy: randomUserIds(2, 9),
      createdBy: "Home Chef",
      createdById: "vegan2",
      isApproved: true
    },
    {
      _id: "vegan3",
      title: "Dal Tadka",
      image: "https://img.freepik.com/free-photo/indian-dhal-spicy-curry-bowl-spices-herbs-rustic-black-wooden-table_2829-18712.jpg",
      description: "Yellow lentils tempered with ghee, cumin and red chilies.",
      category: "Vegan",
      cookingTime: 30,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Toor Dal", quantity: "1", unit: "cup" },
        { name: "Tomato", quantity: "1", unit: "" },
        { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
        { name: "Dried Red Chilies", quantity: "2", unit: "" }
      ],
      instructions: [
        { step: 1, description: "Pressure cook dal with turmeric." },
        { step: 2, description: "Whisk dal to smooth consistency." },
        { step: 3, description: "Prepare tadka with cumin, chilies." },
        { step: 4, description: "Pour tadka over dal and serve." }
      ],
      likes: randomUserIds(8, 26),
      savedBy: randomUserIds(4, 13),
      createdBy: "Home Chef",
      createdById: "vegan3",
      isApproved: true
    },
    {
      _id: "vegan4",
      title: "Vegan Vegetable Biryani",
      image: "https://images.getrecipekit.com/20210917112249-veg-biryani.jpg?aspect_ratio=16:9&quality=90",
      description: "Fragrant basmati rice layered with spiced vegetables.",
      category: "Vegan",
      cookingTime: 50,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Basmati Rice", quantity: "2", unit: "cups" },
        { name: "Mixed Vegetables", quantity: "3", unit: "cups" },
        { name: "Biryani Masala", quantity: "2", unit: "tbsp" },
        { name: "Fried Onions", quantity: "0.5", unit: "cup" }
      ],
      instructions: [
        { step: 1, description: "Parboil rice and drain." },
        { step: 2, description: "Sauté vegetables with masala." },
        { step: 3, description: "Layer rice and vegetables, top with fried onions." },
        { step: 4, description: "Cook on low heat (dum) for 20 minutes." }
      ],
      likes: randomUserIds(11, 32),
      savedBy: randomUserIds(5, 16),
      createdBy: "Home Chef",
      createdById: "vegan4",
      isApproved: true
    },
    {
      _id: "vegan5",
      title: "Aloo Gobi",
      image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/aloo-gobi-recipe-500x375.jpg",
      description: "Dry curry of potatoes and cauliflower with turmeric and cumin.",
      category: "Vegan",
      cookingTime: 30,
      servings: 3,
      difficulty: "Easy",
      ingredients: [
        { name: "Potatoes", quantity: "2", unit: "medium" },
        { name: "Cauliflower", quantity: "1", unit: "small" },
        { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
        { name: "Turmeric", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Heat oil, add cumin." },
        { step: 2, description: "Add potatoes, sauté 5 min." },
        { step: 3, description: "Add cauliflower and spices, mix well." },
        { step: 4, description: "Cover and cook until tender." }
      ],
      likes: randomUserIds(6, 21),
      savedBy: randomUserIds(3, 10),
      createdBy: "Home Chef",
      createdById: "vegan5",
      isApproved: true
    },
    // NEW: extra vegan recipe (total 6 vegan)
    {
      _id: "vegan6",
      title: "Vegetable Korma",
      image: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/09/vegetable-korma-recipe-1.jpg",
      description: "Mixed vegetables in a creamy coconut and cashew gravy.",
      category: "Vegan",
      cookingTime: 40,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Mixed Veggies", quantity: "3", unit: "cups" },
        { name: "Coconut Milk", quantity: "1", unit: "cup" },
        { name: "Cashew Paste", quantity: "0.25", unit: "cup" },
        { name: "Korma Masala", quantity: "2", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Sauté vegetables with spices." },
        { step: 2, description: "Add cashew paste and cook 5 min." },
        { step: 3, description: "Pour coconut milk, simmer 10 min." },
        { step: 4, description: "Garnish with coriander and serve." }
      ],
      likes: randomUserIds(9, 27),
      savedBy: randomUserIds(4, 14),
      createdBy: "Home Chef",
      createdById: "vegan6",
      isApproved: true
    },
    {
      _id: "dessert1",
      title: "Gulab Jamun",
      image: "https://www.cadburydessertscorner.com/hs-fs/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp",
      description: "Soft fried milk-solid dumplings in sugar syrup.",
      category: "Desserts",
      cookingTime: 60,
      servings: 6,
      difficulty: "Medium",
      ingredients: [
        { name: "Milk Powder", quantity: "1", unit: "cup" },
        { name: "All-Purpose Flour", quantity: "0.25", unit: "cup" },
        { name: "Sugar", quantity: "2", unit: "cups" },
        { name: "Cardamom", quantity: "0.5", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Make dough with milk powder and flour." },
        { step: 2, description: "Form smooth balls." },
        { step: 3, description: "Deep fry on low heat." },
        { step: 4, description: "Soak in warm sugar syrup for 2 hrs." }
      ],
      likes: randomUserIds(15, 45),
      savedBy: randomUserIds(8, 22),
      createdBy: "Mithai Wala",
      createdById: "dessert1",
      isApproved: true
    },
    {
      _id: "dessert2",
      title: "Gajar ka Halwa",
      image: "https://vanitascorner.com/wp-content/uploads/2018/01/carrothalwa.jpg",
      description: "Slow cooked carrot pudding with milk and nuts.",
      category: "Desserts",
      cookingTime: 90,
      servings: 6,
      difficulty: "Medium",
      ingredients: [
        { name: "Red Carrots", quantity: "1", unit: "kg" },
        { name: "Milk", quantity: "1", unit: "litre" },
        { name: "Sugar", quantity: "1", unit: "cup" },
        { name: "Ghee", quantity: "4", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Grate carrots." },
        { step: 2, description: "Simmer with milk until reduced." },
        { step: 3, description: "Add sugar and ghee, stir until thick." },
        { step: 4, description: "Garnish with fried nuts." }
      ],
      likes: randomUserIds(10, 38),
      savedBy: randomUserIds(6, 17),
      createdBy: "Home Chef",
      createdById: "dessert2",
      isApproved: true
    },
    {
      _id: "dessert3",
      title: "Rasgulla",
      image: "https://easysavorymeals.com/wp-content/uploads/2025/09/homemade-Rasgulla-Recipe.jpg",
      description: "Spongy cottage cheese balls in light sugar syrup.",
      category: "Desserts",
      cookingTime: 60,
      servings: 6,
      difficulty: "Hard",
      ingredients: [
        { name: "Full-Fat Milk", quantity: "1", unit: "litre" },
        { name: "Lemon Juice", quantity: "2", unit: "tbsp" },
        { name: "Sugar", quantity: "1.5", unit: "cups" }
      ],
      instructions: [
        { step: 1, description: "Curdle milk to get chenna." },
        { step: 2, description: "Knead chenna smooth, make balls." },
        { step: 3, description: "Cook in sugar syrup under pressure." }
      ],
      likes: randomUserIds(12, 40),
      savedBy: randomUserIds(7, 20),
      createdBy: "Bengal Sweets",
      createdById: "dessert3",
      isApproved: true
    },
    {
      _id: "dessert4",
      title: "Kheer (Rice Pudding)",
      image: "https://api.flavournetwork.ca/wp-content/uploads/2023/03/kheer-feat.jpg?w=3840&quality=75",
      description: "Creamy rice pudding with cardamom and nuts.",
      category: "Desserts",
      cookingTime: 45,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Basmati Rice", quantity: "0.25", unit: "cup" },
        { name: "Milk", quantity: "1", unit: "litre" },
        { name: "Sugar", quantity: "0.5", unit: "cup" },
        { name: "Cardamom", quantity: "0.5", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Wash and soak rice." },
        { step: 2, description: "Boil milk, add rice." },
        { step: 3, description: "Simmer until rice is cooked and milk thickens." },
        { step: 4, description: "Add sugar and cardamom. Serve chilled or warm." }
      ],
      likes: randomUserIds(9, 29),
      savedBy: randomUserIds(5, 15),
      createdBy: "Home Chef",
      createdById: "dessert4",
      isApproved: true
    },
    {
      _id: "dessert5",
      title: "Jalebi",
      image: "https://static.toiimg.com/thumb/53099699.cms?width=1200&height=900",
      description: "Crispy fermented batter swirls soaked in saffron syrup.",
      category: "Desserts",
      cookingTime: 30,
      servings: 4,
      difficulty: "Hard",
      ingredients: [
        { name: "Flour", quantity: "1", unit: "cup" },
        { name: "Yogurt", quantity: "2", unit: "tbsp" },
        { name: "Sugar", quantity: "2", unit: "cups" },
        { name: "Saffron", quantity: "1", unit: "pinch" }
      ],
      instructions: [
        { step: 1, description: "Make batter, ferment overnight." },
        { step: 2, description: "Prepare sugar syrup." },
        { step: 3, description: "Pipe spirals into hot oil, fry crisp." },
        { step: 4, description: "Soak in warm syrup for 1 minute." }
      ],
      likes: randomUserIds(13, 42),
      savedBy: randomUserIds(6, 18),
      createdBy: "Home Chef",
      createdById: "dessert5",
      isApproved: true
    },
    {
      _id: "quickbite1",
      title: "Samosa",
      image: "https://cdn.pixabay.com/photo/2024/01/29/21/50/ai-generated-8540840_640.jpg",
      description: "Crispy pastry filled with spiced potatoes and peas.",
      category: "Quick Bites",
      cookingTime: 50,
      servings: 6,
      difficulty: "Medium",
      ingredients: [
        { name: "Flour", quantity: "2", unit: "cups" },
        { name: "Potatoes", quantity: "3", unit: "medium" },
        { name: "Green Peas", quantity: "0.5", unit: "cup" },
        { name: "Samosa Masala", quantity: "1", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Make stiff dough, rest." },
        { step: 2, description: "Prepare potato filling." },
        { step: 3, description: "Shape samosas, seal edges." },
        { step: 4, description: "Deep fry until golden." }
      ],
      likes: randomUserIds(18, 50),
      savedBy: randomUserIds(9, 25),
      createdBy: "Street Food King",
      createdById: "quickbite1",
      isApproved: true
    },
    {
      _id: "quickbite2",
      title: "Paneer Pakora",
      image: "https://www.vegrecipesofindia.com/wp-content/uploads/2025/03/paneer-pakora-2.jpg",
      description: "Crispy gram flour battered paneer cubes.",
      category: "Quick Bites",
      cookingTime: 25,
      servings: 3,
      difficulty: "Easy",
      ingredients: [
        { name: "Paneer", quantity: "200", unit: "g" },
        { name: "Gram Flour", quantity: "1", unit: "cup" },
        { name: "Red Chilli Powder", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Cut paneer into cubes." },
        { step: 2, description: "Make spiced besan batter." },
        { step: 3, description: "Coat paneer and deep fry." },
        { step: 4, description: "Serve hot with chutney." }
      ],
      likes: randomUserIds(7, 24),
      savedBy: randomUserIds(3, 12),
      createdBy: "Home Chef",
      createdById: "quickbite2",
      isApproved: true
    },
    {
      _id: "quickbite3",
      title: "Aloo Tikki",
      image: "https://www.indianveggiedelight.com/wp-content/uploads/2023/07/aloo-tikki-featured-500x375.jpg",
      description: "Spiced potato patties, pan-fried until crispy.",
      category: "Quick Bites",
      cookingTime: 30,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Potatoes", quantity: "4", unit: "large" },
        { name: "Bread", quantity: "2", unit: "slices" },
        { name: "Chaat Masala", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Boil and mash potatoes." },
        { step: 2, description: "Add spices and bread (soaked)." },
        { step: 3, description: "Shape into tikkis." },
        { step: 4, description: "Shallow fry until golden." }
      ],
      likes: randomUserIds(8, 27),
      savedBy: randomUserIds(4, 13),
      createdBy: "Home Chef",
      createdById: "quickbite3",
      isApproved: true
    },
    {
      _id: "quickbite4",
      title: "Bhel Puri",
      image: "https://www.seema.com/wp-content/uploads/2022/08/Bhel-Puri-recipe.jpg",
      description: "Puffed rice with veggies and tangy chutneys.",
      category: "Quick Bites",
      cookingTime: 10,
      servings: 2,
      difficulty: "Easy",
      ingredients: [
        { name: "Puffed Rice", quantity: "2", unit: "cups" },
        { name: "Sev", quantity: "0.25", unit: "cup" },
        { name: "Tamarind Chutney", quantity: "2", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Combine puffed rice and chopped veggies." },
        { step: 2, description: "Add chutneys and mix quickly." },
        { step: 3, description: "Top with sev and serve immediately." }
      ],
      likes: randomUserIds(6, 20),
      savedBy: randomUserIds(2, 9),
      createdBy: "Mumbai Chaat",
      createdById: "quickbite4",
      isApproved: true
    },
    {
      _id: "quickbite5",
      title: "Pav Bhaji",
      image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg",
      description: "Mashed vegetable curry served with buttered bread rolls.",
      category: "Quick Bites",
      cookingTime: 30,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Mixed Veggies", quantity: "4", unit: "cups" },
        { name: "Pav Bhaji Masala", quantity: "2", unit: "tbsp" },
        { name: "Butter", quantity: "3", unit: "tbsp" },
        { name: "Pav (Bread)", quantity: "8", unit: "" }
      ],
      instructions: [
        { step: 1, description: "Boil and mash vegetables." },
        { step: 2, description: "Sauté onions, add masala and veggies." },
        { step: 3, description: "Cook bhaji for 10-15 min." },
        { step: 4, description: "Toast pav in butter, serve hot." }
      ],
      likes: randomUserIds(14, 48),
      savedBy: randomUserIds(7, 21),
      createdBy: "Home Chef",
      createdById: "quickbite5",
      isApproved: true
    },
    // NEW: extra quick bite (total 6)
    {
      _id: "quickbite6",
      title: "Vada Pav",
      image: "https://www.archanaskitchen.com/images/archanaskitchen/0-Archanas-Kitchen-Recipes/2018/Mumbai_Style_Vada_Pav_Recipe_400.jpg",
      description: "Spiced potato fritter sandwich in a pav bun.",
      category: "Quick Bites",
      cookingTime: 25,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Potatoes", quantity: "3", unit: "large" },
        { name: "Gram Flour", quantity: "1", unit: "cup" },
        { name: "Garlic Chutney", quantity: "2", unit: "tbsp" },
        { name: "Pav Buns", quantity: "4", unit: "" }
      ],
      instructions: [
        { step: 1, description: "Make potato filling." },
        { step: 2, description: "Coat in besan batter and deep fry." },
        { step: 3, description: "Slice pav, apply chutney." },
        { step: 4, description: "Place vada inside, serve with fried green chili." }
      ],
      likes: randomUserIds(10, 33),
      savedBy: randomUserIds(5, 16),
      createdBy: "Home Chef",
      createdById: "quickbite6",
      isApproved: true
    },
    {
      _id: "dinner1",
      title: "Butter Chicken",
      image: "https://nickskitchen.com/wp-content/uploads/2025/08/NK_Butter-Ckn_1-scaled.jpg",
      description: "Creamy tomato and butter chicken gravy.",
      category: "Dinner",
      cookingTime: 50,
      servings: 4,
      difficulty: "Medium",
      ingredients: [
        { name: "Boneless Chicken", quantity: "500", unit: "g" },
        { name: "Tomato Puree", quantity: "2", unit: "cups" },
        { name: "Fresh Cream", quantity: "0.5", unit: "cup" },
        { name: "Butter", quantity: "3", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Marinate chicken, grill or pan-fry." },
        { step: 2, description: "Make tomato gravy with butter." },
        { step: 3, description: "Add chicken pieces, simmer." },
        { step: 4, description: "Finish with cream and garam masala." }
      ],
      likes: randomUserIds(20, 60),
      savedBy: randomUserIds(10, 30),
      createdBy: "Home Chef",
      createdById: "dinner1",
      isApproved: true
    },
    {
      _id: "dinner2",
      title: "Palak Paneer",
      image: "https://www.chefajaychopra.com/assets/img/recipe/1-1666433552palakpaneer1webp.webp",
      description: "Paneer cubes in smooth spinach gravy.",
      category: "Dinner",
      cookingTime: 40,
      servings: 3,
      difficulty: "Medium",
      ingredients: [
        { name: "Paneer", quantity: "250", unit: "g" },
        { name: "Spinach", quantity: "2", unit: "bunches" },
        { name: "Onion", quantity: "1", unit: "large" }
      ],
      instructions: [
        { step: 1, description: "Blanch spinach, make puree." },
        { step: 2, description: "Sauté onions and spices." },
        { step: 3, description: "Add spinach puree and cook." },
        { step: 4, description: "Add paneer cubes, simmer." }
      ],
      likes: randomUserIds(9, 30),
      savedBy: randomUserIds(5, 14),
      createdBy: "Home Chef",
      createdById: "dinner2",
      isApproved: true
    },
    {
      _id: "dinner3",
      title: "Rogan Josh",
      image: "https://silkroadrecipes.com/wp-content/uploads/2024/11/Rogan-Josh-Indian-Lamb-Curry-square.jpg",
      description: "Aromatic Kashmiri lamb curry.",
      category: "Dinner",
      cookingTime: 90,
      servings: 4,
      difficulty: "Hard",
      ingredients: [
        { name: "Lamb", quantity: "1", unit: "kg" },
        { name: "Yogurt", quantity: "1", unit: "cup" },
        { name: "Kashmiri Red Chilli", quantity: "1", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Brown lamb pieces." },
        { step: 2, description: "Add spices and yogurt." },
        { step: 3, description: "Cook covered until tender." }
      ],
      likes: randomUserIds(12, 38),
      savedBy: randomUserIds(6, 18),
      createdBy: "Home Chef",
      createdById: "dinner3",
      isApproved: true
    },
    {
      _id: "dinner4",
      title: "Fish Curry",
      image: "https://www.thedeliciouscrescent.com/wp-content/uploads/2023/07/Fish-Curry-4.jpg",
      description: "Tangy South Indian fish curry with coconut.",
      category: "Dinner",
      cookingTime: 35,
      servings: 3,
      difficulty: "Medium",
      ingredients: [
        { name: "Fish Steaks", quantity: "500", unit: "g" },
        { name: "Coconut", quantity: "1", unit: "cup" },
        { name: "Tamarind", quantity: "1", unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Marinate fish." },
        { step: 2, description: "Grind coconut and spices." },
        { step: 3, description: "Cook paste with tamarind." },
        { step: 4, description: "Add fish and simmer gently." }
      ],
      likes: randomUserIds(8, 25),
      savedBy: randomUserIds(4, 12),
      createdBy: "Home Chef",
      createdById: "dinner4",
      isApproved: true
    },
    {
      _id: "dinner5",
      title: "Rajma Masala",
      image: "https://img-cdn.publive.online/fit-in/640x430/filters:format(webp)/sanjeev-kapoor/media/media_files/2025/01/18/iI25V4epXhJwy1Mxw4EV.jpg",
      description: "Red kidney beans in thick gravy.",
      category: "Dinner",
      cookingTime: 60,
      servings: 4,
      difficulty: "Easy",
      ingredients: [
        { name: "Kidney Beans", quantity: "1", unit: "cup" },
        { name: "Onion", quantity: "2", unit: "large" },
        { name: "Tomatoes", quantity: "3", unit: "large" }
      ],
      instructions: [
        { step: 1, description: "Soak rajma overnight, pressure cook." },
        { step: 2, description: "Sauté onion, add tomatoes and spices." },
        { step: 3, description: "Add cooked rajma, simmer." }
      ],
      likes: randomUserIds(13, 40),
      savedBy: randomUserIds(7, 20),
      createdBy: "Punjabi Kitchen",
      createdById: "dinner5",
      isApproved: true
    }
  ];

  return recipesData;
}, []);
  // Fixed carousel images with proper URLs
  const carouselImages = [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
    'https://greektownchicago.org/wp-content/uploads/2023/07/blog3_Recipe-e1689338717450.jpg',
    'https://rfdtv.brightspotgocdn.com/dims4/default/9665882/2147483647/strip/true/crop/960x538+0+148/resize/500x280!/quality/90/?url=https%3A%2F%2Fbrightspot-go-k1-rfdtv.s3.us-east-1.amazonaws.com%2Fbrightspot%2Ff3%2F29%2Fd68bc4f94c9997f76b10a5f3a138%2Fbarbecue-chipotle-burgers-ncba.jpg'
  ];

  // Testimonials data
  const testimonials = [
    {
      review: "This recipe platform is absolutely amazing! So many great ideas!",
      name: "Ananya Sharma"
    },
    {
      review: "Simple UI, fast recipes, and it actually helped me learn cooking!",
      name: "Rohan Mehta"
    },
    {
      review: "Loved the save feature. I can now collect all my favorite recipes!",
      name: "Sneha Roy"
    },
    {
      review: "Every recipe I've tried from here has turned out great. Highly recommend!",
      name: "Arjun Verma"
    },
    {
      review: "It's like having a digital cookbook. I use it every day!",
      name: "Priya Singh"
    }
  ];

  // Categories data
  const categories = ["All", "Breakfast", "Vegan", "Desserts", "Quick Bites", "Dinner"];

  // Fetch recipes from backend - FIXED VERSION
const fetchRecipes = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const filters =
      selectedCategory !== "All"
        ? { category: selectedCategory }
        : {};

    const response = await getRecipes(filters);

    console.log("API Response:", response);

    // ✅ Safe optional chaining
    const mongoRecipes = response?.data?.recipes;

    if (response?.data?.success && Array.isArray(mongoRecipes)) {
      setRecipes([...mongoRecipes, ...manualRecipes]);
    } else {
      console.warn("Invalid API format, using manual recipes");
      setRecipes([...manualRecipes]);
    }

  } catch (err) {
    console.error("Fetch error:", err);

    setError("Server not responding. Showing local recipes.");
    setRecipes([...manualRecipes]); // fallback
  } finally {
    setLoading(false);
  }
}, [selectedCategory, manualRecipes ]); // ❗ REMOVE manualRecipes from dependency

 useEffect(() => {
  fetchRecipes();
}, [fetchRecipes]); 

  // Carousel auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const results = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSearchQuery("");
  };

  // Handle recipe actions - FIXED VERSION
 const handleLike = async (recipeId, e) => {
  if (e) e.stopPropagation();

  if (!currentUser) {
    toast.error('Please login to like recipes');
    navigate('/auth');
    return;
  }

  // ❌ Prevent manual recipes API call
  if (recipeId.startsWith("manual") || recipeId.startsWith("breakfast") || recipeId.startsWith("vegan") || recipeId.startsWith("dessert") || recipeId.startsWith("quickbite") || recipeId.startsWith("dinner")) {
    toast.info("Demo recipe cannot be liked");
    return;
  }

  try {
    // ✅ Optimistic update
    setRecipes(prev =>
      prev.map(recipe => {
        if (recipe._id === recipeId) {
          const likes = recipe.likes || [];
          const isLiked = likes.includes(currentUser.uid);

          return {
            ...recipe,
            likes: isLiked
              ? likes.filter(id => id !== currentUser.uid)
              : [...likes, currentUser.uid]
          };
        }
        return recipe;
      })
    );

    const response = await likeRecipe(recipeId, {
      userId: currentUser.uid,
      userEmail: currentUser.email
    });

    console.log("Like response:", response.data);

    if (response?.data?.success && response?.data?.recipe) {
      setRecipes(prev =>
        prev.map(recipe =>
          recipe._id === recipeId ? response.data.recipe : recipe
        )
      );
    }

  } catch (error) {
    console.error("Like error:", error);

    // ❗ revert
    fetchRecipes();

    toast.error("Error liking recipe");
  }
};

const handleSave = async (recipeId, e) => {
  if (e) e.stopPropagation();

  if (!currentUser) {
    toast.error('Please login to save recipes');
    navigate('/auth');
    return;
  }

  // ❌ Prevent manual recipes API call
  if (recipeId.startsWith("manual") || recipeId.startsWith("breakfast") || recipeId.startsWith("vegan") || recipeId.startsWith("dessert") || recipeId.startsWith("quickbite") || recipeId.startsWith("dinner")) {
    toast.info("Demo recipe cannot be saved");
    return;
  }

  try {
    let isSavedNow = false;

    // ✅ Optimistic update
    setRecipes(prev =>
      prev.map(recipe => {
        if (recipe._id === recipeId) {
          const savedBy = recipe.savedBy || [];
          const isSaved = savedBy.includes(currentUser.uid);

          isSavedNow = !isSaved;

          return {
            ...recipe,
            savedBy: isSaved
              ? savedBy.filter(id => id !== currentUser.uid)
              : [...savedBy, currentUser.uid]
          };
        }
        return recipe;
      })
    );

    const response = await saveRecipe(recipeId, {
      userId: currentUser.uid,
      userEmail: currentUser.email
    });

    console.log("Save response:", response.data);

    if (response?.data?.success && response?.data?.recipe) {
      setRecipes(prev =>
        prev.map(recipe =>
          recipe._id === recipeId ? response.data.recipe : recipe
        )
      );
    }

    // ✅ FIX: no undefined alert
    toast.success(
      isSavedNow
        ? "Recipe saved ❤️"
        : "Removed from saved ❌"
    );

  } catch (error) {
    console.error("Save error:", error);

    // ❗ revert
    fetchRecipes();

    toast.error("Error saving recipe");
  }
};

  const handleRecipeUpdate = (updatedRecipe) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  // Handle recipe card click to navigate to recipe details
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Filter recipes based on selected category
  const filteredRecipes = selectedCategory === "All" 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  // Show more recipes
  const loadMoreRecipes = () => {
    setVisibleRecipes(prev => prev + 12);
  };

  // Reset visible recipes when category changes
  useEffect(() => {
    setVisibleRecipes(12);
  }, [selectedCategory]);

  // Recipes to display (limited by visibleRecipes)
  const recipesToShow = filteredRecipes.slice(0, visibleRecipes);

  // Carousel navigation
  const nextCarousel = () => {
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="home-container">
     {/* Hero Section */}
<div className="hero-section">

  {/* Background Overlay */}
  <div className="hero-overlay"></div>

  <div className="hero-content">
    <h1>
      Share & Discover <span>Delicious</span> Recipes 🍲
    </h1>
    <p>
      Cook, Share & Explore thousands of mouth-watering recipes from around the world.
    </p>
    <br/> <br/> <br/>

    {/* Search Input */}
    <div className="search-container">
      <input
        className="search-input"
        type="search"
        placeholder="🔍 Search recipes, ingredients, dishes..."
        value={searchQuery}
        onChange={handleSearchChange}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Search Popup */}
      {showPopup && (
        <div className="search-popup">
          {searchResults.length > 0 ? (
            searchResults.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipe/${recipe._id}`}
                className="popup-item"
                onClick={handleClosePopup}
              >
                <img src={recipe.image} alt={recipe.title} />
                <div className="popup-info">
                  <span className="popup-title">{recipe.title}</span>
                  <span className="popup-category">{recipe.category}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-results">No matching results found 😔</p>
          )}
        </div>
      )}
    </div>

    <Link to="/submit-recipe" className="submit-btn">
      🚀 Share Your Recipe
    </Link>
  </div>
</div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={fetchRecipes} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Popular Categories */}
      <section className="categories-section">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category} 
              className={`category-card ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Latest & Trending Recipes */}
      <section className="recipes-section">
        <h2>Latest & Trending Recipes</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading recipes...
          </div>
        ) : (
          <>
            <div className="recipes-count">
              Showing {Math.min(recipesToShow.length, filteredRecipes.length)} of {filteredRecipes.length} recipes
            </div>
            
            <div className="recipes-grid">
              {recipesToShow.map((recipe) => (
                <div 
                  key={recipe._id} 
                  className="recipe-card-wrapper"
                  onClick={() => handleRecipeClick(recipe._id)}
                >
                  <RecipeCard 
                    recipe={recipe}
                    onLike={handleLike}
                    onSave={handleSave}
                    currentUser={currentUser}
                    onUpdate={handleRecipeUpdate}
                    onViewClick={() => handleRecipeClick(recipe._id)}
                  />
                </div>
              ))}
            </div>

            {/* View More Button */}
            {filteredRecipes.length > visibleRecipes && (
              <div className="view-more-container">
                <button onClick={loadMoreRecipes} className="view-more-btn">
                  Load More Recipes ({filteredRecipes.length - visibleRecipes} more)
                </button>
              </div>
            )}
          </>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <div className="no-recipes">
            <h3>No recipes found</h3>
            <p>Try selecting a different category or submit your own recipe!</p>
            <Link to="/submit-recipe" className="create-recipe-link">
              Create Your First Recipe
            </Link>
          </div>
        )}
      </section>

     {/* Premium Recipe Spotlight */}
<section className="carousel-section">
  <h2 className="carousel-title">🔥 Trending Recipes</h2>

  <div className="carousel-container">
    <div className="carousel">

      <div className="carousel-inner">
        {carouselImages.map((imgSrc, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === currentCarouselIndex ? "active" : ""
            }`}
          >
            <img src={imgSrc} className="carousel-image" alt="recipe" />

            {/* Overlay Content */}
            <div className="carousel-overlay">
              <h3>Delicious Dish #{index + 1}</h3>
              <p>Explore this amazing recipe 🍽️</p>
              <button className="view-btn">View Recipe</button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control prev" onClick={prevCarousel}>
        ❮
      </button>
      <button className="carousel-control next" onClick={nextCarousel}>
        ❯
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${
              index === currentCarouselIndex ? "active" : ""
            }`}
            onClick={() => setCurrentCarouselIndex(index)}
          />
        ))}
      </div>
    </div>
  </div>
</section>

      {/* User Testimonials */}
      <section className="testimonials-section">
        <h2 className="testimonials-heading">What Our Users Say</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="review">"{testimonial.review}"</p>
              <h4 className="user-name">– {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;