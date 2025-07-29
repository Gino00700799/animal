// Utilidades para validación nutricional en tiempo real

/**
 * Calcula los requerimientos nutricionales básicos para un animal
 * @param {object} animalData - Datos del animal (peso, ganancia, etc.)
 * @returns {object} Requerimientos calculados
 */
export const calculateBasicRequirements = (animalData) => {
  if (!animalData || !animalData.weight) return null;

  const weight = animalData.weight;
  const dailyGain = animalData.dailyGain || 1.0;
  
  // Cálculos simplificados basados en NRC/FAO
  const dryMatterIntake = weight * 0.025; // 2.5% del peso corporal
  
  // Energía metabolizable (MJ/día)
  const maintenanceEnergy = 0.293 * Math.pow(weight, 0.75);
  const growthEnergy = 16 * dailyGain;
  const totalEnergy = (maintenanceEnergy + growthEnergy) / 0.67; // Convertir a ME
  
  // Proteína cruda (kg/día)
  const proteinPercent = Math.max(12, 16 - (weight - 300) * 0.01); // Decrece con peso
  const totalProtein = dryMatterIntake * proteinPercent / 100;
  
  // Minerales (g/día)
  const calcium = dryMatterIntake * 0.6; // 0.6% de la dieta
  const phosphorus = dryMatterIntake * 0.35; // 0.35% de la dieta
  
  return {
    dryMatterIntake,
    totalEnergy,
    totalProtein,
    calcium,
    phosphorus
  };
};

/**
 * Evalúa la adecuación nutricional de una selección de ingredientes
 * @param {array} selectedIngredients - Ingredientes seleccionados con cantidades
 * @param {object} animalData - Datos del animal
 * @returns {object} Estado de adecuación nutricional
 */
export const evaluateNutritionalAdequacy = (selectedIngredients, animalData) => {
  const requirements = calculateBasicRequirements(animalData);
  if (!requirements || !selectedIngredients.length) {
    return { complete: false, adequacy: {}, deficits: [] };
  }

  // Calcular aportes actuales
  let currentNutrition = {
    energy: 0,
    protein: 0,
    calcium: 0,
    phosphorus: 0,
    dryMatter: 0
  };

  selectedIngredients.forEach(ing => {
    const amount = ing.amount || 0;
    const dmAmount = amount * (ing.composition.dryMatter / 100);
    
    currentNutrition.energy += dmAmount * ing.composition.metabolizableEnergy;
    currentNutrition.protein += dmAmount * ing.composition.crudeProtein / 100;
    currentNutrition.calcium += dmAmount * ing.composition.calcium / 100;
    currentNutrition.phosphorus += dmAmount * ing.composition.phosphorus / 100;
    currentNutrition.dryMatter += dmAmount;
  });

  // Calcular porcentajes de adecuación
  const adequacy = {
    energy: (currentNutrition.energy / requirements.totalEnergy) * 100,
    protein: (currentNutrition.protein / requirements.totalProtein) * 100,
    calcium: (currentNutrition.calcium / requirements.calcium) * 100,
    phosphorus: (currentNutrition.phosphorus / requirements.phosphorus) * 100,
    dryMatter: (currentNutrition.dryMatter / requirements.dryMatterIntake) * 100
  };

  // Identificar déficits
  const deficits = [];
  Object.entries(adequacy).forEach(([nutrient, percentage]) => {
    if (percentage < 90) {
      deficits.push({
        nutrient,
        percentage,
        deficit: requirements[nutrient === 'energy' ? 'totalEnergy' : 
                              nutrient === 'protein' ? 'totalProtein' : nutrient] - 
                currentNutrition[nutrient]
      });
    }
  });

  // Considerar completo si todos >= 95%
  const complete = Object.values(adequacy).every(val => val >= 95);

  return {
    complete,
    adequacy,
    deficits,
    currentNutrition,
    requirements
  };
};

/**
 * Sugiere ingredientes para completar déficits nutricionales
 * @param {array} deficits - Déficits identificados
 * @param {array} availableIngredients - Ingredientes disponibles
 * @returns {array} Sugerencias de ingredientes
 */
export const suggestIngredientsForDeficits = (deficits, availableIngredients) => {
  const suggestions = [];

  deficits.forEach(deficit => {
    let bestIngredients = [];

    switch (deficit.nutrient) {
      case 'energy':
        bestIngredients = availableIngredients
          .filter(ing => ing.composition.metabolizableEnergy > 11)
          .sort((a, b) => b.composition.metabolizableEnergy - a.composition.metabolizableEnergy)
          .slice(0, 3);
        break;
      
      case 'protein':
        bestIngredients = availableIngredients
          .filter(ing => ing.composition.crudeProtein > 20)
          .sort((a, b) => b.composition.crudeProtein - a.composition.crudeProtein)
          .slice(0, 3);
        break;
      
      case 'calcium':
        bestIngredients = availableIngredients
          .filter(ing => ing.composition.calcium > 0.5)
          .sort((a, b) => b.composition.calcium - a.composition.calcium)
          .slice(0, 3);
        break;
      
      case 'phosphorus':
        bestIngredients = availableIngredients
          .filter(ing => ing.composition.phosphorus > 0.3)
          .sort((a, b) => b.composition.phosphorus - a.composition.phosphorus)
          .slice(0, 3);
        break;
    }

    if (bestIngredients.length > 0) {
      suggestions.push({
        deficit: deficit.nutrient,
        percentage: deficit.percentage,
        recommendedIngredients: bestIngredients
      });
    }
  });

  return suggestions;
};

export default {
  calculateBasicRequirements,
  evaluateNutritionalAdequacy,
  suggestIngredientsForDeficits
};