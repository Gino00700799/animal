// Gestor de complejidad de ingredientes para formulación práctica

/**
 * Evalúa la complejidad de una formulación basada en número y tipos de ingredientes
 * @param {array} selectedIngredients - Ingredientes seleccionados
 * @returns {object} Análisis de complejidad
 */
export const evaluateFormulationComplexity = (selectedIngredients) => {
  const totalIngredients = selectedIngredients.length;
  
  // Contar por categorías
  const categoryCount = {};
  selectedIngredients.forEach(ing => {
    categoryCount[ing.category] = (categoryCount[ing.category] || 0) + 1;
  });

  // Evaluar complejidad
  let complexityLevel = 'simple';
  let recommendations = [];
  let warnings = [];

  if (totalIngredients <= 5) {
    complexityLevel = 'simple';
    recommendations.push('Formulación simple y fácil de manejar');
  } else if (totalIngredients <= 10) {
    complexityLevel = 'moderada';
    recommendations.push('Formulación moderadamente compleja, manejable en la práctica');
  } else if (totalIngredients <= 15) {
    complexityLevel = 'compleja';
    warnings.push('Formulación compleja - considere simplificar para uso práctico');
    recommendations.push('Revise si todos los ingredientes son realmente necesarios');
  } else {
    complexityLevel = 'muy_compleja';
    warnings.push('Formulación muy compleja - difícil de manejar en la práctica');
    recommendations.push('Reduzca a máximo 12-15 ingredientes principales');
  }

  // Verificar balance de categorías
  const hasForage = categoryCount['forrajes_secos'] || categoryCount['pastos_verdes'] || categoryCount['ensilados'];
  const hasEnergy = categoryCount['alimentos_energeticos'];
  const hasProtein = categoryCount['suplementos_proteicos'];
  const hasMinerals = categoryCount['minerales'];

  if (!hasForage) warnings.push('Falta base forrajera en la dieta');
  if (!hasEnergy && totalIngredients > 2) recommendations.push('Considere añadir fuente energética');
  if (!hasProtein && totalIngredients > 3) recommendations.push('Considere añadir suplemento proteico');
  if (!hasMinerals && totalIngredients > 4) recommendations.push('Considere añadir suplemento mineral');

  // Detectar redundancias
  const redundancies = [];
  Object.entries(categoryCount).forEach(([category, count]) => {
    if (count > 3) {
      redundancies.push(`Demasiados ingredientes en ${category} (${count})`);
    }
  });

  return {
    totalIngredients,
    complexityLevel,
    categoryCount,
    recommendations,
    warnings,
    redundancies,
    practicalityScore: Math.max(0, 100 - (totalIngredients - 5) * 8) // Decrece después de 5 ingredientes
  };
};

/**
 * Sugiere simplificaciones para formulaciones complejas
 * @param {array} selectedIngredients - Ingredientes seleccionados
 * @returns {array} Sugerencias de simplificación
 */
export const suggestSimplifications = (selectedIngredients) => {
  const analysis = evaluateFormulationComplexity(selectedIngredients);
  const suggestions = [];

  if (analysis.complexityLevel === 'compleja' || analysis.complexityLevel === 'muy_compleja') {
    // Identificar ingredientes con contribuciones menores
    const sortedByContribution = selectedIngredients
      .map(ing => ({
        ...ing,
        contribution: (ing.amount || 0) * (ing.composition.dryMatter / 100)
      }))
      .sort((a, b) => a.contribution - b.contribution);

    const minorIngredients = sortedByContribution.slice(0, Math.floor(selectedIngredients.length * 0.3));
    
    if (minorIngredients.length > 0) {
      suggestions.push({
        type: 'remove_minor',
        title: 'Eliminar ingredientes menores',
        description: `Considere eliminar ingredientes con poca contribución: ${minorIngredients.map(ing => ing.name.es).join(', ')}`,
        ingredients: minorIngredients
      });
    }

    // Sugerir combinaciones por categoría
    Object.entries(analysis.categoryCount).forEach(([category, count]) => {
      if (count > 2) {
        const categoryIngredients = selectedIngredients.filter(ing => ing.category === category);
        suggestions.push({
          type: 'combine_category',
          title: `Simplificar ${category}`,
          description: `Tiene ${count} ingredientes en esta categoría. Considere usar solo los 2 más importantes.`,
          ingredients: categoryIngredients
        });
      }
    });
  }

  return suggestions;
};

/**
 * Límites recomendados por tipo de operación
 */
export const getRecommendedLimits = (operationType = 'comercial') => {
  const limits = {
    'casero': {
      max: 8,
      ideal: 5,
      description: 'Para operaciones caseras o pequeñas'
    },
    'comercial': {
      max: 15,
      ideal: 10,
      description: 'Para operaciones comerciales medianas'
    },
    'industrial': {
      max: 20,
      ideal: 15,
      description: 'Para operaciones industriales grandes'
    },
    'investigacion': {
      max: 25,
      ideal: 12,
      description: 'Para investigación y desarrollo'
    }
  };

  return limits[operationType] || limits['comercial'];
};

export default {
  evaluateFormulationComplexity,
  suggestSimplifications,
  getRecommendedLimits
};