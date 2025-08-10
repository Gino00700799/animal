import React, { useState } from 'react';
import { Check, Plus, Minus, Info, Microscope, AlertTriangle, Edit3, DollarSign, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { faoIngredientCategories as staticFaoIngredientCategories, getIngredientsByCategory as staticGetIngredientsByCategory, getDetailedNutritionData } from '../data/faoIngredients';
import { useData } from '../contexts/DataContext';
import { evaluateFormulationComplexity } from '../utils/ingredientComplexityManager';
import DetailedNutritionView from './DetailedNutritionView';

const FAOIngredientSelector = ({ selectedIngredients, onIngredientsChange, animalData }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('forrajes_secos');
  const { ingredientCategories, ingredients, loading, error } = useData();
  const [showDetails, setShowDetails] = useState({});
  const [selectedForDetailView, setSelectedForDetailView] = useState(null);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [customPrices, setCustomPrices] = useState({}); // Precios personalizados
  const [showPriceEditor, setShowPriceEditor] = useState(false);

  const toggleIngredient = (ingredient) => {
    const isSelected = selectedIngredients.some(ing => ing.id === ingredient.id);
    
    // Aplicar precio personalizado si existe
    const ingredientWithCustomPrice = {
      ...ingredient,
      costPerKg: customPrices[ingredient.id] || ingredient.costPerKg,
      originalCost: ingredient.costPerKg
    };
    
    if (isSelected) {
      onIngredientsChange(selectedIngredients.filter(ing => ing.id !== ingredient.id));
    } else {
      onIngredientsChange([...selectedIngredients, ingredientWithCustomPrice]);
    }
  };

  const updateCustomPrice = (ingredientId, newPrice) => {
    setCustomPrices(prev => ({
      ...prev,
      [ingredientId]: parseFloat(newPrice) || 0
    }));
    
    // Actualizar ingredientes ya seleccionados
    const updatedIngredients = selectedIngredients.map(ing => {
      if (ing.id === ingredientId) {
        return {
          ...ing,
          costPerKg: parseFloat(newPrice) || ing.originalCost || ing.costPerKg
        };
      }
      return ing;
    });
    onIngredientsChange(updatedIngredients);
  };

  const resetPrice = (ingredientId) => {
    setCustomPrices(prev => {
      const newPrices = { ...prev };
      delete newPrices[ingredientId];
      return newPrices;
    });
    
    // Restaurar precio original en ingredientes seleccionados
    const updatedIngredients = selectedIngredients.map(ing => {
      if (ing.id === ingredientId) {
        return {
          ...ing,
          costPerKg: ing.originalCost || ing.costPerKg
        };
      }
      return ing;
    });
    onIngredientsChange(updatedIngredients);
  };

  const toggleDetails = (ingredientId) => {
    setShowDetails(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  // Ingredientes por categoría (nur CSV, keine statischen Fallbacks)
  const categoryIngredients = (ingredients || []).filter(i => i.category === activeCategory);

  // Wenn Kategorien verfügbar sind, initiale Kategorie setzen
  React.useEffect(() => {
    const ids = ingredientCategories ? Object.keys(ingredientCategories) : [];
    if (ids.length > 0 && !ids.includes(activeCategory)) {
      setActiveCategory(ids[0]);
    }
  }, [ingredientCategories]);

  // Función para calcular el estado nutricional actual
  const calculateCurrentNutrition = () => {
    if (!selectedIngredients.length || !animalData) return null;

    let totalEnergy = 0;
    let totalProtein = 0;
    let totalCalcium = 0;
    let totalPhosphorus = 0;
    let totalDM = 0;

    selectedIngredients.forEach(ing => {
      const amount = ing.amount || 0;
      const dmAmount = amount * (ing.composition.dryMatter / 100);
      
      totalEnergy += dmAmount * ing.composition.metabolizableEnergy;
      totalProtein += dmAmount * ing.composition.crudeProtein / 100;
      totalCalcium += dmAmount * ing.composition.calcium / 100 * 1000; // gramos
      totalPhosphorus += dmAmount * ing.composition.phosphorus / 100 * 1000; // gramos
      totalDM += dmAmount;
    });

    return {
      energy: totalEnergy,
      protein: totalProtein,
      calcium: totalCalcium,
      phosphorus: totalPhosphorus,
      dryMatter: totalDM
    };
  };

  // Función para verificar si los requerimientos están completos
  const checkRequirementsStatus = () => {
    const currentNutrition = calculateCurrentNutrition();
    if (!currentNutrition || !animalData) return { complete: false, adequacy: {} };

    // Calcular requerimientos objetivo
    const targetEnergy = animalData.weight * 0.293 * Math.pow(animalData.weight, -0.25) * 15; // Estimación simplificada
    const targetProtein = animalData.weight * 0.025 * 0.14; // 14% de proteína estimada
    const targetCalcium = animalData.weight * 0.025 * 0.6; // 0.6% de calcio estimada
    const targetPhosphorus = animalData.weight * 0.025 * 0.35; // 0.35% de fósforo estimada
    const targetDM = animalData.weight * 0.025; // 2.5% del peso corporal

    const adequacy = {
      energy: (currentNutrition.energy / targetEnergy) * 100,
      protein: (currentNutrition.protein / targetProtein) * 100,
      calcium: (currentNutrition.calcium / targetCalcium) * 100,
      phosphorus: (currentNutrition.phosphorus / targetPhosphorus) * 100,
      dryMatter: (currentNutrition.dryMatter / targetDM) * 100
    };

    // Considerar completo si todos los nutrientes están >= 95%
    const complete = adequacy.energy >= 95 && adequacy.protein >= 95 && 
                    adequacy.calcium >= 95 && adequacy.phosphorus >= 95;

    return { complete, adequacy, targets: { targetEnergy, targetProtein, targetCalcium, targetPhosphorus, targetDM } };
  };

  // Función para verificar si un ingrediente puede ser seleccionado
  const canSelectIngredient = (ingredient) => {
    if (!animalData || !animalData.weight) return true; // Si no hay datos del animal, permitir todo
    
    // Verificar si los requerimientos ya están completos
    const requirementsStatus = checkRequirementsStatus();
    if (requirementsStatus.complete) {
      // Si ya está seleccionado, permitir modificaciones
      const isAlreadySelected = selectedIngredients.some(ing => ing.id === ingredient.id);
      if (!isAlreadySelected) {
        return false; // No permitir nuevos ingredientes si los requerimientos están completos
      }
    }
    
    // Calcular límites de categoría basados en consumo de materia seca
    const dryMatterIntake = animalData.dryMatterIntake || (animalData.weight * 0.025); // 2.5% del peso corporal
    
    const categoryLimits = {
      'forrajes_secos': dryMatterIntake * 0.80, // Aumentado
      'pastos_verdes': dryMatterIntake * 0.10, // Aumentado para flexibilidad
      'ensilados': dryMatterIntake * 0.70, // Aumentado
      'alimentos_energeticos': dryMatterIntake * 0.85, // Aumentado para sistema intensivo
      'suplementos_proteicos': dryMatterIntake * 0.35, // Aumentado
      'minerales': dryMatterIntake * 0.15, // Aumentado significativamente
      'vitaminas': dryMatterIntake * 0.08, // Aumentado
      'aditivos': dryMatterIntake * 0.10 // Aumentado
    };

    // Calcular cuánto ya se ha usado de esta categoría
    const categoryUsed = selectedIngredients
      .filter(ing => ing.category === ingredient.category)
      .reduce((sum, ing) => sum + (ing.amount || 0), 0);

    // Verificar si agregar este ingrediente excedería el límite de categoría
    const categoryLimit = categoryLimits[ingredient.category] || dryMatterIntake * 0.5; // Aumentado límite por defecto
    const minAmount = ingredient.category === 'minerales' || ingredient.category === 'vitaminas' || ingredient.category === 'aditivos' 
                      ? 0.01 : 0.1; // Cantidad mínima más pequeña para suplementos
    
    if (categoryUsed + minAmount > categoryLimit) {
      return false;
    }

    // Verificar límites específicos para ciertos ingredientes (más flexibles)
    if (ingredient.maxUsage) {
      const maxAllowed = dryMatterIntake * (ingredient.maxUsage / 100);
      // Para minerales, vitaminas y aditivos, usar cantidad mínima muy pequeña
      const checkAmount = ingredient.category === 'minerales' || ingredient.category === 'vitaminas' || ingredient.category === 'aditivos' 
                         ? 0.0001 : minAmount; // Reducido para mayor flexibilidad
      if (checkAmount > maxAllowed) {
        return false;
      }
    }

    // Verificar si ya hay demasiados ingredientes seleccionados (máximo 15 para evitar complejidad excesiva)
    if (selectedIngredients.length >= 15 && !selectedIngredients.find(ing => ing.id === ingredient.id)) {
      return false;
    }

    return true;
  };

  // Función para obtener el motivo por el cual un ingrediente no puede ser seleccionado
  const getDisabledReason = (ingredient) => {
    if (!animalData || !animalData.weight) return '';
    
    // Verificar si los requerimientos están completos
    const requirementsStatus = checkRequirementsStatus();
    if (requirementsStatus.complete) {
      const isAlreadySelected = selectedIngredients.some(ing => ing.id === ingredient.id);
      if (!isAlreadySelected) {
        return 'Requerimientos nutricionales ya completos (≥95%)';
      }
    }
    
    const dryMatterIntake = animalData.dryMatterIntake || (animalData.weight * 0.025);
    const categoryLimits = {
      'forrajes_secos': dryMatterIntake * 0.80, // Aumentado
      'pastos_verdes': dryMatterIntake * 0.10, // Aumentado para flexibilidad
      'ensilados': dryMatterIntake * 0.70, // Aumentado
      'alimentos_energeticos': dryMatterIntake * 0.85, // Aumentado para sistema intensivo
      'suplementos_proteicos': dryMatterIntake * 0.35, // Aumentado
      'minerales': dryMatterIntake * 0.15, // Aumentado significativamente
      'vitaminas': dryMatterIntake * 0.08, // Aumentado
      'aditivos': dryMatterIntake * 0.10 // Aumentado
    };

    const categoryUsed = selectedIngredients
      .filter(ing => ing.category === ingredient.category)
      .reduce((sum, ing) => sum + (ing.amount || 0), 0);

    const categoryLimit = categoryLimits[ingredient.category] || dryMatterIntake * 0.5; // Aumentado límite por defecto
    const minAmount = ingredient.category === 'minerales' || ingredient.category === 'vitaminas' || ingredient.category === 'aditivos' 
                      ? 0.01 : 0.1; // Cantidad mínima más pequeña para suplementos
    
    if (categoryUsed + minAmount > categoryLimit) {
      return `Límite de categoría excedido (${categoryUsed.toFixed(1)}/${categoryLimit.toFixed(1)} kg)`;
    }

    if (ingredient.maxUsage) {
      const maxAllowed = dryMatterIntake * (ingredient.maxUsage / 100);
      // Para minerales, vitaminas y aditivos, usar cantidad mínima muy pequeña
      const checkAmount = ingredient.category === 'minerales' || ingredient.category === 'vitaminas' || ingredient.category === 'aditivos' 
                         ? 0.0001 : 0.1; // Reducido para mayor flexibilidad
      if (checkAmount > maxAllowed) {
        return `Uso máximo: ${ingredient.maxUsage}% de la dieta (${maxAllowed.toFixed(3)} kg máximo)`;
      }
    }

    if (selectedIngredients.length >= 15 && !selectedIngredients.find(ing => ing.id === ingredient.id)) {
      return 'Máximo 15 ingredientes permitidos para mantener simplicidad';
    }

    return '';
  };


  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🌾</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'FAO Ingredient Selection' : 
             language === 'de' ? 'FAO Futtermittel-Auswahl' : 
             'Selección de Ingredientes FAO'}
          </h3>
          <p className="text-gray-600 text-sm">
            {language === 'en' ? 'Select available ingredients to formulate the diet' :
             language === 'de' ? 'Verfügbare Futtermittel für die Rationsformulierung auswählen' :
             'Selecciona los ingredientes disponibles para formular la dieta'}
          </p>
        </div>
      </div>

      {/* Información de ingredientes FAO */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-700">
            📊 Ingredientes: {categoryIngredients.length} disponibles en {(ingredientCategories[activeCategory]?.name?.[language] || ingredientCategories[activeCategory]?.name?.es || 'Categoría')}
          </div>
          {Object.keys(customPrices).length > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {Object.keys(customPrices).length} precios modificados
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {Object.keys(customPrices).length > 0 && (
            <button
              onClick={() => {
                setCustomPrices({});
                // Restaurar precios originales en ingredientes seleccionados
                const updatedIngredients = selectedIngredients.map(ing => ({
                  ...ing,
                  costPerKg: ing.originalCost || ing.costPerKg
                }));
                onIngredientsChange(updatedIngredients);
              }}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Todos</span>
            </button>
          )}
          <button
            onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors ${
              showAdvancedDetails ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Details</span>
          </button>
        </div>
      </div>


      {/* Categorías de Ingredientes */}
      {loading && (
        <div className="text-sm text-gray-500 mb-2">Daten werden geladen...</div>
      )}
      {error && (
        <div className="text-sm text-red-600 mb-2">Fehler beim Laden der CSV-Daten</div>
      )}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(ingredientCategories || {}).map(([categoryId, category]) => (
          <button
            key={categoryId}
            onClick={() => setActiveCategory(categoryId)}
            className={`
              flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeCategory === categoryId
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.name[language] || category.name.es}
          </button>
        ))}
      </div>

      {/* Indicador de Complejidad de Formulación */}
      {selectedIngredients.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🧩</span>
                <span className="font-medium text-gray-800">
                  Complejidad: {selectedIngredients.length} ingredientes
                </span>
              </div>
              
              {(() => {
                const complexity = evaluateFormulationComplexity(selectedIngredients);
                const getComplexityColor = (level) => {
                  switch(level) {
                    case 'simple': return 'text-green-600 bg-green-100';
                    case 'moderada': return 'text-blue-600 bg-blue-100';
                    case 'compleja': return 'text-yellow-600 bg-yellow-100';
                    case 'muy_compleja': return 'text-red-600 bg-red-100';
                    default: return 'text-gray-600 bg-gray-100';
                  }
                };
                
                const getComplexityText = (level) => {
                  switch(level) {
                    case 'simple': return 'Simple';
                    case 'moderada': return 'Moderada';
                    case 'compleja': return 'Compleja';
                    case 'muy_compleja': return 'Muy Compleja';
                    default: return 'Desconocida';
                  }
                };

                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(complexity.complexityLevel)}`}>
                    {getComplexityText(complexity.complexityLevel)}
                  </span>
                );
              })()}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Practicidad:</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    evaluateFormulationComplexity(selectedIngredients).practicalityScore >= 80 ? 'bg-green-500' :
                    evaluateFormulationComplexity(selectedIngredients).practicalityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${evaluateFormulationComplexity(selectedIngredients).practicalityScore}%` }}
                ></div>
              </div>
              <span className="font-medium">
                {evaluateFormulationComplexity(selectedIngredients).practicalityScore}%
              </span>
            </div>
          </div>
          
          {(() => {
            const complexity = evaluateFormulationComplexity(selectedIngredients);
            
            if (complexity.warnings.length > 0) {
              return (
                <div className="mt-2 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <strong>Advertencias:</strong> {complexity.warnings.join(', ')}
                  </div>
                </div>
              );
            }
            
            if (complexity.recommendations.length > 0 && selectedIngredients.length > 8) {
              return (
                <div className="mt-2 text-sm text-blue-700">
                  💡 <strong>Sugerencia:</strong> {complexity.recommendations[0]}
                </div>
              );
            }
            
            return null;
          })()}
        </div>
      )}

      {/* Estado de Requerimientos Nutricionales */}
      {animalData && selectedIngredients.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            📊 Estado de Requerimientos Nutricionales
            {checkRequirementsStatus().complete && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                ✅ COMPLETO
              </span>
            )}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(checkRequirementsStatus().adequacy || {}).map(([nutrient, percentage]) => {
              const isComplete = percentage >= 95;
              const isLow = percentage < 80;
              
              return (
                <div key={nutrient} className="text-center">
                  <div className={`font-bold text-lg ${
                    isComplete ? 'text-green-600' : isLow ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {percentage.toFixed(0)}%
                  </div>
                  <div className="text-gray-600 capitalize">
                    {nutrient === 'energy' ? 'Energía' :
                     nutrient === 'protein' ? 'Proteína' :
                     nutrient === 'calcium' ? 'Calcio' :
                     nutrient === 'phosphorus' ? 'Fósforo' :
                     nutrient === 'dryMatter' ? 'Materia Seca' : nutrient}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-green-500' : isLow ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {checkRequirementsStatus().complete && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                🎉 ¡Requerimientos nutricionales completos! Los ingredientes adicionales aparecerán deshabilitados 
                para evitar sobreformulación. Puedes ajustar las cantidades de los ingredientes ya seleccionados.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lista de Ingredientes */}
      <div className="space-y-3">
        {categoryIngredients.map((ingredient) => {
          const isSelected = selectedIngredients.some(ing => ing.id === ingredient.id);
          const canSelect = canSelectIngredient(ingredient);
          const disabledReason = getDisabledReason(ingredient);
          
          // Solo ingredientes FAO estándar (sin Feedipedia)
          
          // Ursprüngliche FAO-Karte für Standard-Ingredienzien
          const showDetail = showDetails[ingredient.id];
          
          return (
            <div
              key={ingredient.id}
              className={`
                border-2 rounded-lg transition-all duration-200
                ${!canSelect 
                  ? 'border-gray-100 bg-gray-50 opacity-60' 
                  : isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => canSelect && toggleIngredient(ingredient)}
                      disabled={!canSelect}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-200
                        ${!canSelect
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {!canSelect && !isSelected && <span className="text-xs">🚫</span>}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-semibold ${canSelect ? 'text-gray-800' : 'text-gray-400'}`}>
                        {ingredient.name[language] || ingredient.name.es}
                        {!canSelect && <span className="ml-2 text-red-500 text-sm">🚫</span>}
                      </h4>
                      <div className={`flex items-center space-x-4 text-sm mt-1 ${canSelect ? 'text-gray-600' : 'text-gray-400'}`}>
                        <span>ME: {ingredient.composition.metabolizableEnergy} MJ/kg</span>
                        <span>PC: {ingredient.composition.crudeProtein}%</span>
                        <div className="flex items-center space-x-2">
                          <span className={customPrices[ingredient.id] ? 'line-through text-gray-400' : ''}>
                            €{ingredient.costPerKg}/kg
                          </span>
                          {customPrices[ingredient.id] && (
                            <span className="text-green-600 font-semibold">
                              €{customPrices[ingredient.id]}/kg
                            </span>
                          )}
                        </div>
                      </div>
                      {!canSelect && disabledReason && (
                        <div className="text-xs text-red-500 mt-1 font-medium">
                          ⚠️ {disabledReason}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setShowPriceEditor(showPriceEditor === ingredient.id ? null : ingredient.id)}
                      className="p-2 text-green-400 hover:text-green-600 transition-colors"
                      title="Editar precio"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleDetails(ingredient.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Información básica"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {getDetailedNutritionData(ingredient.id) && (
                      <button
                        onClick={() => setSelectedForDetailView(ingredient)}
                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Análisis nutricional detallado"
                      >
                        <Microscope className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor de Precio */}
                {showPriceEditor === ingredient.id && (
                  <div className="mt-4 pt-4 border-t border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-green-800 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Editar Precio - {ingredient.name[language] || ingredient.name.es}
                      </h5>
                      {customPrices[ingredient.id] && (
                        <button
                          onClick={() => resetPrice(ingredient.id)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          title="Restaurar precio original"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restaurar</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Original
                        </label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                          €{ingredient.costPerKg}/kg
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nuevo Precio
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                            €
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customPrices[ingredient.id] || ''}
                            onChange={(e) => updateCustomPrice(ingredient.id, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder={ingredient.costPerKg.toString()}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eficiencia Energética
                        </label>
                        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
                          {((ingredient.composition.metabolizableEnergy) / (customPrices[ingredient.id] || ingredient.costPerKg)).toFixed(1)} MJ/€
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-600">
                      💡 <strong>Tip:</strong> Los precios se actualizan automáticamente en la optimización de costos
                    </div>
                  </div>
                )}

                {/* Detalles del Ingrediente */}
                {showDetail && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Materia Seca:</span>
                        <div className="text-gray-600">{ingredient.composition.dryMatter}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Energía ME:</span>
                        <div className="text-gray-600">{ingredient.composition.metabolizableEnergy} MJ/kg</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Proteína Cruda:</span>
                        <div className="text-gray-600">{ingredient.composition.crudeProtein}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fibra:</span>
                        <div className="text-gray-600">{ingredient.composition.fiber}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Calcio:</span>
                        <div className="text-gray-600">{ingredient.composition.calcium}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fósforo:</span>
                        <div className="text-gray-600">{ingredient.composition.phosphorus}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Costo:</span>
                        <div className="text-gray-600">€{ingredient.costPerKg}/kg</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Disponibilidad:</span>
                        <div className="text-gray-600">
                          {ingredient.availability === 'year_round' ? 'Todo el año' : 'Estacional'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de Selección */}
      {selectedIngredients.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">
            Ingredientes Seleccionados ({selectedIngredients.length})
          </h5>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient.id}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {ingredient.name[language] || ingredient.name.es}
                <button
                  onClick={() => toggleIngredient(ingredient)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">
                Costo promedio: €{(selectedIngredients.reduce((sum, ing) => sum + ing.costPerKg, 0) / selectedIngredients.length).toFixed(2)}/kg
              </span>
              {Object.keys(customPrices).length > 0 && (
                <span className="text-green-600 font-medium">
                  💰 Precios personalizados activos
                </span>
              )}
            </div>
            {Object.keys(customPrices).length > 0 && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <strong>Cambios de precios:</strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
                  {Object.entries(customPrices).map(([ingredientId, price]) => {
                    const ingredient = categoryIngredients.find(ing => ing.id === ingredientId) || 
                                     selectedIngredients.find(ing => ing.id === ingredientId);
                    if (!ingredient) return null;
                    const originalPrice = ingredient.originalCost || ingredient.costPerKg;
                    const change = ((price - originalPrice) / originalPrice * 100);
                    return (
                      <div key={ingredientId} className="flex justify-between">
                        <span>{ingredient.name.es}:</span>
                        <span className={change >= 0 ? 'text-red-600' : 'text-green-600'}>
                          €{originalPrice} → €{price} ({change >= 0 ? '+' : ''}{change.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensaje si no hay ingredientes seleccionados */}
      {selectedIngredients.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="text-yellow-600">
            <Plus className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">No hay ingredientes seleccionados</p>
            <p className="text-sm">Selecciona al menos 3-4 ingredientes para formular una dieta balanceada</p>
          </div>
        </div>
      )}

      {/* Modal para vista detallada de nutrientes */}
      {selectedForDetailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedForDetailView.name[language] || selectedForDetailView.name.es} - Análisis Detallado
              </h3>
              <button
                onClick={() => setSelectedForDetailView(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <DetailedNutritionView ingredient={selectedForDetailView} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAOIngredientSelector;