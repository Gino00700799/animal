import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WeatherIntegration = ({ feedRequirements, onWeatherAdjustment }) => {
  const [weather, setWeather] = useState({
    temperature: 20,
    humidity: 60,
    windSpeed: 10,
    condition: 'sunny',
    season: 'spring'
  });
  
  const [adjustments, setAdjustments] = useState({
    waterIncrease: 0,
    energyIncrease: 0,
    shelterNeeded: false
  });

  const { t, language } = useLanguage();

  useEffect(() => {
    calculateWeatherAdjustments();
  }, [weather]);

  const calculateWeatherAdjustments = () => {
    let waterIncrease = 0;
    let energyIncrease = 0;
    let shelterNeeded = false;

    // Temperature adjustments
    if (weather.temperature > 25) {
      waterIncrease += (weather.temperature - 25) * 0.1; // 10% more water per degree above 25°C
      energyIncrease -= 0.05; // Less energy needed in hot weather
    } else if (weather.temperature < 5) {
      energyIncrease += (5 - weather.temperature) * 0.08; // 8% more energy per degree below 5°C
      shelterNeeded = true;
    }

    // Humidity adjustments
    if (weather.humidity > 80) {
      waterIncrease += 0.15;
      shelterNeeded = true;
    }

    // Wind adjustments
    if (weather.windSpeed > 20) {
      energyIncrease += 0.1;
      shelterNeeded = true;
    }

    // Season adjustments
    const seasonMultipliers = {
      winter: { energy: 1.2, water: 0.9 },
      spring: { energy: 1.0, water: 1.0 },
      summer: { energy: 0.9, water: 1.3 },
      autumn: { energy: 1.1, water: 1.0 }
    };

    const seasonMult = seasonMultipliers[weather.season];
    energyIncrease *= seasonMult.energy;
    waterIncrease *= seasonMult.water;

    const newAdjustments = {
      waterIncrease: Math.max(0, waterIncrease),
      energyIncrease,
      shelterNeeded
    };

    setAdjustments(newAdjustments);
    onWeatherAdjustment && onWeatherAdjustment(newAdjustments);
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const adjustedWater = feedRequirements.waterLiters * (1 + adjustments.waterIncrease);
  const adjustedEnergy = feedRequirements.energyMJ * (1 + adjustments.energyIncrease);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        {getWeatherIcon()}
        <span className="ml-2">Wetter-angepasste Fütterung</span>
      </h3>

      {/* Weather Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            <Thermometer className="w-4 h-4 inline mr-1" />
            Temperatur (°C)
          </label>
          <input
            type="number"
            value={weather.temperature}
            onChange={(e) => setWeather(prev => ({ ...prev, temperature: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            <Droplets className="w-4 h-4 inline mr-1" />
            Luftfeuchtigkeit (%)
          </label>
          <input
            type="number"
            value={weather.humidity}
            onChange={(e) => setWeather(prev => ({ ...prev, humidity: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            <Wind className="w-4 h-4 inline mr-1" />
            Windgeschw. (km/h)
          </label>
          <input
            type="number"
            value={weather.windSpeed}
            onChange={(e) => setWeather(prev => ({ ...prev, windSpeed: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Jahreszeit
          </label>
          <select
            value={weather.season}
            onChange={(e) => setWeather(prev => ({ ...prev, season: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="spring">🌸 Frühling</option>
            <option value="summer">☀️ Sommer</option>
            <option value="autumn">🍂 Herbst</option>
            <option value="winter">❄️ Winter</option>
          </select>
        </div>
      </div>

      {/* Weather Adjustments Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Angepasste Bedürfnisse</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Wasserbedarf</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {adjustedWater.toFixed(1)}L
                </div>
                <div className="text-sm text-gray-500">
                  {adjustments.waterIncrease > 0 && `+${(adjustments.waterIncrease * 100).toFixed(0)}%`}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Energiebedarf</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">
                  {adjustedEnergy.toFixed(1)} MJ
                </div>
                <div className="text-sm text-gray-500">
                  {adjustments.energyIncrease !== 0 && 
                    `${adjustments.energyIncrease > 0 ? '+' : ''}${(adjustments.energyIncrease * 100).toFixed(0)}%`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Wetter-Empfehlungen</h4>
          
          <div className="space-y-3">
            {adjustments.shelterNeeded && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <span className="text-lg">🏠</span>
                  <span className="font-medium">Schutz erforderlich</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Aufgrund der Wetterbedingungen sollten die Tiere Zugang zu Schutz haben.
                </p>
              </div>
            )}

            {weather.temperature > 30 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-800">
                  <span className="text-lg">🌡️</span>
                  <span className="font-medium">Hitzestress-Warnung</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Sorgen Sie für Schatten und zusätzliches Wasser. Fütterung in kühleren Stunden.
                </p>
              </div>
            )}

            {weather.temperature < 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <span className="text-lg">❄️</span>
                  <span className="font-medium">Kälteschutz</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Erhöhter Energiebedarf. Warmer Unterstand und frostfreies Wasser erforderlich.
                </p>
              </div>
            )}

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <span className="text-lg">💡</span>
                <span className="font-medium">Allgemeine Tipps</span>
              </div>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• Überwachen Sie die Tiere bei extremen Wetterbedingungen häufiger</li>
                <li>• Stellen Sie sicher, dass Wasser nicht einfriert</li>
                <li>• Passen Sie Fütterungszeiten an die Witterung an</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherIntegration;