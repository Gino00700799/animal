import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Beef, Droplets, Activity, Info } from 'lucide-react';
import { 
  calculateCalories, 
  calculateMeatNeeds, 
  calculateBMI, 
  getBMICategory, 
  calculateWaterNeeds, 
  getFeedingRecommendations,
  calculateFaoEnergyRequirement 
} from '../utils/calculations';
import { getDietInfo } from '../data/animals';
import CattleNutritionDisplay from './CattleNutritionDisplay';
import CattleFeedCalculator from './CattleFeedCalculator';
import ExportReport from './ExportReport';
import FeedCostCalculator from './FeedCostCalculator';
import CostCalculator from './CostCalculator';
import WeatherIntegration from './WeatherIntegration';
import { useLanguage } from '../contexts/LanguageContext';

const ResultsDisplay = ({ animal, measurements, onReset }) => {
  const { t, language } = useLanguage();
  
  if (!animal || !measurements) return null;

  const calories = calculateCalories(animal, measurements.weight);
  const meatNeeds = calculateMeatNeeds(animal, measurements.weight, calories);
  const bmi = calculateBMI(measurements.weight, measurements.height);
  const bmiCategory = getBMICategory(bmi, animal);
  const waterNeeds = calculateWaterNeeds(measurements.weight, calories);
  const recommendations = getFeedingRecommendations(animal, measurements.weight, calories);
  const dietInfo = getDietInfo(animal.diet);

  // FAO-Berechnung für Rinder
  let faoData = null;
  if (animal.type === 'beef' || animal.type === 'veal' || animal.type === 'dairy') {
    let adg = 1.2; // Standard für Mastbullen
    if (animal.type === 'veal') adg = 1.0;
    if (animal.type === 'dairy') adg = 0.8;
    
    faoData = calculateFaoEnergyRequirement(measurements.weight, adg);
  }

  // Data for charts
  const nutritionData = [
    { name: 'Daily Calories', value: calories, color: '#3b82f6' },
    { name: 'Water (L)', value: waterNeeds * 100, color: '#06b6d4' }, // Multiply by 100 for better visualization
  ];

  if (animal.diet === 'carnivore') {
    nutritionData.push({ name: 'Meat (g)', value: meatNeeds, color: '#ef4444' });
  }

  const comparisonData = [
    { 
      name: t('yourAnimal'), 
      weight: measurements.weight, 
      calories: calories,
      bmi: bmi
    },
    { 
      name: t('average'), 
      weight: (animal.averageWeight?.min + animal.averageWeight?.max) / 2 || 0,
      calories: calculateCalories(animal, ((animal.averageWeight?.min + animal.averageWeight?.max) / 2) || 0),
      bmi: calculateBMI(
        ((animal.averageWeight?.min + animal.averageWeight?.max) / 2) || 0,
        ((animal.averageHeight?.min + animal.averageHeight?.max) / 2) || 0
      )
    }
  ];

  const pieData = [
    { name: t('caloriesFromFood'), value: calories, color: '#3b82f6' },
    { name: t('energyForActivity'), value: calories * 0.3, color: '#10b981' },
    { name: t('metabolicProcesses'), value: calories * 0.7, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{animal.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t('nutritionalAnalysis')} {animal.name ? animal.name[language] || animal.name : animal.name}
              </h2>
              <p className="text-gray-600">
                {t('weight')}: {measurements.weight}kg | {t('height')}: {measurements.height}m
                {measurements.age && ` | ${t('age')}: ${measurements.age} Jahre`}
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            {t('calculateAnother')}
          </button>
        </div>

        {/* Diet Badge */}
        <div className="flex items-center space-x-2">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${dietInfo.bgColor} ${dietInfo.color}
          `}>
            <span className="mr-1">{dietInfo.icon}</span>
            {dietInfo.description}
          </span>
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${bmiCategory.color === 'text-green-600' ? 'bg-green-100' : 
              bmiCategory.color === 'text-yellow-600' ? 'bg-yellow-100' : 
              bmiCategory.color === 'text-red-600' ? 'bg-red-100' : 'bg-blue-100'}
            ${bmiCategory.color}
          `}>
            <Activity className="w-4 h-4 mr-1" />
            BMI: {bmi} ({bmiCategory.category})
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{calories.toLocaleString()}</div>
          <div className="text-sm text-gray-600">{t('caloriesPerDay')}</div>
        </div>

        {animal.diet === 'carnivore' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
            <Beef className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{meatNeeds.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{t('gramsOfMeat')}</div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <Droplets className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{waterNeeds}</div>
          <div className="text-sm text-gray-600">{t('litersOfWater')}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{bmi}</div>
          <div className="text-sm text-gray-600">{t('bodyMassIndex')}</div>
        </div>
      </div>

      {/* FAO Energy Requirements for Cattle */}
      {faoData && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🔬</div>
            <div>
              <h3 className="text-xl font-bold text-green-800">
                FAO Energiebedarf-Berechnung
              </h3>
              <p className="text-green-700 text-sm">
                Wissenschaftliche Berechnung nach FAO Animal Production and Health Paper 1 (2001, 2004)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-gray-800">Erhaltungsbedarf</div>
              <div className="text-2xl font-bold text-blue-600">{faoData.maintenance}</div>
              <div className="text-sm text-gray-600">MJ ME/Tag</div>
              <div className="text-xs text-gray-500 mt-1">NEm = 0.322 × BW^0.75</div>
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-gray-800">Wachstumsbedarf</div>
              <div className="text-2xl font-bold text-green-600">{faoData.gain}</div>
              <div className="text-sm text-gray-600">MJ ME/Tag</div>
              <div className="text-xs text-gray-500 mt-1">NEg = 0.0368 × BW^0.75 × ADG^1.097</div>
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-gray-800">Gesamtenergiebedarf</div>
              <div className="text-2xl font-bold text-purple-600">{faoData.totalME}</div>
              <div className="text-sm text-gray-600">MJ ME/Tag</div>
              <div className="text-xs text-gray-500 mt-1">≈ {Math.round(faoData.totalME * 239).toLocaleString()} kcal</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Erklärung:</strong> BW = Körpergewicht ({measurements.weight} kg), 
              ADG = Tägliche Gewichtszunahme ({animal.type === 'veal' ? '1.0' : animal.type === 'dairy' ? '0.8' : '1.2'} kg/Tag), 
              ME = Metabolisierbare Energie
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dailyNutritionNeeds')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                if (name === 'Water (L)') return [(value / 100).toFixed(1), 'Liters'];
                return [value.toLocaleString(), name.includes('Calories') ? 'kcal' : 'grams'];
              }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison with Average */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('comparisonWithAverage')} {animal.name ? animal.name[language] : ''}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#10b981" name="Weight (kg)" />
              <Bar dataKey="calories" fill="#3b82f6" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Energy Distribution */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('energyDistribution')}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), 'kcal']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-medium text-gray-800">
                  {item.value.toLocaleString()} kcal
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feeding Recommendations */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-500" />
          {t('feedingRecommendations')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">{t('dailyRequirements')}</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 {t('proTips')}:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• {t('monitorWeight')}</li>
              <li>• {t('adjustPortions')}</li>
              <li>• {t('provideEnrichment')}</li>
              <li>• {t('consultVets')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professional Cattle Nutrition Section */}
      <CattleNutritionDisplay animal={animal} measurements={measurements} />
      
      {/* Cost Calculator Section */}
      <CostCalculator 
        animal={animal} 
        measurements={measurements} 
        feedRequirements={{
          hayKg: Math.round(measurements.weight * 0.015 * 10) / 10,
          concentrateKg: Math.round(measurements.weight * 0.008 * 10) / 10,
          silageKg: Math.round(measurements.weight * 0.02 * 10) / 10,
          waterLiters: Math.round(measurements.weight * 0.08)
        }}
      />
      
      {/* Advanced Feed Calculator Section */}
      <CattleFeedCalculator selectedBreed={animal.id} measurements={measurements} />
      
      {/* Weather Integration Section */}
      <WeatherIntegration 
        feedRequirements={{
          waterLiters: waterNeeds,
          energyMJ: faoData ? faoData.totalME : calories / 239,
          totalDryMatter: measurements.weight * 0.025
        }}
        onWeatherAdjustment={(adjustments) => {
          // Handle weather adjustments if needed
          console.log('Weather adjustments:', adjustments);
        }}
      />
      
      {/* Feed Cost Calculator Section */}
      <FeedCostCalculator 
        feedRequirements={{
          hayKg: Math.round(measurements.weight * 0.015 * 10) / 10,
          concentrateKg: Math.round(measurements.weight * 0.008 * 10) / 10,
          silageKg: Math.round(measurements.weight * 0.02 * 10) / 10,
          waterLiters: waterNeeds,
          totalDryMatter: measurements.weight * 0.025
        }}
        animal={animal}
      />
      
      {/* Export Report Section */}
      <ExportReport 
        animal={animal}
        measurements={measurements}
        nutritionData={{
          tmKg: measurements.weight * 0.025,
          tdnKg: measurements.weight * 0.015,
          dcpKg: measurements.weight * 0.002
        }}
        feedRequirements={{
          hayKg: Math.round(measurements.weight * 0.015 * 10) / 10,
          concentrateKg: Math.round(measurements.weight * 0.008 * 10) / 10,
          silageKg: Math.round(measurements.weight * 0.02 * 10) / 10,
          waterLiters: waterNeeds,
          dailyCostEuro: Math.round((measurements.weight * 0.025 * 0.25) * 100) / 100
        }}
      />
    </div>
  );
};

export default ResultsDisplay;