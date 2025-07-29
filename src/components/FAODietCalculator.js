import React, { useState, useEffect } from 'react';
import { Calculator, Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateCompleteNutrientRequirements } from '../utils/faoCalculations';
import { optimizeDiet, validateDiet } from '../utils/dietOptimization';
import FAOCategorySelector from './FAOCategorySelector';
import FAOAnimalForm from './FAOAnimalForm';
import FAOIngredientSelector from './FAOIngredientSelector';
import FAOResultsDisplay from './FAOResultsDisplay';
import MultiPeriodCalculator from './MultiPeriodCalculator';

const FAODietCalculator = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [optimizedDiet, setOptimizedDiet] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [optimizationMethod, setOptimizationMethod] = useState('linear');

  // Calcular requerimientos cuando cambian los datos del animal
  useEffect(() => {
    if (animalData && selectedCategory) {
      const reqs = calculateCompleteNutrientRequirements({
        ...animalData,
        category: selectedCategory.id
      });
      setRequirements(reqs);
    }
  }, [animalData, selectedCategory]);

  // Optimizar dieta cuando cambian ingredientes o requerimientos
  useEffect(() => {
    if (requirements && selectedIngredients.length >= 2) {
      calculateOptimalDiet();
    }
  }, [requirements, selectedIngredients]);

  const calculateOptimalDiet = async () => {
    if (!requirements || selectedIngredients.length < 2) return;

    setIsCalculating(true);
    
    try {
      // Simular tiempo de cálculo para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dietRequirements = {
        totalME: requirements.energy.totalME,
        crudeProteinRequired: requirements.nutrients.crudeProteinRequired,
        calciumRequired: requirements.nutrients.calciumRequired,
        phosphorusRequired: requirements.nutrients.phosphorusRequired,
        dryMatterIntake: requirements.nutrients.dryMatterIntake
      };

      const diet = optimizeDiet(dietRequirements, selectedIngredients, {}, optimizationMethod);
      const dietValidation = validateDiet(diet, dietRequirements);
      
      setOptimizedDiet(diet);
      setValidation(dietValidation);
      
      // Avanzar al paso de resultados si la dieta es válida
      if (dietValidation.isValid) {
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error calculating diet:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep(2);
    // Reset subsequent steps
    setAnimalData(null);
    setSelectedIngredients([]);
    setRequirements(null);
    setOptimizedDiet(null);
  };

  const handleAnimalDataChange = (data) => {
    setAnimalData(data);
    if (data && Object.keys(data).length > 0) {
      setCurrentStep(3);
    }
  };

  const handleIngredientsChange = (ingredients) => {
    setSelectedIngredients(ingredients);
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setAnimalData(null);
    setSelectedIngredients([]);
    setRequirements(null);
    setOptimizedDiet(null);
    setValidation(null);
  };

  const canProceedToResults = requirements && selectedIngredients.length >= 2 && optimizedDiet;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐂</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Calculadora FAO de Dietas para Ganado Vacuno
                </h1>
                <p className="text-sm text-gray-600">
                  Formulación científica basada en estándares FAO y NASEM
                </p>
              </div>
            </div>
            <button
              onClick={resetCalculator}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, label: 'Categoría', icon: '🐂' },
              { step: 2, label: 'Animal', icon: '📊' },
              { step: 3, label: 'Ingredientes', icon: '🌾' },
              { step: 4, label: 'Resultados', icon: '📋' },
              { step: 5, label: 'Multi-Período', icon: '📅' }
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium
                  ${currentStep >= item.step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  <span>{item.icon}</span>
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </div>
                </div>
                {index < 4 && (
                  <div className={`w-8 h-0.5 ${
                    currentStep > item.step ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Category Selection */}
          {currentStep >= 1 && (
            <FAOCategorySelector
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {/* Step 2: Animal Data */}
          {currentStep >= 2 && (
            <FAOAnimalForm
              selectedCategory={selectedCategory}
              onAnimalDataChange={handleAnimalDataChange}
            />
          )}

          {/* Step 3: Ingredient Selection */}
          {currentStep >= 3 && (
            <FAOIngredientSelector
              selectedIngredients={selectedIngredients}
              onIngredientsChange={handleIngredientsChange}
              animalData={animalData}
            />
          )}

          {/* Calculation Status */}
          {currentStep >= 3 && requirements && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Método de Optimización</h3>
                    <p className="text-sm text-gray-600">
                      Selecciona el método de formulación de la dieta
                    </p>
                  </div>
                </div>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setOptimizationMethod('linear')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      optimizationMethod === 'linear' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    📊 Programación Lineal
                  </button>
                  <button
                    onClick={() => setOptimizationMethod('pearson')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      optimizationMethod === 'pearson' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    ⚖️ Cuadrado de Pearson
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    optimizationMethod === 'linear' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {optimizationMethod === 'linear' ? 'Programación Lineal Heurística' : 'Cuadrado de Pearson Clásico'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isCalculating 
                        ? 'Optimizando dieta...'
                        : selectedIngredients.length < 2
                        ? 'Selecciona al menos 2 ingredientes'
                        : optimizedDiet
                        ? `Dieta calculada con ${optimizedDiet.method || optimizationMethod}`
                        : optimizationMethod === 'linear' 
                        ? 'Optimiza múltiples ingredientes por categorías'
                        : 'Balancea 2 ingredientes principales por nutriente objetivo'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {isCalculating && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  )}
                  
                  {validation && (
                    <div className="flex items-center space-x-2">
                      {validation.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        validation.isValid ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {validation.isValid ? 'Dieta válida' : 'Revisar dieta'}
                      </span>
                    </div>
                  )}
                  
                  {canProceedToResults && (
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Ver Resultados
                    </button>
                  )}
                </div>
              </div>

              {/* Method Description */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  {optimizationMethod === 'linear' ? (
                    <div>
                      <strong>📊 Programación Lineal:</strong> Optimiza múltiples ingredientes simultáneamente, 
                      considerando restricciones por categorías y minimizando costos. Ideal para dietas complejas 
                      con muchos ingredientes.
                    </div>
                  ) : (
                    <div>
                      <strong>⚖️ Cuadrado de Pearson:</strong> Método clásico que balancea principalmente 2 ingredientes 
                      (forraje + concentrado) según un nutriente objetivo (proteína). Simple, preciso y tradicional 
                      en nutrición animal.
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements Summary */}
              {requirements && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Energía Total</div>
                    <div className="text-blue-600">{requirements.energy.totalME} MJ ME/día</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Proteína</div>
                    <div className="text-green-600">{requirements.nutrients.crudeProteinRequired} kg/día</div>
                    <div className="text-xs text-green-500">
                      {((requirements.nutrients.crudeProteinRequired / requirements.nutrients.dryMatterIntake) * 100).toFixed(1)}% MS
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="font-medium text-yellow-800">Calcio</div>
                    <div className="text-yellow-600">{requirements.nutrients.calciumRequired} g/día</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-medium text-purple-800">Materia Seca</div>
                    <div className="text-purple-600">{requirements.nutrients.dryMatterIntake} kg/día</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep >= 4 && optimizedDiet && requirements && (
            <FAOResultsDisplay
              animalData={animalData}
              selectedCategory={selectedCategory}
              requirements={requirements}
              optimizedDiet={optimizedDiet}
              validation={validation}
            />
          )}

          {/* Step 5: Multi-Period Calculator */}
          {currentStep >= 4 && optimizedDiet && requirements && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  📅 Análisis Multi-Período
                </h3>
                <button
                  onClick={() => setCurrentStep(5)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentStep >= 5 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currentStep >= 5 ? 'Ocultar Análisis' : 'Ver Análisis Completo'}
                </button>
              </div>
              
              {currentStep >= 5 && (
                <MultiPeriodCalculator
                  animalData={animalData}
                  selectedCategory={selectedCategory}
                  selectedIngredients={selectedIngredients}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAODietCalculator;