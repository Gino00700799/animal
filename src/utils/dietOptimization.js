// Optimización de dietas usando programación lineal y Cuadrado de Pearson
// Resuelve el problema de minimizar costo sujeto a restricciones nutricionales

import { formulateWithPearsonSquare } from './pearsonSquare';

/**
 * Resuelve la formulación de dieta usando el método especificado
 * @param {object} requirements - Requerimientos nutricionales
 * @param {array} ingredients - Ingredientes disponibles
 * @param {object} constraints - Restricciones adicionales
 * @param {string} method - Método de optimización ('linear' o 'pearson')
 * @returns {object} Dieta optimizada
 */
export const optimizeDiet = (requirements, ingredients, constraints = {}, method = 'linear') => {
  const {
    totalME,
    crudeProteinRequired,
    calciumRequired,
    phosphorusRequired,
    dryMatterIntake
  } = requirements;

  // Configurar restricciones por categoría de ingrediente (más flexibles)
  const categoryLimits = {
    forrajes_secos: dryMatterIntake * 0.70, // Máximo 70% forrajes secos
    pastos_verdes: dryMatterIntake * 0.80, // Máximo 80% pastos verdes
    ensilados: dryMatterIntake * 0.60, // Máximo 60% ensilados
    alimentos_energeticos: dryMatterIntake * 0.60, // Máximo 60% concentrados (aumentado)
    suplementos_proteicos: dryMatterIntake * 0.25, // Máximo 25% proteína (aumentado)
    minerales: dryMatterIntake * 0.05, // Máximo 5% minerales
    vitaminas: dryMatterIntake * 0.02, // Máximo 2% vitaminas
    aditivos: dryMatterIntake * 0.03, // Máximo 3% aditivos
    ...constraints.categoryLimits
  };

  // Seleccionar método de optimización
  if (method === 'pearson' && ingredients.length >= 2) {
    // Usar Cuadrado de Pearson
    const pearsonSolution = formulateWithPearsonSquare(
      ingredients,
      requirements,
      requirements.dryMatterIntake
    );
    
    if (pearsonSolution.isValid) {
      return pearsonSolution;
    }
    // Si falla Pearson, usar método lineal como respaldo
  }

  // Algoritmo de optimización secuencial (heurístico)
  const solution = sequentialOptimization(
    requirements,
    ingredients,
    categoryLimits
  );

  return { ...solution, method: 'Programación Lineal Heurística' };
};

/**
 * Algoritmo de optimización secuencial
 * Prioriza ingredientes por eficiencia costo-nutriente
 */
function sequentialOptimization(requirements, ingredients, categoryLimits) {
  const {
    totalME,
    crudeProteinRequired,
    calciumRequired,
    phosphorusRequired,
    dryMatterIntake
  } = requirements;

  let remainingEnergy = totalME;
  let remainingProtein = crudeProteinRequired;
  let remainingCalcium = calciumRequired / 1000; // convertir a kg
  let remainingPhosphorus = phosphorusRequired / 1000; // convertir a kg
  let remainingDM = dryMatterIntake;

  const dietComposition = [];
  const categoryUsed = {};

  // Inicializar categorías usadas
  Object.keys(categoryLimits).forEach(cat => {
    categoryUsed[cat] = 0;
  });

  // Paso 1: Satisfacer necesidades básicas con forrajes (MEJORADO)
  const forages = ingredients.filter(ing => 
    ing.category === 'forrajes_secos' || ing.category === 'pastos_verdes'
  );
  
  if (forages.length > 0) {
    // Seleccionar el forraje más eficiente considerando energía, calcio y fósforo
    const bestForage = forages.reduce((best, current) => {
      const bestScore = (best.composition.metabolizableEnergy / best.costPerKg) + 
                       (best.composition.calcium * 10) + (best.composition.phosphorus * 10);
      const currentScore = (current.composition.metabolizableEnergy / current.costPerKg) + 
                          (current.composition.calcium * 10) + (current.composition.phosphorus * 10);
      return currentScore > bestScore ? current : best;
    });

    // Calcular cantidad necesaria para cubrir 50% de la energía con forraje (más realista)
    const forageEnergyTarget = remainingEnergy * 0.5;
    const forageAmountForEnergy = forageEnergyTarget / bestForage.composition.metabolizableEnergy;
    
    const forageAmount = Math.min(
      forageAmountForEnergy,
      categoryLimits[bestForage.category] || dryMatterIntake * 0.7,
      remainingDM * 0.6 // Base de forraje
    );

    if (forageAmount > 0.05) { // Umbral más bajo
      dietComposition.push({
        ingredient: bestForage,
        amount: parseFloat(forageAmount.toFixed(2)),
        contribution: calculateNutrientContribution(bestForage, forageAmount)
      });

      // Actualizar requerimientos restantes
      const contribution = calculateNutrientContribution(bestForage, forageAmount);
      remainingEnergy -= contribution.energy;
      remainingProtein -= contribution.protein;
      remainingCalcium -= contribution.calcium;
      remainingPhosphorus -= contribution.phosphorus;
      remainingDM -= contribution.dryMatter; // Usar DM real, no amount
      categoryUsed[bestForage.category] += forageAmount;
    }
  }

  // Paso 2: Añadir ensilados si es necesario
  if (remainingEnergy > 0) {
    const silages = ingredients.filter(ing => ing.category === 'ensilados');
    
    if (silages.length > 0) {
      const bestSilage = silages.reduce((best, current) => {
        const bestRatio = best.composition.metabolizableEnergy / best.costPerKg;
        const currentRatio = current.composition.metabolizableEnergy / current.costPerKg;
        return currentRatio > bestRatio ? current : best;
      });

      // Calcular cantidad necesaria para cubrir energía restante con ensilado
      const silageEnergyTarget = Math.min(remainingEnergy, remainingEnergy * 0.8);
      const silageAmountForEnergy = silageEnergyTarget / bestSilage.composition.metabolizableEnergy;
      
      const silageAmount = Math.min(
        silageAmountForEnergy,
        categoryLimits[bestSilage.category] || dryMatterIntake * 0.6,
        remainingDM * 0.7 // Permitir más ensilado
      );

      if (silageAmount > 0.1) {
        dietComposition.push({
          ingredient: bestSilage,
          amount: parseFloat(silageAmount.toFixed(2)),
          contribution: calculateNutrientContribution(bestSilage, silageAmount)
        });

        const contribution = calculateNutrientContribution(bestSilage, silageAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter; // Usar DM real
        categoryUsed[bestSilage.category] += silageAmount;
      }
    }
  }

  // Paso 3: Añadir concentrados energéticos
  if (remainingEnergy > 0) {
    const energyFeeds = ingredients.filter(ing => ing.category === 'alimentos_energeticos');
    
    if (energyFeeds.length > 0) {
      const bestEnergy = energyFeeds.reduce((best, current) => {
        const bestRatio = best.composition.metabolizableEnergy / best.costPerKg;
        const currentRatio = current.composition.metabolizableEnergy / current.costPerKg;
        return currentRatio > bestRatio ? current : best;
      });

      // Calcular cantidad necesaria para cubrir toda la energía restante
      const energyAmountForEnergy = remainingEnergy / bestEnergy.composition.metabolizableEnergy;
      
      const energyAmount = Math.min(
        energyAmountForEnergy,
        categoryLimits[bestEnergy.category] || dryMatterIntake * 0.6,
        remainingDM * 0.9 // Permitir mucho más concentrado si es necesario
      );

      if (energyAmount > 0.1) {
        dietComposition.push({
          ingredient: bestEnergy,
          amount: parseFloat(energyAmount.toFixed(2)),
          contribution: calculateNutrientContribution(bestEnergy, energyAmount)
        });

        const contribution = calculateNutrientContribution(bestEnergy, energyAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter; // Usar DM real
        categoryUsed[bestEnergy.category] += energyAmount;
      }
    }
  }

  // Paso 4: Si aún falta energía, añadir más concentrados energéticos (AGRESIVO)
  if (remainingEnergy > totalME * 0.1 && remainingDM > 0.1) { // Si falta más del 10% de energía
    const energyFeeds2 = ingredients.filter(ing => ing.category === 'alimentos_energeticos');
    
    if (energyFeeds2.length > 0) {
      // Buscar el concentrado con más energía
      const highestEnergy = energyFeeds2.reduce((best, current) => {
        return current.composition.metabolizableEnergy > best.composition.metabolizableEnergy ? current : best;
      });

      const additionalEnergyAmount = Math.min(
        remainingEnergy / highestEnergy.composition.metabolizableEnergy,
        remainingDM * 0.95 // Usar casi toda la materia seca restante si es necesario
      );

      if (additionalEnergyAmount > 0.05) { // Umbral más bajo
        dietComposition.push({
          ingredient: highestEnergy,
          amount: parseFloat(additionalEnergyAmount.toFixed(2)),
          contribution: calculateNutrientContribution(highestEnergy, additionalEnergyAmount)
        });

        const contribution = calculateNutrientContribution(highestEnergy, additionalEnergyAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter; // Usar DM real
        categoryUsed[highestEnergy.category] = (categoryUsed[highestEnergy.category] || 0) + additionalEnergyAmount;
      }
    }
  }

  // Paso 5: Añadir suplementos proteicos si es necesario
  if (remainingProtein > 0) {
    const proteinSupplements = ingredients.filter(ing => ing.category === 'suplementos_proteicos');
    
    if (proteinSupplements.length > 0) {
      // Priorizar suplementos que también aporten calcio y fósforo
      const bestProtein = proteinSupplements.reduce((best, current) => {
        const bestScore = (best.composition.crudeProtein / best.costPerKg) + 
                         (best.composition.calcium * 5) + (best.composition.phosphorus * 5);
        const currentScore = (current.composition.crudeProtein / current.costPerKg) + 
                            (current.composition.calcium * 5) + (current.composition.phosphorus * 5);
        return currentScore > bestScore ? current : best;
      });

      const proteinAmount = Math.min(
        remainingProtein / (bestProtein.composition.crudeProtein / 100),
        categoryLimits[bestProtein.category] || dryMatterIntake * 0.25,
        remainingDM * 0.8 // Permitir más proteína si es necesario
      );

      if (proteinAmount > 0.02) { // Umbral más bajo
        dietComposition.push({
          ingredient: bestProtein,
          amount: parseFloat(proteinAmount.toFixed(2)),
          contribution: calculateNutrientContribution(bestProtein, proteinAmount)
        });

        const contribution = calculateNutrientContribution(bestProtein, proteinAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter; // Usar DM real
        categoryUsed[bestProtein.category] += proteinAmount;
      }
    }
  }

  // Paso 6: Añadir fuentes de calcio y fósforo si es necesario
  if (remainingCalcium > calciumRequired * 0.2 / 1000 || remainingPhosphorus > phosphorusRequired * 0.2 / 1000) {
    const mineralSources = ingredients.filter(ing => 
      ing.composition.calcium > 1.0 || ing.composition.phosphorus > 0.5 || 
      ing.category === 'minerales'
    );
    
    if (mineralSources.length > 0) {
      // Buscar la mejor fuente de calcio/fósforo
      const bestMineral = mineralSources.reduce((best, current) => {
        const bestScore = (best.composition.calcium || 0) + (best.composition.phosphorus || 0);
        const currentScore = (current.composition.calcium || 0) + (current.composition.phosphorus || 0);
        return currentScore > bestScore ? current : best;
      });

      const mineralAmount = Math.min(
        Math.max(
          remainingCalcium > 0 ? (remainingCalcium * 1000) / (bestMineral.composition.calcium || 1) : 0,
          remainingPhosphorus > 0 ? (remainingPhosphorus * 1000) / (bestMineral.composition.phosphorus || 1) : 0
        ),
        remainingDM * 0.1, // Máximo 10% para minerales
        2.0 // Máximo 2kg de suplemento mineral
      );

      if (mineralAmount > 0.01) {
        dietComposition.push({
          ingredient: bestMineral,
          amount: parseFloat(mineralAmount.toFixed(2)),
          contribution: calculateNutrientContribution(bestMineral, mineralAmount)
        });

        const contribution = calculateNutrientContribution(bestMineral, mineralAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter;
        categoryUsed[bestMineral.category] = (categoryUsed[bestMineral.category] || 0) + mineralAmount;
      }
    }
  }

  // Paso 7: ÚLTIMO RECURSO - Llenar con el ingrediente más energético disponible
  if (remainingEnergy > totalME * 0.05 && remainingDM > 0.1) { // Si aún falta 5% de energía
    const allEnergyIngredients = ingredients.filter(ing => 
      ing.composition.metabolizableEnergy > 8.0 && // Solo ingredientes con buena energía
      ing.category !== 'minerales' && ing.category !== 'vitaminas' && ing.category !== 'aditivos'
    );
    
    if (allEnergyIngredients.length > 0) {
      // Buscar el ingrediente con más energía por kg
      const ultimateEnergy = allEnergyIngredients.reduce((best, current) => {
        return current.composition.metabolizableEnergy > best.composition.metabolizableEnergy ? current : best;
      });

      const finalAmount = Math.min(
        remainingEnergy / ultimateEnergy.composition.metabolizableEnergy,
        remainingDM * 0.9 // Usar casi todo lo que queda
      );

      if (finalAmount > 0.02) {
        dietComposition.push({
          ingredient: ultimateEnergy,
          amount: parseFloat(finalAmount.toFixed(2)),
          contribution: calculateNutrientContribution(ultimateEnergy, finalAmount)
        });

        const contribution = calculateNutrientContribution(ultimateEnergy, finalAmount);
        remainingEnergy -= contribution.energy;
        remainingProtein -= contribution.protein;
        remainingCalcium -= contribution.calcium;
        remainingPhosphorus -= contribution.phosphorus;
        remainingDM -= contribution.dryMatter; // Usar DM real
        categoryUsed[ultimateEnergy.category] = (categoryUsed[ultimateEnergy.category] || 0) + finalAmount;
      }
    }
  }

  // Calcular totales y análisis
  const totalCost = dietComposition.reduce((sum, item) => 
    sum + (item.amount * item.ingredient.costPerKg), 0
  );

  const totalNutrients = dietComposition.reduce((totals, item) => ({
    energy: totals.energy + item.contribution.energy,
    protein: totals.protein + item.contribution.protein,
    calcium: totals.calcium + item.contribution.calcium * 1000, // convertir a gramos
    phosphorus: totals.phosphorus + item.contribution.phosphorus * 1000, // convertir a gramos
    dryMatter: totals.dryMatter + item.contribution.dryMatter // Usar DM de contribution, no amount
  }), { energy: 0, protein: 0, calcium: 0, phosphorus: 0, dryMatter: 0 });

  return {
    composition: dietComposition,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalNutrients,
    adequacy: {
      energy: parseFloat((totalNutrients.energy / totalME * 100).toFixed(1)),
      protein: parseFloat((totalNutrients.protein / crudeProteinRequired * 100).toFixed(1)),
      calcium: parseFloat((totalNutrients.calcium / calciumRequired * 100).toFixed(1)),
      phosphorus: parseFloat((totalNutrients.phosphorus / phosphorusRequired * 100).toFixed(1)),
      dryMatter: parseFloat((totalNutrients.dryMatter / dryMatterIntake * 100).toFixed(1))
    },
    categoryUsage: categoryUsed
  };
}

/**
 * Calcula la contribución nutricional de un ingrediente
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
 * Valida si una dieta cumple con los requerimientos mínimos
 */
export const validateDiet = (diet, requirements) => {
  const { totalNutrients } = diet;
  const {
    totalME,
    crudeProteinRequired,
    calciumRequired,
    phosphorusRequired
  } = requirements;

  const validation = {
    isValid: true,
    warnings: [],
    errors: []
  };

  // Verificar requerimientos mínimos (85% de adecuación para ser más realista)
  if (totalNutrients.energy < totalME * 0.85) {
    validation.errors.push('Energía insuficiente (< 85% del requerimiento)');
    validation.isValid = false;
  }

  if (totalNutrients.protein < crudeProteinRequired * 0.85) {
    validation.errors.push('Proteína insuficiente (< 85% del requerimiento)');
    validation.isValid = false;
  }

  if (totalNutrients.calcium < calciumRequired * 0.70) {
    validation.errors.push('Calcio insuficiente (< 70% del requerimiento)');
    validation.isValid = false;
  }

  if (totalNutrients.phosphorus < phosphorusRequired * 0.70) {
    validation.errors.push('Fósforo insuficiente (< 70% del requerimiento)');
    validation.isValid = false;
  }

  // Advertencias para niveles bajos pero no críticos
  if (totalNutrients.calcium >= calciumRequired * 0.70 && totalNutrients.calcium < calciumRequired * 0.85) {
    validation.warnings.push('Calcio bajo (70-85% del requerimiento)');
  }

  if (totalNutrients.phosphorus >= phosphorusRequired * 0.70 && totalNutrients.phosphorus < phosphorusRequired * 0.85) {
    validation.warnings.push('Fósforo bajo (70-85% del requerimiento)');
  }

  // Verificar excesos (> 120% puede ser costoso)
  if (totalNutrients.energy > totalME * 1.2) {
    validation.warnings.push('Exceso de energía (> 120% del requerimiento)');
  }

  if (totalNutrients.protein > crudeProteinRequired * 1.3) {
    validation.warnings.push('Exceso de proteína (> 130% del requerimiento)');
  }

  return validation;
};