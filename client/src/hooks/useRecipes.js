import { useState, useEffect } from 'react';
import { 
  getRecipes, 
  getRecipe, 
  createRecipe, 
  likeRecipe, 
  saveRecipe,
  getSavedRecipes 
} from '../services/api';

export const useRecipes = (filters = {}) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes(filters);
      setRecipes(response.data.recipes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, refetch: fetchRecipes };
};

export const useRecipe = (id) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipe(id);
        setRecipe(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  return { recipe, loading, error };
};