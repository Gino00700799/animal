// Calculation utilities for animal calorie and nutrition needs

export const calculateCalories = (animal, weight) => {
  if (!animal || !weight || weight <= 0) return 0;
  
  // Base calculation: weight × multiplier
  const baseCalories = weight * animal.calorieMultiplier;
  
  // Add some variation based on animal type
  let adjustedCalories = baseCalories;
  
  // Larger animals are more efficient (lower calories per kg)
  if (weight > 1000) {
    adjustedCalories *= 0.9;
  } else if (weight < 50) {
    adjustedCalories *= 1.2; // Smaller animals need more calories per kg
  }
  
  return Math.round(adjustedCalories);
};

export const calculateMeatNeeds = (animal, weight, totalCalories) => {
  if (!animal || !weight || !totalCalories) {
    return 0;
  }
  
  // Only carnivores and omnivores need meat
  if (animal.diet === 'herbivore') {
    return 0;
  }
  
  // Meat provides approximately 2000-2500 calories per kg
  const caloriesPerKgMeat = 2200;
  
  // Calculate meat percentage of diet
  let meatPercentage = animal.meatPercentage || 85;
  
  // For omnivores, use lower meat percentage if not specified
  if (animal.diet === 'omnivore' && !animal.meatPercentage) {
    meatPercentage = 40; // Default for omnivores
  }
  
  const meatCalories = (totalCalories * meatPercentage) / 100;
  
  // Convert to grams
  const meatKg = meatCalories / caloriesPerKgMeat;
  const meatGrams = meatKg * 1000;
  
  return Math.round(meatGrams);
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) return 0;
  
  // BMI = weight (kg) / height (m)²
  const bmi = weight / (height * height);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi, animal) => {
  if (!bmi || !animal) return { category: 'Unknown', color: 'text-gray-500' };
  
  // These are very rough estimates for animals - in reality, each species has different healthy ranges
  const avgWeight = (animal.averageWeight.min + animal.averageWeight.max) / 2;
  const avgHeight = (animal.averageHeight.min + animal.averageHeight.max) / 2;
  const normalBMI = avgWeight / (avgHeight * avgHeight);
  
  const ratio = bmi / normalBMI;
  
  if (ratio < 0.8) {
    return { category: 'Underweight', color: 'text-blue-600' };
  } else if (ratio < 1.2) {
    return { category: 'Normal', color: 'text-green-600' };
  } else if (ratio < 1.4) {
    return { category: 'Overweight', color: 'text-yellow-600' };
  } else {
    return { category: 'Obese', color: 'text-red-600' };
  }
};

export const calculateWaterNeeds = (weight, calories) => {
  // Rough estimate: animals need about 2-4 ml of water per calorie
  // Plus base water needs
  const waterPerCalorie = 3; // ml per calorie
  const baseWater = weight * 30; // 30ml per kg base
  
  const totalWater = (calories * waterPerCalorie) + baseWater;
  return Math.round(totalWater / 1000 * 10) / 10; // Convert to liters, round to 1 decimal
};

export const getFeedingRecommendations = (animal, weight, calories) => {
  const recommendations = [];
  
  if (animal.diet === 'herbivore') {
    const vegetationKg = Math.round(calories / 3000); // Rough estimate: 3000 cal/kg vegetation
    recommendations.push(`${vegetationKg}kg of mixed vegetation daily`);
    recommendations.push('Provide hay, grass, leaves, and fruits');
    recommendations.push('Feed in multiple small portions throughout the day');
  } else if (animal.diet === 'carnivore') {
    const meatGrams = calculateMeatNeeds(animal, weight, calories);
    recommendations.push(`${meatGrams}g of fresh meat daily`);
    recommendations.push('Vary between different meat types');
    recommendations.push('Include bones for dental health');
    recommendations.push('Feed once or twice daily');
  } else if (animal.diet === 'omnivore') {
    const meatGrams = calculateMeatNeeds(animal, weight, calories);
    const vegetationKg = Math.round((calories * 0.6) / 3000); // 60% vegetation calories
    recommendations.push(`${meatGrams}g of meat + ${vegetationKg}kg vegetation daily`);
    recommendations.push('Balance between animal protein and plant matter');
    recommendations.push('Include fruits, vegetables, and occasional meat');
    recommendations.push('Feed 2-3 times daily with varied diet');
  }
  
  const waterLiters = calculateWaterNeeds(weight, calories);
  recommendations.push(`Provide ${waterLiters}L of fresh water daily`);
  
  return recommendations;
};