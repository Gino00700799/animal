import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateCompleteNutrientRequirements } from '../utils/faoCalculations';
import { optimizeDiet, validateDiet } from '../utils/dietOptimization';
import FAOCategorySelector from './FAOCategorySelector';
import FAOAnimalForm from './FAOAnimalForm';
import FAOIngredientSelector from './FAOIngredientSelector';
import FAOResultsDisplay from './FAOResultsDisplay';
import MultiPeriodCalculator from './MultiPeriodCalculator';

const FAODietCalculator = () => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [optimizedDiet, setOptimizedDiet] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validation, setValidation] = useState(null);

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

      const diet = await optimizeDiet(dietRequirements, selectedIngredients);
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
                  {language === 'en' ? 'FAO Cattle Diet Calculator' :
                   language === 'de' ? 'FAO Rinder-Futterrechner' :
                   'Calculadora FAO de Dietas para Ganado Vacuno'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Scientific formulation based on FAO and NASEM standards' :
                   language === 'de' ? 'Wissenschaftliche Formulierung basierend auf FAO- und NASEM-Standards' :
                   'Formulación científica basada en estándares FAO y NASEM'}
                </p>
              </div>
            </div>
            <button
              onClick={resetCalculator}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {language === 'en' ? 'Reset' :
                 language === 'de' ? 'Zurücksetzen' :
                 'Reiniciar'}
              </span>
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

          {/* New Requirements Card between Animal Data and Ingredients */}
          {currentStep >= 2 && requirements && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📌 {language === 'en' ? 'Requirements' : language === 'de' ? 'Bedarfswerte' : 'Requerimientos'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                {/* energy */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-blue-800">{language==='en'?'Total Energy':language==='de'?'Gesamtenergie':'Energía Total'}</div>
                  <div className="text-blue-600 font-mono">{requirements.energy.totalME} MJ</div>
                </div>
                {/* protein */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-medium text-green-800">{language==='en'?'Crude Protein':language==='de'?'Rohprotein':'Proteína Bruta'}</div>
                  <div className="text-green-600 font-mono">{requirements.nutrients.crudeProteinRequired} kg</div>
                  <div className="text-xs text-green-500">{((requirements.nutrients.crudeProteinRequired / requirements.nutrients.dryMatterIntake) * 100).toFixed(1)}% MS</div>
                </div>
                {/* calcium */}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="font-medium text-yellow-800">Ca</div>
                  <div className="text-yellow-600 font-mono">{requirements.nutrients.calciumRequired} g</div>
                </div>
                {/* phosphorus */}
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="font-medium text-orange-800">P</div>
                  <div className="text-orange-600 font-mono">{requirements.nutrients.phosphorusRequired} g</div>
                </div>
                {/* DMI */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-medium text-purple-800">{language==='en'?'Dry Matter Intake':language==='de'?'Trockenmasseaufnahme':'Materia Seca'}</div>
                  <div className="text-purple-600 font-mono">{requirements.nutrients.dryMatterIntake} kg</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {language==='en'? 'Daily requirements derived from animal inputs.' : language==='de'? 'Täglicher Bedarf basierend auf Tierdaten.' : 'Requerimientos diarios según los datos del animal.'}
              </div>
            </div>
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
                    <h3 className="font-semibold text-gray-800">
                      {language === 'en' ? 'Optimization (LP GLPK)' :
                       language === 'de' ? 'Optimierung (LP GLPK)' :
                       'Optimización (LP GLPK)'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'Linear programming solver (GLPK) minimizing cost' :
                       language === 'de' ? 'Lineare Programmierung (GLPK) zur Kostenminimierung' :
                       'Programación lineal (GLPK) minimizando costo'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Programación Lineal (GLPK)</h4>
                    <p className="text-sm text-gray-600">
                      {isCalculating 
                        ? 'Optimizando dieta...'
                        : selectedIngredients.length < 2
                        ? 'Selecciona al menos 2 ingredientes'
                        : optimizedDiet
                        ? `Dieta calculada con Programación Lineal (GLPK)`
                        : 'Resolverá cantidades óptimas minimizando costo'}
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
                        {validation.isValid ? 
                          (language === 'en' ? 'Valid diet' : language === 'de' ? 'Gültige Diät' : 'Dieta válida') :
                          (language === 'en' ? 'Review diet' : language === 'de' ? 'Diät überprüfen' : 'Revisar dieta')
                        }
                      </span>
                    </div>
                  )}
                  {canProceedToResults && (
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {language === 'en' ? 'View Results' :
                       language === 'de' ? 'Ergebnisse anzeigen' :
                       'Ver Resultados'}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  <strong>📊 LP (GLPK):</strong> {language === 'en' ? 'Minimizes total feed cost meeting nutrient constraints.' : language === 'de' ? 'Minimiert Gesamtkosten unter Nährstoffrestriktionen.' : 'Minimiza el costo total cumpliendo restricciones nutricionales.'}
                </div>
              </div>
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