import React, { useState } from 'react';
import { Check, Plus, Minus, Info, Microscope, Filter, Globe, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { faoIngredientCategories, getAllIngredients, getIngredientsByCategory, getDetailedNutritionData } from '../data/faoIngredients';
import { evaluateFormulationComplexity } from '../utils/ingredientComplexityManager';
import DetailedNutritionView from './DetailedNutritionView';
import FeedipediaIngredientCard from './FeedipediaIngredientCard';

const FAOIngredientSelector = ({ selectedIngredients, onIngredientsChange, animalData }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('forrajes_secos');
  const [showDetails, setShowDetails] = useState({});
  const [selectedForDetailView, setSelectedForDetailView] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'fao', 'feedipedia'
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  const toggleIngredient = (ingredient) => {
    const isSelected = selectedIngredients.some(ing => ing.id === ingredient.id);
    
    if (isSelected) {
      onIngredientsChange(selectedIngredients.filter(ing => ing.id !== ingredient.id));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const toggleDetails = (ingredientId) => {
    setShowDetails(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  const allCategoryIngredients = getIngredientsByCategory(activeCategory);
  
  // Filter basierend auf View-Modus
  const categoryIngredients = allCategoryIngredients.filter(ingredient => {
    if (viewMode === 'fao') return !ingredient.scientificName; // Ursprüngliche FAO-Ingredienzien
    if (viewMode === 'feedipedia') return ingredient.scientificName; // Feedipedia-Ingredienzien
    return true; // Alle anzeigen
  });

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
      'forrajes_secos': dryMatterIntake * 0.70,
      'pastos_verdes': dryMatterIntake * 0.05, // Solo fibra mínima - sistema intensivo
      'ensilados': dryMatterIntake * 0.60,
      'alimentos_energeticos': dryMatterIntake * 0.60,
      'suplementos_proteicos': dryMatterIntake * 0.25,
      'minerales': dryMatterIntake * 0.05,
      'vitaminas': dryMatterIntake * 0.02,
      'aditivos': dryMatterIntake * 0.03
    };

    // Calcular cuánto ya se ha usado de esta categoría
    const categoryUsed = selectedIngredients
      .filter(ing => ing.category === ingredient.category)
      .reduce((sum, ing) => sum + (ing.amount || 0), 0);

    // Verificar si agregar este ingrediente excedería el límite de categoría
    const categoryLimit = categoryLimits[ingredient.category] || dryMatterIntake * 0.3;
    const minAmount = 0.1; // Cantidad mínima para agregar
    
    if (categoryUsed + minAmount > categoryLimit) {
      return false;
    }

    // Verificar límites específicos para ciertos ingredientes
    if (ingredient.maxUsage) {
      const maxAllowed = dryMatterIntake * (ingredient.maxUsage / 100);
      if (minAmount > maxAllowed) {
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
      'forrajes_secos': dryMatterIntake * 0.70,
      'pastos_verdes': dryMatterIntake * 0.05, // Solo fibra mínima - sistema intensivo
      'ensilados': dryMatterIntake * 0.60,
      'alimentos_energeticos': dryMatterIntake * 0.60,
      'suplementos_proteicos': dryMatterIntake * 0.25,
      'minerales': dryMatterIntake * 0.05,
      'vitaminas': dryMatterIntake * 0.02,
      'aditivos': dryMatterIntake * 0.03
    };

    const categoryUsed = selectedIngredients
      .filter(ing => ing.category === ingredient.category)
      .reduce((sum, ing) => sum + (ing.amount || 0), 0);

    const categoryLimit = categoryLimits[ingredient.category] || dryMatterIntake * 0.3;
    
    if (categoryUsed + 0.1 > categoryLimit) {
      return `Límite de categoría excedido (${categoryUsed.toFixed(1)}/${categoryLimit.toFixed(1)} kg)`;
    }

    if (ingredient.maxUsage) {
      const maxAllowed = dryMatterIntake * (ingredient.maxUsage / 100);
      if (0.1 > maxAllowed) {
        return `Uso máximo: ${ingredient.maxUsage}% de la dieta`;
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
            Selección de Ingredientes FAO
          </h3>
          <p className="text-gray-600 text-sm">
            Selecciona los ingredientes disponibles para formular la dieta
          </p>
        </div>
      </div>

      {/* View Mode Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Datenquelle:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Alle ({allCategoryIngredients.length})
            </button>
            <button
              onClick={() => setViewMode('fao')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'fao' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              FAO Standard
            </button>
            <button
              onClick={() => setViewMode('feedipedia')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'feedipedia' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Globe className="w-3 h-3 inline mr-1" />
              Feedipedia
            </button>
          </div>
        </div>
        
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


      {/* Categorías de Ingredientes */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(faoIngredientCategories).map(([categoryId, category]) => (
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
          
          // Usar Feedipedia-Karte für wissenschaftliche Ingredienzien
          if (ingredient.scientificName) {
            return (
              <FeedipediaIngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                isSelected={isSelected}
                onToggle={() => toggleIngredient(ingredient)}
                showDetails={showAdvancedDetails}
                canSelect={canSelect}
                disabledReason={disabledReason}
              />
            );
          }
          
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
                        <span>€{ingredient.costPerKg}/kg</span>
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
                      onClick={() => toggleDetails(ingredient.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Grundinformationen"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {getDetailedNutritionData(ingredient.id) && (
                      <button
                        onClick={() => setSelectedForDetailView(ingredient)}
                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Detaillierte Nährstoffanalyse"
                      >
                        <Microscope className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

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
          <p className="text-blue-700 text-sm mt-2">
            Costo promedio: €{(selectedIngredients.reduce((sum, ing) => sum + ing.costPerKg, 0) / selectedIngredients.length).toFixed(2)}/kg
          </p>
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