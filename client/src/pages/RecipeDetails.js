// src/pages/RecipeDetails.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getRecipe,
  likeRecipe,
  saveRecipe,
  submitFeedback,
  getRecipeFeedback
} from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
import { toast } from 'react-toastify';
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

const manualRecipes = useMemo(() => ([
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
      { name: "Parmesan Cheese", quantity: "100", unit: "g" },
      { name: "Black Pepper", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Bring a large pot of salted water to boil and cook spaghetti according to package instructions." },
      { step: 2, description: "While pasta cooks, fry pancetta in a large pan until crispy." },
      { step: 3, description: "In a bowl, whisk eggs and grated Parmesan cheese together." },
      { step: 4, description: "Drain pasta, reserving 1 cup of pasta water." },
      { step: 5, description: "Quickly mix hot pasta with pancetta, then remove from heat." },
      { step: 6, description: "Add egg and cheese mixture, stirring continuously to create a creamy sauce." },
      { step: 7, description: "Add pasta water as needed to adjust consistency." },
      { step: 8, description: "Season with black pepper and serve immediately." }
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
      { name: "Sweet Potato", quantity: "1", unit: "large" },
      { name: "Avocado", quantity: "1", unit: "" },
      { name: "Chickpeas", quantity: "1", unit: "can" },
      { name: "Spinach", quantity: "2", unit: "cups" },
      { name: "Tahini", quantity: "2", unit: "tbsp" },
      { name: "Lemon Juice", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Cook quinoa according to package instructions." },
      { step: 2, description: "Roast sweet potato cubes in oven at 200°C for 20 minutes." },
      { step: 3, description: "Rinse and drain chickpeas." },
      { step: 4, description: "Prepare tahini dressing by mixing tahini, lemon juice, and water." },
      { step: 5, description: "Arrange all ingredients in a bowl and drizzle with dressing." }
    ],
    likes: [],
    savedBy: [],
    createdBy: "Healthy Eats",
    createdById: "manual2",
    isApproved: true
  },
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
      { name: "Baking Powder", quantity: "2", unit: "tsp" },
      { name: "Sugar", quantity: "2", unit: "tbsp" },
      { name: "Butter", quantity: "2", unit: "tbsp" }
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
      { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
      { name: "Onion", quantity: "1", unit: "" }
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
      { name: "Lemon Juice", quantity: "1", unit: "tbsp" },
      { name: "Green Chillies", quantity: "2", unit: "" }
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
    createdById: "breakfast3",
    isApproved: true
  },
  {
    _id: "breakfast4",
    title: "Upma",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/05/upma-recipe-1.jpg",
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
    createdById: "breakfast4",
    isApproved: true
  },
  {
    _id: "breakfast5",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast5",
    isApproved: true
  },
  {
    _id: "breakfast6",
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
    likes: [],
    savedBy: [],
    createdBy: "Home Chef",
    createdById: "breakfast6",
    isApproved: true
  },
  {
    _id: "vegan1",
    title: "Chana Masala",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl949jrdLZseI1fRYRqcoOiKw-RR8xMmNRNw&s",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Baigan_Bharta_from_Nagpur.JPG",
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
    image: "https://img.freepik.com/free-photo/indian-dhal-spicy-curry-bowl-spices-herbs-rustic-black-wooden-table_2829-18712.jpg",
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
    image: "https://images.getrecipekit.com/20210917112249-veg-biryani.jpg?aspect_ratio=16:9&quality=90",
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
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/aloo-gobi-recipe-500x375.jpg",
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
    image: "https://www.cadburydessertscorner.com/hs-fs/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp",
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
    image: "https://vanitascorner.com/wp-content/uploads/2018/01/carrothalwa.jpg",
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
    image: "https://easysavorymeals.com/wp-content/uploads/2025/09/homemade-Rasgulla-Recipe.jpg",
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
    image: "https://api.flavournetwork.ca/wp-content/uploads/2023/03/kheer-feat.jpg?w=3840&quality=75",
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
    image: "https://static.toiimg.com/thumb/53099699.cms?width=1200&height=900",
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
    image: "https://cdn.pixabay.com/photo/2024/01/29/21/50/ai-generated-8540840_640.jpg",
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
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2025/03/paneer-pakora-2.jpg",
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
    image: "https://www.indianveggiedelight.com/wp-content/uploads/2023/07/aloo-tikki-featured-500x375.jpg",
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
    image: "https://www.seema.com/wp-content/uploads/2022/08/Bhel-Puri-recipe.jpg",
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
    image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg",
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
    image: "https://nickskitchen.com/wp-content/uploads/2025/08/NK_Butter-Ckn_1-scaled.jpg",
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
    image: "https://www.chefajaychopra.com/assets/img/recipe/1-1666433552palakpaneer1webp.webp",
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
    image: "https://silkroadrecipes.com/wp-content/uploads/2024/11/Rogan-Josh-Indian-Lamb-Curry-square.jpg",
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
    image: "https://www.thedeliciouscrescent.com/wp-content/uploads/2023/07/Fish-Curry-4.jpg",
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
    image: "https://img-cdn.publive.online/fit-in/640x430/filters:format(webp)/sanjeev-kapoor/media/media_files/2025/01/18/iI25V4epXhJwy1Mxw4EV.jpg",
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
  }
]), []);

  // 🔥 FETCH RECIPE
 const fetchRecipeData = useCallback(async () => {
  try {
    setLoading(true);
    setError('');

    const manualRecipe = manualRecipes.find(r => r._id === id);
    if (manualRecipe) {
      setRecipe(manualRecipe);
      return;
    }

    const res = await getRecipe(id);

    if (res?.data?.recipe) {
      setRecipe(res.data.recipe);
    } else {
      throw new Error('Recipe not found');
    }

  } catch (err) {
    console.error(err);

    const fallback = manualRecipes.find(r => r._id === id);
    if (fallback) {
      setRecipe(fallback);
    } else {
      setError('Recipe not found');
    }
  } finally {
    setLoading(false);
  }
}, [id, manualRecipes]); // ✅ fixed

  // 🔥 FETCH FEEDBACK
  const fetchFeedback = useCallback(async () => {
    if (!id || id.startsWith('manual')) return;

    try {
      const res = await getRecipeFeedback(id);
      setFeedback(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipeData();
    fetchFeedback();
  }, [fetchRecipeData, fetchFeedback]);

  // 🔥 ACTIONS
  const handleLike = async () => {
    if (!currentUser) return toast.error('Login required');

    if (id.startsWith('manual')) {
      return toast.error('Demo recipe');
    }

    try {
      const res = await likeRecipe(recipe._id, { userId: currentUser.uid });
      setRecipe(res.data.recipe);
    } catch {
      toast.error('Like failed');
    }
  };

  const handleSave = async () => {
    if (!currentUser) return toast.error('Login required');

    if (id.startsWith('manual')) {
      return toast.error('Demo recipe');
    }

    try {
      const res = await saveRecipe(recipe._id, { userId: currentUser.uid });
      setRecipe(res.data.recipe);
    } catch {
      toast.error('Save failed');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Copied!');
  };

  const handleFeedbackSubmit = async (data) => {
    try {
      await submitFeedback(data);
      fetchFeedback();
      setShowFeedbackForm(false);
    } catch {
      toast.error('Feedback failed');
    }
  };

  // 🔥 STATES
  if (loading) return <div className="loading">Loading...</div>;

  if (error || !recipe) {
    return (
      <div className="error">
        <h2>{error}</h2>

        {/* ✅ navigate used → eslint error fixed */}
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const isLiked = currentUser && recipe.likes?.includes(currentUser.uid);
  const isSaved = currentUser && recipe.savedBy?.includes(currentUser.uid);
  const isManual = id.startsWith('manual');

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>

      <img src={recipe.image} alt={recipe.title} />

      <p>{recipe.description}</p>

      <div className="actions">
        <button onClick={handleLike} disabled={isManual}>
          {isLiked ? '❤️' : '🤍'}
        </button>

        <button onClick={handleSave} disabled={isManual}>
          {isSaved ? '⭐' : '☆'}
        </button>

        <button onClick={handleShare}>🔗 Share</button>
      </div>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients?.map((i, idx) => (
          <li key={idx}>{i.name}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.instructions?.map((s, idx) => (
          <li key={idx}>{s.description}</li>
        ))}
      </ol>

      {!isManual && (
        <>
          <button onClick={() => setShowFeedbackForm(true)}>Feedback</button>

          {showFeedbackForm && (
            <FeedbackForm
              recipeId={recipe._id}
              onSubmit={handleFeedbackSubmit}
              onCancel={() => setShowFeedbackForm(false)}
            />
          )}

          <div>
            {feedback.map(f => (
              <div key={f._id}>
                <b>{f.userName}</b> ⭐ {f.rating}
                <p>{f.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetails;