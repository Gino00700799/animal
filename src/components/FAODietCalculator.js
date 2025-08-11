import React, { useState, useEffect } from 'react';
import { Calculator, Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateCompleteNutrientRequirements } from '../utils/faoCalculations';
import { optimizeDiet, validateDiet } from '../utils/dietOptimization';
import { useData } from '../contexts/DataContext';
import FAOCategorySelector from './FAOCategorySelector';
import FAOAnimalForm from './FAOAnimalForm';
import FAOIngredientSelector from './FAOIngredientSelector';
import FAOResultsDisplay from './FAOResultsDisplay';
import MultiPeriodCalculator from './MultiPeriodCalculator';

const FAODietCalculator = () => {
  const { t, language } = useLanguage();
  const { ingredients: allIngredients } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [optimizedDiet, setOptimizedDiet] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [optimizationMethod, setOptimizationMethod] = useState('lp');
  // Remove formulation mode toggle; always manual + optional automatic generation
  const [autoIngredients, setAutoIngredients] = useState([]);
  const [autoDiet, setAutoDiet] = useState(null);
  const [isAutoCalculating, setIsAutoCalculating] = useState(false);

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

      const diet = optimizationMethod === 'lp'
        ? await optimizeDiet(dietRequirements, selectedIngredients, {}, optimizationMethod)
        : optimizeDiet(dietRequirements, selectedIngredients, {}, optimizationMethod);
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

  const generateAutomaticDiet = async () => {
    if (!requirements) return;
    if (!requirements.energy?.totalME || !requirements.nutrients?.dryMatterIntake) {
      console.warn('[AUTO] Requerimientos incompletos', requirements);
      setAutoDiet({ isFeasible:false, composition:[], totalNutrients:{ energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message:'Requerimientos incompletos' });
      return;
    }
    setIsAutoCalculating(true);
    console.log('[AUTO] Generating automatic diet');
    try {
      console.log('[AUTO] Total ingredients loaded', allIngredients?.length);
      if (!allIngredients || allIngredients.length === 0) {
        setAutoDiet({ isFeasible:false, composition:[], totalNutrients:{ energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message:'Ingredientes no cargados (CSV vacío o error de fetch)' });
        return;
      }
      const autoSet = buildAutomaticIngredientSet(requirements, allIngredients) || [];
      console.log('[AUTO] Ingredient set size', autoSet.length, autoSet.map(i=>i.id));
      setAutoIngredients(autoSet);
      if (autoSet.length < 2) {
        setAutoDiet({ isFeasible: false, composition: [], totalNutrients: { energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message:'Set insuficiente (menos de 2 ingredientes)' });
        return;
      }
      const dietRequirements = {
        totalME: requirements.energy.totalME,
        crudeProteinRequired: requirements.nutrients.crudeProteinRequired,
        calciumRequired: requirements.nutrients.calciumRequired,
        phosphorusRequired: requirements.nutrients.phosphorusRequired,
        dryMatterIntake: requirements.nutrients.dryMatterIntake
      };
      let diet;
      try {
        diet = await optimizeDiet(dietRequirements, autoSet, {}, 'lp');
      } catch (solverErr) {
        console.error('[AUTO] optimizeDiet threw', solverErr);
        diet = { isFeasible:false, composition:[], totalNutrients:{ energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message: 'Excepción solver: '+ (solverErr?.message||String(solverErr)) };
      }
      console.log('[AUTO] Diet result', diet);
      if (!diet || !diet.totalNutrients) {
        setAutoDiet({ isFeasible:false, composition:[], totalNutrients:{ energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message:diet?.message||'Error solver (sin totalNutrients)' });
        return;
      }
      if (diet && Array.isArray(diet.composition)) {
        setAutoDiet(diet);
        setCurrentStep(s => s < 3 ? 3 : s);
      } else {
        setAutoDiet({ isFeasible:false, composition: [], totalNutrients: { energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message: diet?.message || 'Sin solución' });
      }
    } catch (e) {
      console.error('[AUTO] Error automatic diet (outer):', e);
      setAutoDiet({ isFeasible:false, composition: [], totalNutrients: { energy:0, protein:0, calcium:0, phosphorus:0, dryMatter:0 }, totalCost:0, message: e?.message ? 'Error: '+e.message : 'Error generando dieta (ver consola)' });
    } finally {
      setIsAutoCalculating(false);
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

          {/* Separate Automatic Diet Generation Card (outside requirements) */}
          {currentStep >= 2 && requirements && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">🤖 {language==='en'?'Automatic Diet Generator':'Generador de Dieta Automática'}</h3>
                <button
                  onClick={generateAutomaticDiet}
                  disabled={isAutoCalculating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isAutoCalculating? 'bg-green-300 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >{isAutoCalculating ? (language==='en'?'Generating...':'Generando...') : (language==='en'?'Generate Automatic Diet':'Generar Dieta Automática')}</button>
              </div>
              <p className="text-sm text-gray-600">
                {language==='en'
                  ? 'Creates a representative low-cost ingredient set and solves with Linear Programming.'
                  : language==='de'
                  ? 'Erstellt ein repräsentatives kostengünstiges Zutatenset und löst per Linearer Programmierung.'
                  : 'Crea un set representativo de bajo costo y resuelve con Programación Lineal.'}
              </p>
              <p className="mt-2 text-xs text-gray-500">{language==='en'? 'Available after entering animal data.' : language==='de'? 'Verfügbar nach Eingabe der Tierdaten.' : 'Disponible tras ingresar los datos del animal.'}</p>
              {isAutoCalculating && (
                <div className="mt-4 flex items-center space-x-3 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500" />
                  <span>{language==='en'?'Calculating optimal mix...':'Calculando mezcla óptima...'}</span>
                </div>
              )}
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
          {currentStep >= 3 && autoDiet && Array.isArray(autoDiet.composition) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">🤖 {language==='en'?'Automatic Least-Cost Diet':'Dieta Automática de Mínimo Costo'}</h3>
              {autoDiet.message && (
                <div className={`mb-3 text-xs ${autoDiet.isFeasible? 'text-green-600':'text-gray-600'}`}>⚠️ {autoDiet.message}</div>
              )}
              {!autoDiet.isFeasible && autoDiet.composition.length===0 && (
                <div className="mb-4 text-sm text-red-600">
                  {autoDiet.message || (language==='en'?'No feasible solution':'Sin solución factible')}
                </div>
              )}
              <p className="text-sm text-gray-600 mb-4">{language==='en'? 'Automatically selected ingredients and optimized mix.' : language==='de'? 'Automatisch gewählte Zutaten und optimierte Mischung.' : 'Ingredientes seleccionados automáticamente y mezcla optimizada.'}</p>
              {autoDiet.composition.length > 0 ? (
                <>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-xs md:text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-2 text-left">{language==='en'?'Ingredient':'Ingrediente'}</th>
                          <th className="px-2 py-2 text-right">{language==='en'?'As-Fed kg/d':'Kg Fresco/d'}</th>
                          <th className="px-2 py-2 text-right">MS kg</th>
                          <th className="px-2 py-2 text-right">ME MJ</th>
                          <th className="px-2 py-2 text-right">PB kg</th>
                          <th className="px-2 py-2 text-right">Ca g</th>
                          <th className="px-2 py-2 text-right">P g</th>
                          <th className="px-2 py-2 text-right">€/d</th>
                        </tr>
                      </thead>
                      <tbody>
                        {autoDiet.composition.map(row => {
                          const dm = row.amount * (row.ingredient.composition.dryMatter/100);
                          const me = dm * row.ingredient.composition.metabolizableEnergy;
                          const pb = dm * (row.ingredient.composition.crudeProtein/100);
                          const ca = dm * (row.ingredient.composition.calcium/100) * 1000; // g
                          const p = dm * (row.ingredient.composition.phosphorus/100) * 1000; // g
                          const cost = row.amount * (row.ingredient.costPerKg || 0);
                          return (
                            <tr key={row.ingredient.id} className="border-t">
                              <td className="px-2 py-2 font-medium whitespace-nowrap">{row.ingredient.name?.es || row.ingredient.id}</td>
                              <td className="px-2 py-2 text-right">{row.amount.toFixed(2)}</td>
                              <td className="px-2 py-2 text-right">{dm.toFixed(2)}</td>
                              <td className="px-2 py-2 text-right">{me.toFixed(1)}</td>
                              <td className="px-2 py-2 text-right">{pb.toFixed(2)}</td>
                              <td className="px-2 py-2 text-right">{ca.toFixed(0)}</td>
                              <td className="px-2 py-2 text-right">{p.toFixed(0)}</td>
                              <td className="px-2 py-2 text-right">€{cost.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50 font-semibold">
                        <tr>
                          <td className="px-2 py-2">Total</td>
                          <td className="px-2 py-2 text-right">{autoDiet.composition.reduce((s,r)=>s+r.amount,0).toFixed(2)}</td>
                          <td className="px-2 py-2 text-right">{autoDiet.totalNutrients.dryMatter?.toFixed(2) || '0.00'}</td>
                          <td className="px-2 py-2 text-right">{autoDiet.totalNutrients.energy?.toFixed(1) || '0.0'}</td>
                          <td className="px-2 py-2 text-right">{autoDiet.totalNutrients.protein?.toFixed(2) || '0.00'}</td>
                          <td className="px-2 py-2 text-right">{(autoDiet.totalNutrients.calcium*1000 || 0).toFixed(0)}</td>
                          <td className="px-2 py-2 text-right">{(autoDiet.totalNutrients.phosphorus*1000 || 0).toFixed(0)}</td>
                          <td className="px-2 py-2 text-right">€{autoDiet.totalCost?.toFixed(2) || '0.00'}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-800">ME</div>
                      <div className="text-blue-600">{autoDiet.totalNutrients.energy?.toFixed(1) || '0.0'} / {requirements.energy.totalME} MJ</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800">PB</div>
                      <div className="text-green-600">{autoDiet.totalNutrients.protein?.toFixed(2) || '0.00'} / {requirements.nutrients.crudeProteinRequired} kg</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="font-medium text-yellow-800">Ca</div>
                      <div className="text-yellow-600">{((autoDiet.totalNutrients.calcium||0)*1000).toFixed(0)} / {requirements.nutrients.calciumRequired} g</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-medium text-orange-800">P</div>
                      <div className="text-orange-600">{((autoDiet.totalNutrients.phosphorus||0)*1000).toFixed(0)} / {requirements.nutrients.phosphorusRequired} g</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  {language==='en'?'No feasible automatic solution (check constraints).':'Sin solución automática factible (revisa restricciones).'}
                </div>
              )}
            </div>
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

// Heurística para construir set automático
function buildAutomaticIngredientSet(requirements, allIngredients) {
  if (!allIngredients || allIngredients.length === 0) return [];
  const pickBest = (list, scorer) => list.reduce((best,c)=> scorer(c)>scorer(best)?c:best, list[0]);
  const byCat = cat => allIngredients.filter(i=>i.category===cat);
  const sel = new Map();
  const add = ing => { if ( ing && !sel.has(ing.id)) sel.set(ing.id, ing); };
  // Forraje seco
  const forrajes = byCat('forrajes_secos');
  if (forrajes.length) add(pickBest(forrajes, i => (i.composition.metabolizableEnergy / (i.costPerKg||1)) + i.composition.crudeProtein*0.05));
  // Ensilado
  const ensilados = byCat('ensilados');
  if (ensilados.length) add(pickBest(ensilados, i => i.composition.metabolizableEnergy / (i.costPerKg||1)));
  // Energéticos (top 2)
  const energ = byCat('alimentos_energeticos').sort((a,b)=> (b.composition.metabolizableEnergy/(b.costPerKg||1)) - (a.composition.metabolizableEnergy/(a.costPerKg||1)) ).slice(0,2);
  energ.forEach(add);
  // Proteicos (top 2 por proteína/costo)
  const prots = byCat('suplementos_proteicos').sort((a,b)=> (b.composition.crudeProtein/(b.costPerKg||1)) - (a.composition.crudeProtein/(a.costPerKg||1)) ).slice(0,2);
  prots.forEach(add);
  // Subproducto fibroso económico (opcional)
  const subprod = byCat('subproductos_fibro_energeticos').sort((a,b)=> ( (b.composition.metabolizableEnergy + b.composition.crudeProtein*0.3) /(b.costPerKg||1)) - ((a.composition.metabolizableEnergy + a.composition.crudeProtein*0.3)/(a.costPerKg||1)) ).slice(0,1);
  subprod.forEach(add);
  // Minerales estándar
  ['carbonato_calcio','fosfato_dicalcico','sal_comun','premix_vitam_mineral'].forEach(id=> {
    const ing = allIngredients.find(i=>i.id===id);
    if (ing) add(ing);
  });
  return Array.from(sel.values());
}