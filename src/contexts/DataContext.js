import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadDietData } from '../utils/dataSources';
import { faoIngredients, faoIngredientCategories } from '../data/faoIngredients';

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
        let ing = data.ingredients || [];
        let catMap = data.ingredientCategories || {};
        // Fallback if CSV empty
        if (ing.length === 0) {
            console.warn('[DataContext] CSV ingredients vacío, usando fallback estático');
            ing = faoIngredients;
        }
        // Merge categories: static ensures feedlot categories present
        catMap = { ...faoIngredientCategories, ...catMap };
        setCategories(data.categories || []);
        setIngredientCategories(catMap);
        setIngredients(ing);
        setError(null);
      } catch (e) {
        if (isMounted) {
          console.error('[DataContext] Error cargando CSV, usando fallback estático', e);
          setIngredientCategories(faoIngredientCategories);
          setIngredients(faoIngredients);
          setError(e);
        }
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
