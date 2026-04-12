// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreateRecipe from './pages/create-recipe';
import SavedRecipes from './pages/saved-recipes';
import SubmitRecipe from './pages/SubmitRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (

    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
           <ToastContainer 
              position="top-center"
              autoClose={3000}
              theme="colored"
             />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/saved-recipes" element={<SavedRecipes />} />
              <Route path="/submit-recipe" element={<SubmitRecipe />} />

              {/* ✅ FIX: only one route */}
              <Route path="/recipe/:id" element={<RecipeDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;