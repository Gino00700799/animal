import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getBreedById } from '../data/cattleBreeds';
import { getCattleNutritionForWeight, calculateCattleFeedRequirements } from '../data/cattleNutrition';

// Futtermittel-Datenbank mit Nährstoffwerten
const feedDatabase = [
  {
    id: 'hay_meadow',
    name: { de: 'Wiesenheu', en: 'Meadow Hay', es: 'Heno de Pradera' },
    category: 'roughage',
    emoji: '🌾',
    nutritionPer100g: {
      energy_mj: 8.5, // MJ ME pro kg
      protein: 8.2, // % Rohprotein
      fiber: 28.5, // % Rohfaser
      dryMatter: 85, // % Trockenmasse
      tdn: 50 // % TDN
    },
    costPerKg: 0.15,
    availability: 'year_round'
  },
  {
    id: 'corn_silage',
    name: { de: 'Maissilage', en: 'Corn Silage', es: 'Ensilaje de Maíz' },
    category: 'silage',
    emoji: '🌽',
    nutritionPer100g: {
      energy_mj: 10.8,
      protein: 8.0,
      fiber: 22.0,
      dryMatter: 35,
      tdn: 65
    },
    costPerKg: 0.08,
    availability: 'year_round'
  },
  {
    id: 'barley',
    name: { de: 'Gerste', en: 'Barley', es: 'Cebada' },
    category: 'concentrate',
    emoji: '🌾',
    nutritionPer100g: {
      energy_mj: 12.5,
      protein: 11.5,
      fiber: 5.5,
      dryMatter: 88,
      tdn: 75
    },
    costPerKg: 0.25,
    availability: 'seasonal'
  },
  {
    id: 'soybean_meal',
    name: { de: 'Sojaschrot', en: 'Soybean Meal', es: 'Harina de Soja' },
    category: 'protein_supplement',
    emoji: '🫘',
    nutritionPer100g: {
      energy_mj: 13.2,
      protein: 44.0,
      fiber: 7.0,
      dryMatter: 89,
      tdn: 78
    },
    costPerKg: 0.45,
    availability: 'year_round'
  },
  {
    id: 'wheat_straw',
    name: { de: 'Weizenstroh', en: 'Wheat Straw', es: 'Paja de Trigo' },
    category: 'roughage',
    emoji: '🌾',
    nutritionPer100g: {
      energy_mj: 6.2,
      protein: 3.5,
      fiber: 42.0,
      dryMatter: 86,
      tdn: 40
    },
    costPerKg: 0.05,
    availability: 'seasonal'
  },
  {
    id: 'grass_fresh',
    name: { de: 'Frisches Gras', en: 'Fresh Grass', es: 'Hierba Fresca' },
    category: 'pasture',
    emoji: '🌱',
    nutritionPer100g: {
      energy_mj: 9.8,
      protein: 15.0,
      fiber: 25.0,
      dryMatter: 20,
      tdn: 60
    },
    costPerKg: 0.02,
    availability: 'seasonal'
  }
];

const CattleFeedCalculator = ({ selectedBreed, measurements }) => {
  const { language, t } = useLanguage();
  const [dailyGain, setDailyGain] = useState(1.2); // kg pro Tag
  const [activityLevel, setActivityLevel] = useState('normal');
  const [feedRecommendations, setFeedRecommendations] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [energyRequirement, setEnergyRequirement] = useState(0);

  // Berechnung des Energiebedarfs basierend auf Gewicht, Zunahme und Kalorienmultiplikator
  const calculateEnergyRequirement = () => {
    if (!selectedBreed || !measurements.weight) return 0;

    const breed = getBreedById(selectedBreed);
    if (!breed) return 0;

    // Grundumsatz basierend auf Kalorienmultiplikator
    const baseEnergy = measurements.weight * (breed.calorieMultiplier / 1000); // Umrechnung zu MJ

    // Zusätzlicher Energiebedarf für Gewichtszunahme
    // 1 kg Gewichtszunahme ≈ 35-40 MJ zusätzliche Energie
    const gainEnergy = dailyGain * 38;

    // Aktivitätsfaktor
    const activityFactors = {
      low: 1.0,      // Stallhaltung
      normal: 1.15,  // Normale Weide
      high: 1.3      // Intensive Weide/Bewegung
    };

    const totalEnergy = (baseEnergy + gainEnergy) * activityFactors[activityLevel];
    return Math.round(totalEnergy * 10) / 10;
  };

  // Optimierte Futtermittel-Empfehlungen basierend auf Energiebedarf
  const calculateFeedRecommendations = (energyNeeded) => {
    const recommendations = [];
    let remainingEnergy = energyNeeded;
    let totalDailyCost = 0;

    // Grundfutter (60-70% der Energie aus Raufutter)
    const roughageEnergyTarget = energyNeeded * 0.65;
    
    // Wiesenheu als Basis
    const hayFeed = feedDatabase.find(f => f.id === 'hay_meadow');
    const hayAmount = Math.min(
      roughageEnergyTarget / hayFeed.nutritionPer100g.energy_mj,
      measurements.weight * 0.025 // Max 2.5% des Körpergewichts als Heu
    );
    
    recommendations.push({
      feed: hayFeed,
      amount: Math.round(hayAmount * 10) / 10,
      energyProvided: hayAmount * hayFeed.nutritionPer100g.energy_mj,
      cost: hayAmount * hayFeed.costPerKg,
      percentage: (hayAmount * hayFeed.nutritionPer100g.energy_mj / energyNeeded * 100).toFixed(1)
    });
    
    remainingEnergy -= hayAmount * hayFeed.nutritionPer100g.energy_mj;
    totalDailyCost += hayAmount * hayFeed.costPerKg;

    // Silage für zusätzliche Energie
    if (remainingEnergy > 0) {
      const silageFeed = feedDatabase.find(f => f.id === 'corn_silage');
      const silageAmount = Math.min(
        remainingEnergy * 0.6 / silageFeed.nutritionPer100g.energy_mj,
        measurements.weight * 0.04 // Max 4% des Körpergewichts als Silage
      );
      
      if (silageAmount > 0.1) {
        recommendations.push({
          feed: silageFeed,
          amount: Math.round(silageAmount * 10) / 10,
          energyProvided: silageAmount * silageFeed.nutritionPer100g.energy_mj,
          cost: silageAmount * silageFeed.costPerKg,
          percentage: (silageAmount * silageFeed.nutritionPer100g.energy_mj / energyNeeded * 100).toFixed(1)
        });
        
        remainingEnergy -= silageAmount * silageFeed.nutritionPer100g.energy_mj;
        totalDailyCost += silageAmount * silageFeed.costPerKg;
      }
    }

    // Kraftfutter für hohe Gewichtszunahme
    if (remainingEnergy > 0 && dailyGain > 1.0) {
      const concentrateFeed = feedDatabase.find(f => f.id === 'barley');
      const concentrateAmount = Math.min(
        remainingEnergy / concentrateFeed.nutritionPer100g.energy_mj,
        measurements.weight * 0.015 // Max 1.5% des Körpergewichts als Kraftfutter
      );
      
      if (concentrateAmount > 0.1) {
        recommendations.push({
          feed: concentrateFeed,
          amount: Math.round(concentrateAmount * 10) / 10,
          energyProvided: concentrateAmount * concentrateFeed.nutritionPer100g.energy_mj,
          cost: concentrateAmount * concentrateFeed.costPerKg,
          percentage: (concentrateAmount * concentrateFeed.nutritionPer100g.energy_mj / energyNeeded * 100).toFixed(1)
        });
        
        remainingEnergy -= concentrateAmount * concentrateFeed.nutritionPer100g.energy_mj;
        totalDailyCost += concentrateAmount * concentrateFeed.costPerKg;
      }
    }

    // Proteinergänzung bei hoher Zunahme
    if (dailyGain > 1.5) {
      const proteinFeed = feedDatabase.find(f => f.id === 'soybean_meal');
      const proteinAmount = Math.min(
        0.5, // Max 0.5 kg Sojaschrot
        measurements.weight * 0.003 // 0.3% des Körpergewichts
      );
      
      recommendations.push({
        feed: proteinFeed,
        amount: Math.round(proteinAmount * 10) / 10,
        energyProvided: proteinAmount * proteinFeed.nutritionPer100g.energy_mj,
        cost: proteinAmount * proteinFeed.costPerKg,
        percentage: (proteinAmount * proteinFeed.nutritionPer100g.energy_mj / energyNeeded * 100).toFixed(1)
      });
      
      totalDailyCost += proteinAmount * proteinFeed.costPerKg;
    }

    return { recommendations, totalCost: Math.round(totalDailyCost * 100) / 100 };
  };

  useEffect(() => {
    const energy = calculateEnergyRequirement();
    setEnergyRequirement(energy);
    
    if (energy > 0) {
      const { recommendations, totalCost } = calculateFeedRecommendations(energy);
      setFeedRecommendations(recommendations);
      setTotalCost(totalCost);
    }
  }, [selectedBreed, measurements.weight, dailyGain, activityLevel]);

  if (!selectedBreed || !measurements.weight) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          {language === 'de' ? 'Bitte wählen Sie eine Rinderrasse und geben Sie das Gewicht ein.' :
           language === 'en' ? 'Please select a cattle breed and enter the weight.' :
           'Por favor seleccione una raza de ganado e ingrese el peso.'}
        </p>
      </div>
    );
  }

  const breed = getBreedById(selectedBreed);
  const totalFeedAmount = feedRecommendations.reduce((sum, rec) => sum + rec.amount, 0);
  const totalEnergyProvided = feedRecommendations.reduce((sum, rec) => sum + rec.energyProvided, 0);

  return (
    <div className="space-y-6">
      {/* Eingabe-Parameter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🎯 {language === 'de' ? 'Fütterungsparameter' : 
               language === 'en' ? 'Feeding Parameters' : 
               'Parámetros de Alimentación'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'de' ? 'Gewünschte tägliche Zunahme (kg)' :
               language === 'en' ? 'Desired daily gain (kg)' :
               'Ganancia diaria deseada (kg)'}
            </label>
            <input
              type="number"
              value={dailyGain}
              onChange={(e) => setDailyGain(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0.5"
              max="3.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {language === 'de' ? 'Empfohlen: 0.8-2.0 kg/Tag' :
               language === 'en' ? 'Recommended: 0.8-2.0 kg/day' :
               'Recomendado: 0.8-2.0 kg/día'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'de' ? 'Aktivitätslevel' :
               language === 'en' ? 'Activity Level' :
               'Nivel de Actividad'}
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">
                {language === 'de' ? '🏠 Niedrig (Stallhaltung)' :
                 language === 'en' ? '🏠 Low (Barn housing)' :
                 '🏠 Bajo (Estabulación)'}
              </option>
              <option value="normal">
                {language === 'de' ? '🌿 Normal (Weide)' :
                 language === 'en' ? '🌿 Normal (Pasture)' :
                 '🌿 Normal (Pastoreo)'}
              </option>
              <option value="high">
                {language === 'de' ? '🏃 Hoch (Intensive Bewegung)' :
                 language === 'en' ? '🏃 High (Intensive movement)' :
                 '🏃 Alto (Movimiento intensivo)'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Energiebedarf Übersicht */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          ⚡ {language === 'de' ? 'Energiebedarf-Analyse' :
               language === 'en' ? 'Energy Requirement Analysis' :
               'Análisis de Requerimientos Energéticos'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{energyRequirement}</div>
            <div className="text-sm text-gray-600">MJ ME/Tag</div>
            <div className="text-xs text-gray-500 mt-1">
              {language === 'de' ? 'Gesamtenergiebedarf' :
               language === 'en' ? 'Total energy requirement' :
               'Requerimiento total de energía'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalFeedAmount}</div>
            <div className="text-sm text-gray-600">kg/Tag</div>
            <div className="text-xs text-gray-500 mt-1">
              {language === 'de' ? 'Gesamtfuttermenge' :
               language === 'en' ? 'Total feed amount' :
               'Cantidad total de alimento'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalCost}€</div>
            <div className="text-sm text-gray-600">/Tag</div>
            <div className="text-xs text-gray-500 mt-1">
              {language === 'de' ? 'Tägliche Futterkosten' :
               language === 'en' ? 'Daily feed costs' :
               'Costos diarios de alimentación'}
            </div>
          </div>
        </div>
      </div>

      {/* Futtermittel-Empfehlungen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🌾 {language === 'de' ? 'Optimierte Futtermittel-Empfehlungen' :
               language === 'en' ? 'Optimized Feed Recommendations' :
               'Recomendaciones Optimizadas de Alimento'}
        </h3>
        
        <div className="space-y-4">
          {feedRecommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{rec.feed.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {rec.feed.name[language]}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'de' ? 'Kategorie:' :
                       language === 'en' ? 'Category:' :
                       'Categoría:'} {rec.feed.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{rec.amount} kg</div>
                  <div className="text-sm text-gray-500">{rec.percentage}% der Energie</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Energie:</span>
                  <span className="font-medium ml-1">{Math.round(rec.energyProvided * 10) / 10} MJ</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-medium ml-1">{rec.feed.nutritionPer100g.protein}%</span>
                </div>
                <div>
                  <span className="text-gray-600">TDN:</span>
                  <span className="font-medium ml-1">{rec.feed.nutritionPer100g.tdn}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Kosten:</span>
                  <span className="font-medium ml-1">{Math.round(rec.cost * 100) / 100}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zusätzliche Empfehlungen */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">
          💡 {language === 'de' ? 'Zusätzliche Empfehlungen' :
               language === 'en' ? 'Additional Recommendations' :
               'Recomendaciones Adicionales'}
        </h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• {language === 'de' ? 'Stellen Sie immer frisches Wasser zur Verfügung (ca. 40-60L/Tag)' :
                 language === 'en' ? 'Always provide fresh water (approx. 40-60L/day)' :
                 'Siempre proporcione agua fresca (aprox. 40-60L/día)'}</li>
          <li>• {language === 'de' ? 'Füttern Sie 2-3 mal täglich zu regelmäßigen Zeiten' :
                 language === 'en' ? 'Feed 2-3 times daily at regular times' :
                 'Alimente 2-3 veces al día en horarios regulares'}</li>
          <li>• {language === 'de' ? 'Überwachen Sie die Gewichtszunahme wöchentlich' :
                 language === 'en' ? 'Monitor weight gain weekly' :
                 'Monitoree el aumento de peso semanalmente'}</li>
          <li>• {language === 'de' ? 'Passen Sie die Futtermengen bei Wetteränderungen an' :
                 language === 'en' ? 'Adjust feed amounts with weather changes' :
                 'Ajuste las cantidades de alimento con cambios climáticos'}</li>
        </ul>
      </div>
    </div>
  );
};

export default CattleFeedCalculator;