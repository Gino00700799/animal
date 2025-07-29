// Método del Cuadrado de Pearson para formulación de raciones
// Método clásico para balancear dos ingredientes según un nutriente específico

/**
 * Calcula la proporción de dos ingredientes usando el Cuadrado de Pearson
 * @param {object} ingredient1 - Primer ingrediente (usualmente forraje)
 * @param {object} ingredient2 - Segundo ingrediente (usualmente concentrado)
 * @param {number} targetNutrient - Nivel objetivo del nutriente (%)
 * @param {string} nutrientType - Tipo de nutriente ('crudeProtein', 'metabolizableEnergy', etc.)
 * @returns {object} Proporciones calculadas
 */
export const calculatePearsonSquare = (ingredient1, ingredient2, targetNutrient, nutrientType = 'crudeProtein') => {
  // Obtener contenido nutricional de cada ingrediente
  const content1 = getNutrientContent(ingredient1, nutrientType);
  const content2 = getNutrientContent(ingredient2, nutrientType);
  
  // Validar que los ingredientes puedan formar la mezcla objetivo
  if ((content1 > targetNutrient && content2 > targetNutrient) || 
      (content1 < targetNutrient && content2 < targetNutrient)) {
    return {
      error: `No es posible alcanzar ${targetNutrient}% con estos ingredientes. 
              ${ingredient1.name.es}: ${content1}%, ${ingredient2.name.es}: ${content2}%`,
      isValid: false
    };
  }

  // Aplicar el Cuadrado de Pearson
  const diff1 = Math.abs(targetNutrient - content2); // Diferencia cruzada
  const diff2 = Math.abs(targetNutrient - content1); // Diferencia cruzada
  const totalParts = diff1 + diff2;

  // Calcular proporciones
  const proportion1 = (diff1 / totalParts) * 100; // Porcentaje del ingrediente 1
  const proportion2 = (diff2 / totalParts) * 100; // Porcentaje del ingrediente 2

  // Verificar el cálculo
  const resultingNutrient = (content1 * proportion1 + content2 * proportion2) / 100;

  return {
    isValid: true,
    ingredient1: {
      name: ingredient1.name.es,
      content: content1,
      proportion: parseFloat(proportion1.toFixed(1)),
      parts: diff1
    },
    ingredient2: {
      name: ingredient2.name.es,
      content: content2,
      proportion: parseFloat(proportion2.toFixed(1)),
      parts: diff2
    },
    target: targetNutrient,
    result: parseFloat(resultingNutrient.toFixed(2)),
    nutrientType: nutrientType,
    totalParts: totalParts
  };
};

/**
 * Obtiene el contenido nutricional según el tipo especificado
 */
function getNutrientContent(ingredient, nutrientType) {
  const composition = ingredient.composition;
  
  switch (nutrientType) {
    case 'crudeProtein':
      return composition.crudeProtein;
    case 'metabolizableEnergy':
      return composition.metabolizableEnergy;
    case 'calcium':
      return composition.calcium;
    case 'phosphorus':
      return composition.phosphorus;
    case 'fiber':
      return composition.fiber;
    default:
      return composition.crudeProtein;
  }
}

/**
 * Calcula una dieta completa usando múltiples aplicaciones del Cuadrado de Pearson
 * @param {array} ingredients - Ingredientes disponibles
 * @param {object} requirements - Requerimientos nutricionales
 * @param {number} dryMatterIntake - Consumo de materia seca objetivo (kg)
 * @returns {object} Dieta formulada
 */
export const formulateWithPearsonSquare = (ingredients, requirements, dryMatterIntake) => {
  const { crudeProteinRequired, totalME } = requirements;
  
  // Calcular proteína objetivo como porcentaje de la dieta
  const targetProteinPercent = (crudeProteinRequired / dryMatterIntake) * 100;
  const targetEnergyMJ = totalME / dryMatterIntake; // MJ/kg MS

  // Separar ingredientes por categoría
  const forages = ingredients.filter(ing => 
    ing.category === 'forrajes_secos' || ing.category === 'pastos_verdes' || ing.category === 'ensilados'
  );
  const concentrates = ingredients.filter(ing => 
    ing.category === 'alimentos_energeticos' || ing.category === 'suplementos_proteicos'
  );

  if (forages.length === 0 || concentrates.length === 0) {
    return {
      error: 'Se necesita al menos un forraje y un concentrado para usar el Cuadrado de Pearson',
      isValid: false
    };
  }

  // Seleccionar el mejor forraje (mayor relación energía/costo)
  const bestForage = forages.reduce((best, current) => {
    const bestRatio = best.composition.metabolizableEnergy / best.costPerKg;
    const currentRatio = current.composition.metabolizableEnergy / current.costPerKg;
    return currentRatio > bestRatio ? current : best;
  });

  // Seleccionar el mejor concentrado para proteína
  const bestConcentrate = concentrates.reduce((best, current) => {
    const bestRatio = current.composition.crudeProtein / current.costPerKg;
    const currentRatio = current.composition.crudeProtein / current.costPerKg;
    return currentRatio > bestRatio ? current : best;
  });

  // Aplicar Cuadrado de Pearson para proteína
  const proteinBalance = calculatePearsonSquare(
    bestForage, 
    bestConcentrate, 
    targetProteinPercent, 
    'crudeProtein'
  );

  if (!proteinBalance.isValid) {
    return proteinBalance;
  }

  // Calcular cantidades en kg de materia seca
  const forageAmount = (proteinBalance.ingredient1.proportion / 100) * dryMatterIntake;
  const concentrateAmount = (proteinBalance.ingredient2.proportion / 100) * dryMatterIntake;

  // Calcular contribuciones nutricionales
  const forageContribution = calculateNutrientContribution(bestForage, forageAmount);
  const concentrateContribution = calculateNutrientContribution(bestConcentrate, concentrateAmount);

  // Construir la dieta
  const dietComposition = [
    {
      ingredient: bestForage,
      amount: parseFloat(forageAmount.toFixed(2)),
      percentage: proteinBalance.ingredient1.proportion,
      contribution: forageContribution
    },
    {
      ingredient: bestConcentrate,
      amount: parseFloat(concentrateAmount.toFixed(2)),
      percentage: proteinBalance.ingredient2.proportion,
      contribution: concentrateContribution
    }
  ];

  // Calcular totales
  const totalCost = dietComposition.reduce((sum, item) => 
    sum + (item.amount * item.ingredient.costPerKg), 0
  );

  const totalNutrients = {
    energy: forageContribution.energy + concentrateContribution.energy,
    protein: forageContribution.protein + concentrateContribution.protein,
    calcium: (forageContribution.calcium + concentrateContribution.calcium) * 1000, // gramos
    phosphorus: (forageContribution.phosphorus + concentrateContribution.phosphorus) * 1000, // gramos
    dryMatter: forageAmount + concentrateAmount
  };

  // Calcular adecuación
  const adequacy = {
    energy: parseFloat((totalNutrients.energy / totalME * 100).toFixed(1)),
    protein: parseFloat((totalNutrients.protein / crudeProteinRequired * 100).toFixed(1)),
    calcium: parseFloat((totalNutrients.calcium / requirements.calciumRequired * 100).toFixed(1)),
    phosphorus: parseFloat((totalNutrients.phosphorus / requirements.phosphorusRequired * 100).toFixed(1)),
    dryMatter: parseFloat((totalNutrients.dryMatter / dryMatterIntake * 100).toFixed(1))
  };

  return {
    isValid: true,
    method: 'Cuadrado de Pearson',
    composition: dietComposition,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalNutrients,
    adequacy,
    pearsonCalculation: proteinBalance,
    costPerKgDM: parseFloat((totalCost / dryMatterIntake).toFixed(2))
  };
};

/**
 * Calcula la contribución nutricional de un ingrediente (reutilizada de dietOptimization.js)
 */
function calculateNutrientContribution(ingredient, amount) {
  const comp = ingredient.composition;
  const dmAmount = amount * (comp.dryMatter / 100);
  
  return {
    energy: parseFloat((dmAmount * comp.metabolizableEnergy).toFixed(2)),
    protein: parseFloat((dmAmount * comp.crudeProtein / 100).toFixed(2)),
    calcium: parseFloat((dmAmount * comp.calcium / 100).toFixed(3)),
    phosphorus: parseFloat((dmAmount * comp.phosphorus / 100).toFixed(3)),
    dryMatter: parseFloat(dmAmount.toFixed(2))
  };
}

/**
 * Método del Cuadrado de Pearson para tres ingredientes
 * Primero balancea dos, luego incorpora el tercero
 */
export const calculateTriplePearsonSquare = (ingredient1, ingredient2, ingredient3, targetNutrient, nutrientType = 'crudeProtein') => {
  // Paso 1: Balancear los dos primeros ingredientes
  const firstBalance = calculatePearsonSquare(ingredient1, ingredient2, targetNutrient, nutrientType);
  
  if (!firstBalance.isValid) {
    return firstBalance;
  }

  // Crear una "mezcla virtual" de los dos primeros ingredientes
  const mixedContent = (
    getNutrientContent(ingredient1, nutrientType) * firstBalance.ingredient1.proportion +
    getNutrientContent(ingredient2, nutrientType) * firstBalance.ingredient2.proportion
  ) / 100;

  const virtualMix = {
    name: { es: `Mezcla ${ingredient1.name.es}-${ingredient2.name.es}` },
    composition: { [nutrientType]: mixedContent }
  };

  // Paso 2: Balancear la mezcla virtual con el tercer ingrediente
  const secondBalance = calculatePearsonSquare(virtualMix, ingredient3, targetNutrient, nutrientType);

  if (!secondBalance.isValid) {
    return secondBalance;
  }

  // Calcular proporciones finales
  const mixProportion = secondBalance.ingredient1.proportion;
  const ingredient3Proportion = secondBalance.ingredient2.proportion;

  const finalProportion1 = (firstBalance.ingredient1.proportion * mixProportion) / 100;
  const finalProportion2 = (firstBalance.ingredient2.proportion * mixProportion) / 100;

  return {
    isValid: true,
    ingredient1: {
      name: ingredient1.name.es,
      content: getNutrientContent(ingredient1, nutrientType),
      proportion: parseFloat(finalProportion1.toFixed(1))
    },
    ingredient2: {
      name: ingredient2.name.es,
      content: getNutrientContent(ingredient2, nutrientType),
      proportion: parseFloat(finalProportion2.toFixed(1))
    },
    ingredient3: {
      name: ingredient3.name.es,
      content: getNutrientContent(ingredient3, nutrientType),
      proportion: parseFloat(ingredient3Proportion.toFixed(1))
    },
    target: targetNutrient,
    nutrientType: nutrientType,
    steps: [firstBalance, secondBalance]
  };
};

export default {
  calculatePearsonSquare,
  formulateWithPearsonSquare,
  calculateTriplePearsonSquare
};