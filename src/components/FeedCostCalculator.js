import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeedCostCalculator = ({ feedRequirements, animal }) => {
  const [feedPrices, setFeedPrices] = useState({
    hay: 0.15,
    concentrate: 0.35,
    silage: 0.08,
    water: 0.002
  });
  
  const [timeframe, setTimeframe] = useState('daily');
  const { t, language } = useLanguage();

  const calculateCosts = () => {
    const dailyCosts = {
      hay: feedRequirements.hayKg * feedPrices.hay,
      concentrate: feedRequirements.concentrateKg * feedPrices.concentrate,
      silage: feedRequirements.silageKg * feedPrices.silage,
      water: feedRequirements.waterLiters * feedPrices.water
    };

    const totalDaily = Object.values(dailyCosts).reduce((sum, cost) => sum + cost, 0);

    const multipliers = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };

    return {
      daily: dailyCosts,
      total: totalDaily * multipliers[timeframe],
      totalDaily
    };
  };

  const costs = calculateCosts();

  const feedTypes = [
    { key: 'hay', name: 'Heu', icon: '🌾', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'concentrate', name: 'Kraftfutter', icon: '🌰', color: 'bg-red-100 text-red-800' },
    { key: 'silage', name: 'Silage', icon: '🌽', color: 'bg-green-100 text-green-800' },
    { key: 'water', name: 'Wasser', icon: '💧', color: 'bg-blue-100 text-blue-800' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-green-500" />
        Futterkostenrechner
      </h3>

      {/* Price Input Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Aktuelle Preise (€ pro kg/L)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {feedTypes.map(feed => (
            <div key={feed.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                {feed.icon} {feed.name}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={feedPrices[feed.key]}
                onChange={(e) => setFeedPrices(prev => ({
                  ...prev,
                  [feed.key]: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Zeitraum</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'daily', label: 'Täglich', icon: '📅' },
            { key: 'weekly', label: 'Wöchentlich', icon: '📊' },
            { key: 'monthly', label: 'Monatlich', icon: '🗓️' },
            { key: 'yearly', label: 'Jährlich', icon: '📈' }
          ].map(period => (
            <button
              key={period.key}
              onClick={() => setTimeframe(period.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === period.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.icon} {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-700">
          Kostenaufschlüsselung ({timeframe === 'daily' ? 'täglich' : 
                                 timeframe === 'weekly' ? 'wöchentlich' :
                                 timeframe === 'monthly' ? 'monatlich' : 'jährlich'})
        </h4>
        
        {feedTypes.map(feed => {
          const dailyCost = costs.daily[feed.key];
          const totalCost = dailyCost * (timeframe === 'daily' ? 1 : 
                                       timeframe === 'weekly' ? 7 :
                                       timeframe === 'monthly' ? 30 : 365);
          
          return (
            <div key={feed.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feed.icon}</span>
                <div>
                  <div className="font-medium text-gray-800">{feed.name}</div>
                  <div className="text-sm text-gray-500">
                    {feedRequirements[feed.key === 'water' ? 'waterLiters' : feed.key + 'Kg']} 
                    {feed.key === 'water' ? ' L' : ' kg'} × €{feedPrices[feed.key]}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  €{totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  (€{dailyCost.toFixed(2)}/Tag)
                </div>
              </div>
            </div>
          );
        })}

        {/* Total Cost */}
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-lg font-bold text-gray-800">Gesamtkosten</div>
                <div className="text-sm text-gray-600">
                  Für {animal.name[language]} ({timeframe === 'daily' ? 'täglich' : 
                                                timeframe === 'weekly' ? 'wöchentlich' :
                                                timeframe === 'monthly' ? 'monatlich' : 'jährlich'})
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                €{costs.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                (€{costs.totalDaily.toFixed(2)}/Tag)
              </div>
            </div>
          </div>
        </div>

        {/* Cost Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Kostenanalyse
          </h5>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Jährliche Futterkosten: €{(costs.totalDaily * 365).toFixed(2)}</p>
            <p>• Kosten pro kg Körpergewicht/Tag: €{(costs.totalDaily / feedRequirements.totalDryMatter).toFixed(3)}</p>
            <p>• Größter Kostenfaktor: {
              Object.entries(costs.daily).reduce((max, [key, value]) => 
                value > costs.daily[max] ? key : max, 'hay'
              ) === 'hay' ? 'Heu' : 
              Object.entries(costs.daily).reduce((max, [key, value]) => 
                value > costs.daily[max] ? key : max, 'hay'
              ) === 'concentrate' ? 'Kraftfutter' : 'Silage'
            }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCostCalculator;