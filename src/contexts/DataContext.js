import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadDietData } from '../utils/dataSources';

const DataContext = createContext({
  categories: [],
  ingredientCategories: {},
  ingredients: [],
  loading: true,
  error: null,
});

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        setLoading(true);
        const data = await loadDietData();
        if (!isMounted) return;
        setCategories(data.categories || []);
        setIngredientCategories(data.ingredientCategories || {});
        setIngredients(data.ingredients || []);
        setError(null);
      } catch (e) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => { isMounted = false; };
  }, []);

  const value = useMemo(() => ({
    categories,
    ingredientCategories,
    ingredients,
    loading,
    error,
  }), [categories, ingredientCategories, ingredients, loading, error]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
