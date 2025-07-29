import React, { useState, useEffect } from 'react';
import { Calculator, Euro, TrendingUp, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const CostCalculator = ({ animal, measurements, feedRequirements, weatherData }) => {
  const [costSettings, setCostSettings] = useState({
    hayPricePerKg: 0.15,
    concentratePricePerKg: 0.35,
    silagePricePerKg: 0.08,
    waterPricePerLiter: 0.002,
    laborCostPerDay: 8.50,
    veterinaryCostPerMonth: 25.00,
    electricityCostPerDay: 2.30
  });
  
  const [timeframe, setTimeframe] = useState('daily'); // daily, weekly, monthly, yearly
  const { t, language } = useLanguage();

  if (!animal || !measurements || !feedRequirements) return null;

  // Berechne Grundkosten
  const calculateBaseCosts = () => {
    const dailyCosts = {
      hay: feedRequirements.hayKg * costSettings.hayPricePerKg,
      concentrate: feedRequirements.concentrateKg * costSettings.concentratePricePerKg,
      silage: feedRequirements.silageKg * costSettings.silagePricePerKg,
      water: feedRequirements.waterLiters * costSettings.waterPricePerLiter,
      labor: costSettings.laborCostPerDay,
      electricity: costSettings.electricityCostPerDay
    };

    // Wetter-Anpassungen
    if (weatherData) {
      dailyCosts.water *= weatherData.recommendations?.waterIncrease || 1;
      dailyCosts.hay *= weatherData.recommendations?.feedAdjustment || 1;
      dailyCosts.concentrate *= weatherData.recommendations?.feedAdjustment || 1;
    }

    const totalDaily = Object.values(dailyCosts).reduce((sum, cost) => sum + cost, 0);
    
    return {
      daily: dailyCosts,
      totalDaily,
      totalWeekly: totalDaily * 7,
      totalMonthly: totalDaily * 30 + costSettings.veterinaryCostPerMonth,
      totalYearly: totalDaily * 365 + costSettings.veterinaryCostPerMonth * 12
    };
  };

  const costs = calculateBaseCosts();

  // Daten für Diagramme
  const costBreakdownData = [
    { name: 'Heu', value: costs.daily.hay, color: '#f59e0b' },
    { name: 'Kraftfutter', value: costs.daily.concentrate, color: '#ef4444' },
    { name: 'Silage', value: costs.daily.silage, color: '#10b981' },
    { name: 'Wasser', value: costs.daily.water, color: '#06b6d4' },
    { name: 'Arbeit', value: costs.daily.labor, color: '#8b5cf6' },
    { name: 'Strom', value: costs.daily.electricity, color: '#f97316' }
  ];

  const timeframeData = [
    { period: 'Tag', cost: costs.totalDaily },
    { period: 'Woche', cost: costs.totalWeekly },
    { period: 'Monat', cost: costs.totalMonthly },
    { period: 'Jahr', cost: costs.totalYearly }
  ];

  const getTimeframeCost = () => {
    switch (timeframe) {
      case 'weekly': return costs.totalWeekly;
      case 'monthly': return costs.totalMonthly;
      case 'yearly': return costs.totalYearly;
      default: return costs.totalDaily;
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'weekly': return 'pro Woche';
      case 'monthly': return 'pro Monat';
      case 'yearly': return 'pro Jahr';
      default: return 'pro Tag';
    }
  };

  // Kosteneffizienz-Bewertung
  const getCostEfficiencyRating = () => {
    const costPerKg = costs.totalDaily / measurements.weight;
    if (costPerKg < 0.02) return { rating: 'Sehr effizient', color: 'text-green-600', icon: '🟢' };
    if (costPerKg < 0.04) return { rating: 'Effizient', color: 'text-blue-600', icon: '🔵' };
    if (costPerKg < 0.06) return { rating: 'Durchschnittlich', color: 'text-yellow-600', icon: '🟡' };
    return { rating: 'Teuer', color: 'text-red-600', icon: '🔴' };
  };

  const efficiency = getCostEfficiencyRating();

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-800">
                Kostenrechner
              </h3>
              <p className="text-green-700">
                Detaillierte Fütterungskosten für {animal.name?.[language] || animal.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-800">
              €{getTimeframeCost().toFixed(2)}
            </div>
            <div className="text-sm text-green-600">{getTimeframeLabel()}</div>
          </div>
        </div>

        {/* Zeitraum-Auswahl */}
        <div className="flex space-x-2 mb-4">
          {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-700 hover:bg-green-100'
              }`}
            >
              {period === 'daily' ? 'Täglich' :
               period === 'weekly' ? 'Wöchentlich' :
               period === 'monthly' ? 'Monatlich' : 'Jährlich'}
            </button>
          ))}
        </div>

        {/* Effizienz-Bewertung */}
        <div className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
          <span className="text-lg">{efficiency.icon}</span>
          <span className="font-medium">Kosteneffizienz:</span>
          <span className={`font-bold ${efficiency.color}`}>{efficiency.rating}</span>
          <span className="text-sm text-gray-600">
            (€{(costs.totalDaily / measurements.weight).toFixed(3)}/kg Körpergewicht)
          </span>
        </div>
      </div>

      {/* Kostenaufschlüsselung */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white/90 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-500" />
            Tägliche Kostenverteilung
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, 'Kosten']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/90 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
            Kosten nach Zeitraum
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeframeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, 'Kosten']} />
                <Bar dataKey="cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detaillierte Kostenaufstellung */}
      <div className="bg-white/90 rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Euro className="w-5 h-5 mr-2 text-yellow-500" />
          Detaillierte Kostenaufstellung
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(costs.daily).map(([category, cost]) => (
            <div key={category} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category === 'hay' ? 'Heu' :
                   category === 'concentrate' ? 'Kraftfutter' :
                   category === 'silage' ? 'Silage' :
                   category === 'water' ? 'Wasser' :
                   category === 'labor' ? 'Arbeit' :
                   category === 'electricity' ? 'Strom' : category}
                </span>
                <span className="font-bold text-gray-800">€{cost.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {timeframe === 'yearly' ? `€${(cost * 365).toFixed(0)}/Jahr` :
                 timeframe === 'monthly' ? `€${(cost * 30).toFixed(0)}/Monat` :
                 timeframe === 'weekly' ? `€${(cost * 7).toFixed(0)}/Woche` : 'pro Tag'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimierungsvorschläge */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Optimierungsvorschläge
        </h4>
        <div className="space-y-3">
          {costs.daily.hay > costs.daily.silage * 2 && (
            <div className="flex items-start space-x-2 p-3 bg-white/60 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <strong>Futter-Mix optimieren:</strong> Mehr Silage statt Heu verwenden könnte die Kosten um bis zu €{((costs.daily.hay - costs.daily.silage) * 0.5).toFixed(2)}/Tag reduzieren.
              </div>
            </div>
          )}
          
          <div className="flex items-start space-x-2 p-3 bg-white/60 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <strong>Saisonale Beschaffung:</strong> Heu im Sommer kaufen kann die Kosten um 15-20% reduzieren.
            </div>
          </div>
          
          <div className="flex items-start space-x-2 p-3 bg-white/60 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <strong>Gruppenhaltung:</strong> Arbeitskosten pro Tier können bei Gruppenhaltung um bis zu 30% reduziert werden.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;