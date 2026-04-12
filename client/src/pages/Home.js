// src/pages/Home.js
import React, { useEffect, useState } from "react";
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
  const manualRecipes = [
    {
      _id: "manual1",
      title: "Spaghetti Carbonara",
      image: "https://assets.unileversolutions.com/recipes-v2/109396.jpg",
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
      likes: [],
      savedBy: [],
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
      likes: [],
      savedBy: [],
      createdBy: "Healthy Eats",
      createdById: "manual2",
      isApproved: true
    },
    // Add more manual recipes here... (23 more)
    {
      _id: "breakfast1",
      title: "Fluffy Pancakes",
      image: "https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg",
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
      likes: [],
      savedBy: [],
      createdBy: "Breakfast Club",
      createdById: "breakfast1",
      isApproved: true
    },
    
  {
    _id: "breakfast1",
    title: "Masala Dosa",
    image: "https://example.com/images/masala-dosa.jpg",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast1",
    isApproved: true
  },
  {
    _id: "breakfast2",
    title: "Poha",
    image: "https://example.com/images/poha.jpg",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast2",
    isApproved: true
  },
  {
    _id: "breakfast3",
    title: "Upma",
    image: "https://example.com/images/upma.jpg",
    description: "A savory porridge made from semolina, cooked with vegetables and tempered with spices.",
    category: "Breakfast",
    cookingTime: 20,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { name: "Semolina (Rava)", quantity: "1", unit: "cup" },
      { name: "Mixed Vegetables (peas, carrots)", quantity: "0.5", unit: "cup" },
      { name: "Mustard Seeds", quantity: "1", unit: "tsp" },
      { name: "Green Chilli", quantity: "1", unit: "" },
      { name: "Curry Leaves", quantity: "1", unit: "sprig" }
    ],
    instructions: [
      { step: 1, description: "Dry roast the semolina until fragrant and set aside." },
      { step: 2, description: "In a pan, temper mustard seeds, add vegetables and sauté." },
      { step: 3, description: "Add water and bring to a boil. Slowly stir in the roasted semolina." },
      { step: 4, description: "Cook on low heat until the water is absorbed and the upma is thick." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast3",
    isApproved: true
  },
  {
    _id: "breakfast4",
    title: "Aloo Paratha",
    image: "https://example.com/images/aloo-paratha.jpg",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast4",
    isApproved: true
  },
  {
    _id: "breakfast5",
    title: "Besan Chilla",
    image: "https://example.com/images/besan-chilla.jpg",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast5",
    isApproved: true
  },
  {
    _id: "vegan1",
    title: "Chana Masala",
    image: "https://example.com/images/chana-masala.jpg",
    description: "A hearty and tangy curry made with chickpeas simmered in an onion-tomato gravy with aromatic spices.",
    category: "Vegan",
    cookingTime: 35,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { name: "Chickpeas (canned or boiled)", quantity: "3", unit: "cups" },
      { name: "Onion", quantity: "1", unit: "large" },
      { name: "Tomatoes", quantity: "2", unit: "large" },
      { name: "Chana Masala Spice Mix", quantity: "2", unit: "tbsp" },
      { name: "Amchoor (Dry Mango Powder)", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Sauté onions until golden, add ginger-garlic paste and cook." },
      { step: 2, description: "Add tomatoes and spices, cook until the oil separates." },
      { step: 3, description: "Add chickpeas and water, simmer for 15-20 minutes." },
      { step: 4, description: "Finish with amchoor powder and fresh coriander." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "vegan1",
    isApproved: true
  },
  {
    _id: "vegan2",
    title: "Baingan Bharta",
    image: "https://example.com/images/baingan-bharta.jpg",
    description: "Smoky, mashed eggplant cooked with peas, onions, and tomatoes.",
    category: "Vegan",
    cookingTime: 40,
    servings: 3,
    difficulty: "Medium",
    ingredients: [
      { name: "Large Eggplant (Brinjal)", quantity: "1", unit: "" },
      { name: "Green Peas", quantity: "0.5", unit: "cup" },
      { name: "Onion", quantity: "1", unit: "large" },
      { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
      { name: "Mustard Oil", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Roast the eggplant directly over a flame until the skin is charred and the inside is soft." },
      { step: 2, description: "Peel off the skin and mash the pulp." },
      { step: 3, description: "In a pan, temper cumin seeds, sauté onions until golden." },
      { step: 4, description: "Add tomatoes, spices, peas, and the mashed eggplant. Cook for 8-10 minutes." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "vegan2",
    isApproved: true
  },
  {
    _id: "vegan3",
    title: "Dal Tadka",
    image: "https://example.com/images/dal-tadka.jpg",
    description: "Yellow lentils tempered with ghee (or oil), cumin, garlic, and red chilies.",
    category: "Vegan",
    cookingTime: 30,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { name: "Toor Dal (Yellow Lentils)", quantity: "1", unit: "cup" },
      { name: "Tomato", quantity: "1", unit: "" },
      { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
      { name: "Dried Red Chilies", quantity: "2", unit: "" },
      { name: "Turmeric Powder", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Pressure cook the dal with turmeric and water until soft." },
      { step: 2, description: "Whisk the dal to a smooth consistency." },
      { step: 3, description: "Heat oil, add cumin, red chilies, and asafoetida for the tadka." },
      { step: 4, description: "Pour the hot tadka over the cooked dal and serve." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "vegan3",
    isApproved: true
  },
  {
    _id: "vegan4",
    title: "Vegan Vegetable Biryani",
    image: "https://example.com/images/vegan-biryani.jpg",
    description: "Fragrant basmati rice layered with spiced vegetables and cooked on dum (steam).",
    category: "Vegan",
    cookingTime: 50,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      { name: "Basmati Rice", quantity: "2", unit: "cups" },
      { name: "Mixed Vegetables (carrots, beans, cauliflower)", quantity: "3", unit: "cups" },
      { name: "Biryani Masala", quantity: "2", unit: "tbsp" },
      { name: "Saffron (soaked in plant milk)", quantity: "1", unit: "pinch" },
      { name: "Fried Onions", quantity: "0.5", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Parboil the basmati rice and drain." },
      { step: 2, description: "Sauté vegetables with biryani masala and yogurt alternative." },
      { step: 3, description: "In a pot, layer rice and vegetable masala. Top with saffron milk and fried onions." },
      { step: 4, description: "Seal the lid and cook on low heat (dum) for 20 minutes." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "vegan4",
    isApproved: true
  },
  {
    _id: "vegan5",
    title: "Aloo Gobi",
    image: "https://example.com/images/aloo-gobi.jpg",
    description: "A dry curry of potatoes and cauliflower flavored with turmeric and cumin.",
    category: "Vegan",
    cookingTime: 30,
    servings: 3,
    difficulty: "Easy",
    ingredients: [
      { name: "Potatoes", quantity: "2", unit: "medium" },
      { name: "Cauliflower", quantity: "1", unit: "small" },
      { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
      { name: "Turmeric Powder", quantity: "1", unit: "tsp" },
      { name: "Coriander Powder", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Heat oil, add cumin seeds, and let them splutter." },
      { step: 2, description: "Add chopped potatoes and sauté for 5 minutes." },
      { step: 3, description: "Add cauliflower florets and all the spices. Mix well." },
      { step: 4, description: "Cover and cook on low heat until vegetables are tender, stirring occasionally." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "vegan5",
    isApproved: true
  },
  {
    _id: "dessert1",
    title: "Gulab Jamun",
    image: "https://example.com/images/gulab-jamun.jpg",
    description: "Soft, deep-fried milk-solid dumplings soaked in a fragrant sugar syrup.",
    category: "Desserts",
    cookingTime: 60,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      { name: "Milk Powder", quantity: "1", unit: "cup" },
      { name: "All-Purpose Flour", quantity: "0.25", unit: "cup" },
      { name: "Ghee", quantity: "1", unit: "tbsp" },
      { name: "Sugar", quantity: "2", unit: "cups" },
      { name: "Cardamom Powder", quantity: "0.5", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Make a dough with milk powder, flour, ghee, and a little milk. Form smooth balls." },
      { step: 2, description: "Heat sugar with water and cardamom to make a one-string consistency syrup." },
      { step: 3, description: "Deep fry the balls on low heat until golden brown." },
      { step: 4, description: "Soak the hot fried balls in the warm sugar syrup for at least 2 hours." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dessert1",
    isApproved: true
  },
  {
    _id: "dessert2",
    title: "Gajar ka Halwa",
    image: "https://example.com/images/gajar-ka-halwa.jpg",
    description: "A rich, slow-cooked pudding made from grated carrots, milk, sugar, and dry fruits.",
    category: "Desserts",
    cookingTime: 90,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      { name: "Red Carrots", quantity: "1", unit: "kg" },
      { name: "Full-Fat Milk", quantity: "1", unit: "litre" },
      { name: "Sugar", quantity: "1", unit: "cup" },
      { name: "Ghee", quantity: "4", unit: "tbsp" },
      { name: "Almonds and Cashews", quantity: "0.25", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Grate the carrots." },
      { step: 2, description: "In a heavy-bottomed pan, simmer carrots and milk until the milk is reduced and absorbed." },
      { step: 3, description: "Add sugar and ghee. Cook, stirring, until the halwa thickens and darkens." },
      { step: 4, description: "Garnish with fried nuts and serve hot." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dessert2",
    isApproved: true
  },
  {
    _id: "dessert3",
    title: "Rasgulla",
    image: "https://example.com/images/rasgulla.jpg",
    description: "Soft, spongy cottage cheese balls cooked in light sugar syrup.",
    category: "Desserts",
    cookingTime: 60,
    servings: 6,
    difficulty: "Hard",
    ingredients: [
      { name: "Full-Fat Milk", quantity: "1", unit: "litre" },
      { name: "Lemon Juice", quantity: "2", unit: "tbsp" },
      { name: "Sugar", quantity: "1.5", unit: "cups" },
      { name: "Water", quantity: "4", unit: "cups" },
      { name: "Cardamom Powder", quantity: "0.5", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Boil milk, add lemon juice to curdle it. Strain the whey to get chenna (paneer)." },
      { step: 2, description: "Knead the chenna until smooth. Make small, crack-free balls." },
      { step: 3, description: "In a pressure cooker, make a syrup with sugar and water. Gently add the balls." },
      { step: 4, description: "Pressure cook for 10 minutes without the weight. The rasgullas will double in size." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dessert3",
    isApproved: true
  },
  {
    _id: "dessert4",
    title: "Kheer (Rice Pudding)",
    image: "https://example.com/images/kheer.jpg",
    description: "A creamy, aromatic rice pudding made with milk, rice, sugar, and cardamom.",
    category: "Desserts",
    cookingTime: 45,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { name: "Basmati Rice", quantity: "0.25", unit: "cup" },
      { name: "Full-Fat Milk", quantity: "1", unit: "litre" },
      { name: "Sugar", quantity: "0.5", unit: "cup" },
      { name: "Cardamom Powder", quantity: "0.5", unit: "tsp" },
      { name: "Saffron Strands", quantity: "1", unit: "pinch" }
    ],
    instructions: [
      { step: 1, description: "Wash and soak rice for 30 minutes." },
      { step: 2, description: "Boil milk in a heavy-bottomed pan. Add drained rice." },
      { step: 3, description: "Simmer, stirring frequently, until the rice is cooked and the milk reduces by half." },
      { step: 4, description: "Add sugar, cardamom, and saffron. Cook for 5 more minutes. Garnish with nuts." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dessert4",
    isApproved: true
  },
  {
    _id: "dessert5",
    title: "Jalebi",
    image: "https://example.com/images/jalebi.jpg",
    description: "Crispy, deep-fried swirls of fermented batter soaked in saffron sugar syrup.",
    category: "Desserts",
    cookingTime: 30,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      { name: "All-Purpose Flour", quantity: "1", unit: "cup" },
      { name: "Yogurt", quantity: "2", unit: "tbsp" },
      { name: "Saffron", quantity: "1", unit: "pinch" },
      { name: "Sugar", quantity: "2", unit: "cups" },
      { name: "Oil for Frying", quantity: "2", unit: "cups" }
    ],
    instructions: [
      { step: 1, description: "Mix flour, yogurt, and water to make a flowing batter. Ferment for 12-24 hours." },
      { step: 2, description: "Make a one-string syrup with sugar, water, and saffron." },
      { step: 3, description: "Pour the batter into a squeeze bottle and make spiral shapes in hot oil." },
      { step: 4, description: "Fry until crisp, then immediately soak in the warm syrup for a minute." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dessert5",
    isApproved: true
  },
   {
    _id: "quickbite1",
    title: "Samosa",
    image: "https://example.com/images/samosa.jpg",
    description: "Crispy, golden-brown pastry filled with a spiced mixture of potatoes and peas.",
    category: "Quick Bites",
    cookingTime: 50,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      { name: "All-Purpose Flour", quantity: "2", unit: "cups" },
      { name: "Potatoes", quantity: "3", unit: "medium" },
      { name: "Green Peas", quantity: "0.5", unit: "cup" },
      { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
      { name: "Samosa Masala", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Make a stiff dough with flour, salt, and oil. Let it rest." },
      { step: 2, description: "Boil and mash potatoes. Sauté with peas and spices for the filling." },
      { step: 3, description: "Roll dough into ovals, cut in half, form cones, and stuff with filling." },
      { step: 4, description: "Deep fry on medium heat until golden and crispy." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "quickbite1",
    isApproved: true
  },
  {
    _id: "quickbite2",
    title: "Paneer Pakora",
    image: "https://example.com/images/paneer-pakora.jpg",
    description: "Soft cubes of paneer coated in a spiced gram flour batter and deep-fried until crisp.",
    category: "Quick Bites",
    cookingTime: 25,
    servings: 3,
    difficulty: "Easy",
    ingredients: [
      { name: "Paneer", quantity: "200", unit: "g" },
      { name: "Gram Flour (Besan)", quantity: "1", unit: "cup" },
      { name: "Carom Seeds (Ajwain)", quantity: "1", unit: "tsp" },
      { name: "Red Chilli Powder", quantity: "1", unit: "tsp" },
      { name: "Water", quantity: "0.5", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Cut paneer into bite-sized cubes." },
      { step: 2, description: "Make a thick batter with gram flour, spices, and water." },
      { step: 3, description: "Coat the paneer cubes evenly in the batter." },
      { step: 4, description: "Deep fry in hot oil until golden and crisp. Serve with chutney." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "quickbite2",
    isApproved: true
  },
  {
    _id: "quickbite3",
    title: "Aloo Tikki",
    image: "https://example.com/images/aloo-tikki.jpg",
    description: "Spiced potato patties, pan-fried until crispy on the outside and soft on the inside.",
    category: "Quick Bites",
    cookingTime: 30,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { name: "Potatoes", quantity: "4", unit: "large" },
      { name: "Bread Slices", quantity: "2", unit: "" },
      { name: "Cumin Powder", quantity: "1", unit: "tsp" },
      { name: "Chaat Masala", quantity: "1", unit: "tsp" },
      { name: "Oil for Shallow Frying", quantity: "3", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Boil, peel, and mash the potatoes." },
      { step: 2, description: "Soak bread in water, squeeze dry, and add to potatoes along with spices." },
      { step: 3, description: "Mix well and shape into round, flat tikkis." },
      { step: 4, description: "Shallow fry on a hot tawa with oil until both sides are golden brown." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "quickbite3",
    isApproved: true
  },
  {
    _id: "quickbite4",
    title: "Bhel Puri",
    image: "https://example.com/images/bhel-puri.jpg",
    description: "A popular Mumbai street food made with puffed rice, vegetables, and tangy chutneys.",
    category: "Quick Bites",
    cookingTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { name: "Puffed Rice (Murmura)", quantity: "2", unit: "cups" },
      { name: "Sev", quantity: "0.25", unit: "cup" },
      { name: "Onion", quantity: "1", unit: "small" },
      { name: "Tamarind Chutney", quantity: "2", unit: "tbsp" },
      { name: "Green Chutney", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "In a large bowl, combine puffed rice, chopped onions, and tomato." },
      { step: 2, description: "Add both chutneys and a pinch of salt. Mix quickly." },
      { step: 3, description: "Add sev and give it a final gentle mix." },
      { step: 4, description: "Serve immediately to prevent it from getting soggy." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "quickbite4",
    isApproved: true
  },
  {
    _id: "quickbite5",
    title: "Pav Bhaji",
    image: "https://example.com/images/pav-bhaji.jpg",
    description: "A flavorful mash of mixed vegetables served with soft, buttered bread rolls.",
    category: "Quick Bites",
    cookingTime: 30,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      { name: "Mixed Vegetables (potatoes, cauliflower, peas)", quantity: "4", unit: "cups" },
      { name: "Pav (Bread Rolls)", quantity: "8", unit: "" },
      { name: "Pav Bhaji Masala", quantity: "2", unit: "tbsp" },
      { name: "Butter", quantity: "3", unit: "tbsp" },
      { name: "Lemon", quantity: "1", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Pressure cook the mixed vegetables until soft. Mash them coarsely." },
      { step: 2, description: "On a large tawa, heat butter, sauté onions, and add the mashed vegetables and masala." },
      { step: 3, description: "Cook the bhaji, mashing it further, for 10-15 minutes." },
      { step: 4, description: "Toast the pav in butter. Serve the bhaji hot with a dollop of butter and lemon wedge." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "quickbite5",
    isApproved: true
  },
  {
    _id: "dinner1",
    title: "Butter Chicken",
    image: "https://example.com/images/butter-chicken.jpg",
    description: "Tender chicken pieces in a rich, creamy tomato and butter-based gravy.",
    category: "Dinner",
    cookingTime: 50,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      { name: "Boneless Chicken", quantity: "500", unit: "g" },
      { name: "Tomato Puree", quantity: "2", unit: "cups" },
      { name: "Fresh Cream", quantity: "0.5", unit: "cup" },
      { name: "Butter", quantity: "3", unit: "tbsp" },
      { name: "Garam Masala", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Marinate chicken in yogurt and spices, then grill or pan-fry." },
      { step: 2, description: "In a pan, melt butter, add tomato puree and spices. Cook until thick." },
      { step: 3, description: "Add the cooked chicken pieces to the gravy and simmer for 10 minutes." },
      { step: 4, description: "Finish with fresh cream and a sprinkle of garam masala." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dinner1",
    isApproved: true
  },
  {
    _id: "dinner2",
    title: "Palak Paneer",
    image: "https://example.com/images/palak-paneer.jpg",
    description: "Soft paneer cubes in a smooth, flavorful spinach gravy.",
    category: "Dinner",
    cookingTime: 40,
    servings: 3,
    difficulty: "Medium",
    ingredients: [
      { name: "Paneer", quantity: "250", unit: "g" },
      { name: "Spinach (Palak)", quantity: "2", unit: "bunches" },
      { name: "Onion", quantity: "1", unit: "large" },
      { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
      { name: "Cumin Seeds", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Blanch spinach in hot water, then blend into a puree." },
      { step: 2, description: "Sauté onions, ginger-garlic paste, and spices until golden." },
      { step: 3, description: "Add the spinach puree and cook for 8-10 minutes." },
      { step: 4, description: "Add paneer cubes and simmer for 5 minutes. Finish with cream." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dinner2",
    isApproved: true
  },
  {
    _id: "dinner3",
    title: "Rogan Josh",
    image: "https://example.com/images/rogan-josh.jpg",
    description: "Aromatic lamb curry from Kashmir, known for its rich red color and deep flavors.",
    category: "Dinner",
    cookingTime: 90,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      { name: "Lamb, on the bone", quantity: "1", unit: "kg" },
      { name: "Yogurt", quantity: "1", unit: "cup" },
      { name: "Kashmiri Red Chilli Powder", quantity: "1", unit: "tbsp" },
      { name: "Ginger Powder", quantity: "1", unit: "tsp" },
      { name: "Fennel Powder", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Brown the lamb pieces in hot oil." },
      { step: 2, description: "Add spices and sauté until fragrant." },
      { step: 3, description: "Whisk yogurt and add it slowly to the pot, stirring continuously." },
      { step: 4, description: "Add water, cover, and simmer on low heat until the meat is fall-off-the-bone tender." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dinner3",
    isApproved: true
  },
  {
    _id: "dinner4",
    title: "Fish Curry",
    image: "https://example.com/images/fish-curry.jpg",
    description: "A tangy and spicy South Indian-style curry made with coconut and tamarind.",
    category: "Dinner",
    cookingTime: 35,
    servings: 3,
    difficulty: "Medium",
    ingredients: [
      { name: "Fish Steaks (like Kingfish)", quantity: "500", unit: "g" },
      { name: "Coconut", quantity: "1", unit: "cup" },
      { name: "Tamarind Pulp", quantity: "1", unit: "tbsp" },
      { name: "Shallots", quantity: "10", unit: "" },
      { name: "Coriander Seeds", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Marinate fish with turmeric and salt." },
      { step: 2, description: "Grind coconut, shallots, and spices into a smooth paste." },
      { step: 3, description: "Cook the paste in a pot with water and tamarind until it boils." },
      { step: 4, description: "Gently add the fish pieces and simmer for 8-10 minutes until cooked." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dinner4",
    isApproved: true
  },
  {
    _id: "dinner5",
    title: "Rajma Masala",
    image: "https://example.com/images/rajma-masala.jpg",
    description: "A comforting North Indian curry of red kidney beans in a thick onion-tomato gravy.",
    category: "Dinner",
    cookingTime: 60,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { name: "Kidney Beans (Rajma)", quantity: "1", unit: "cup" },
      { name: "Onion", quantity: "2", unit: "large" },
      { name: "Tomatoes", quantity: "3", unit: "large" },
      { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
      { name: "Cumin Powder", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Soak rajma overnight. Pressure cook until soft." },
      { step: 2, description: "Sauté onions until brown, add ginger-garlic paste and tomatoes." },
      { step: 3, description: "Cook until the oil separates. Add spices and cooked rajma." },
      { step: 4, description: "Simmer for 15-20 minutes. Garnish with coriander." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "dinner5",
    isApproved: true
  },
  

  ];

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
  const fetchRecipes = async () => {
  try {
    setLoading(true);
    setError("");

    const filters = selectedCategory !== "All"
      ? { category: selectedCategory }
      : {};

    const response = await getRecipes(filters);

    console.log("API Response:", response.data);

    // ✅ FIXED FORMAT
    if (response.data && response.data.success && Array.isArray(response.data.recipes)) {
      const mongoRecipes = response.data.recipes;

      const allRecipes = [...mongoRecipes, ...manualRecipes];
      setRecipes(allRecipes);

    } else {
      console.log("Unexpected API format:", response.data);
      setRecipes(manualRecipes);
    }

  } catch (error) {
    console.error("Error fetching recipes:", error);
    setError("Failed to load recipes from server. Showing sample recipes.");
    setRecipes(manualRecipes);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory]);

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

    try {
      // Optimistic update first
      setRecipes(prev => 
        prev.map(recipe => {
          if (recipe._id === recipeId) {
            const isLiked = recipe.likes && recipe.likes.includes(currentUser.uid);
            return {
              ...recipe,
              likes: isLiked 
                ? recipe.likes.filter(id => id !== currentUser.uid)
                : [...(recipe.likes || []), currentUser.uid]
            };
          }
          return recipe;
        })
      );

      const response = await likeRecipe(recipeId, { 
        userId: currentUser.uid,
        userEmail: currentUser.email 
      });
      
      console.log('Like response:', response.data);
      
      if (response.data.success && response.data.recipe) {
        // Update with the recipe from database
        setRecipes(prev => 
          prev.map(recipe => 
            recipe._id === recipeId ? response.data.recipe : recipe
          )
        );
      }
    } catch (error) {
      console.error('Error in like:', error);
      // Revert optimistic update on error
      fetchRecipes();
    }
  };

  const handleSave = async (recipeId, e) => {
    if (e) e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please login to save recipes');
      navigate('/auth');
      return;
    }

    try {
      // Optimistic update first
      setRecipes(prev => 
        prev.map(recipe => {
          if (recipe._id === recipeId) {
            const isSaved = recipe.savedBy && recipe.savedBy.includes(currentUser.uid);
            return {
              ...recipe,
              savedBy: isSaved 
                ? recipe.savedBy.filter(id => id !== currentUser.uid)
                : [...(recipe.savedBy || []), currentUser.uid]
            };
          }
          return recipe;
        })
      );

      const response = await saveRecipe(recipeId, { 
        userId: currentUser.uid,
        userEmail: currentUser.email 
      });
      
      console.log('Save response:', response.data);
      
      if (response.data.success) {
        if (response.data.recipe) {
          // Update with the recipe from database
          setRecipes(prev => 
            prev.map(recipe => 
              recipe._id === recipeId ? response.data.recipe : recipe
            )
          );
        }
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error in save:', error);
      // Revert optimistic update on error
      fetchRecipes();
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        toast.error('Error saving recipe. Please try again.');
      }
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