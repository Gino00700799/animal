import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Info, ChevronDown, ChevronUp, Microscope, Zap } from 'lucide-react';
import { detailedNutritionData, evaluateProteinQuality, estimateDigestibility } from '../data/detailedNutritionData';

const DetailedNutritionView = ({ ingredient }) => {
  const [activeTab, setActiveTab] = useState('main');
  const [showDetails, setShowDetails] = useState(false);
  
  const detailedData = detailedNutritionData[ingredient.id];
  
  if (!detailedData) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Microscope className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Keine detaillierten Analysedaten verfügbar</p>
      </div>
    );
  }

  // Daten für Aminosäure-Radar-Chart
  const aminoAcidData = detailedData.aminoAcids ? Object.entries(detailedData.aminoAcids).map(([name, data]) => ({
    amino: name.charAt(0).toUpperCase() + name.slice(1),
    value: data.avg,
    fullMark: 10
  })) : [];

  // Mineralstoff-Daten für Balkendiagramm
  const mineralData = detailedData.minerals ? Object.entries(detailedData.minerals).map(([name, data]) => ({
    mineral: name.charAt(0).toUpperCase() + name.slice(1),
    value: data.avg,
    unit: data.unit,
    min: data.min,
    max: data.max
  })) : [];

  const proteinQuality = detailedData.aminoAcids ? evaluateProteinQuality(detailedData.aminoAcids) : null;
  const digestibility = detailedData.ruminantNutritiveValues || estimateDigestibility(detailedData.mainAnalysis);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Microscope className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            Detaillierte Nährstoffanalyse
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <span className="text-sm">Details</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'main', label: 'Hauptanalyse', icon: '📊' },
          { id: 'minerals', label: 'Mineralien', icon: '⚗️' },
          { id: 'amino', label: 'Aminosäuren', icon: '🧬' },
          { id: 'digestibility', label: 'Verdaulichkeit', icon: '🔄' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Hauptanalyse */}
        {activeTab === 'main' && detailedData.mainAnalysis && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Hauptnährstoffe</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(detailedData.mainAnalysis).map(([key, data]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {data.avg} {data.unit}
                  </div>
                  {showDetails && data.sd && (
                    <div className="text-xs text-gray-500 mt-1">
                      SD: ±{data.sd} | Range: {data.min}-{data.max}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mineralien */}
        {activeTab === 'minerals' && mineralData.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Mineralstoffgehalt</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mineralData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mineral" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unit}`,
                    'Gehalt'
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Aminosäuren */}
        {activeTab === 'amino' && aminoAcidData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Aminosäureprofil</h4>
              {proteinQuality && (
                <div className="text-sm bg-blue-50 px-3 py-1 rounded-full">
                  Proteinqualität: {proteinQuality.overallScore}/100
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={aminoAcidData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="amino" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Aminosäuren"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
              
              {proteinQuality && (
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Bewertung essentieller Aminosäuren</h5>
                  {Object.entries(proteinQuality.scores).map(([amino, score]) => (
                    <div key={amino} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{amino}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              score >= 80 ? 'bg-green-500' : 
                              score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </div>
                  ))}
                  {proteinQuality.limitingAminoAcid && (
                    <div className="text-sm text-orange-600 mt-2">
                      Limitierende Aminosäure: {proteinQuality.limitingAminoAcid}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verdaulichkeit */}
        {activeTab === 'digestibility' && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Verdaulichkeit für Wiederkäuer</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detailedData.ruminantNutritiveValues && Object.entries(detailedData.ruminantNutritiveValues).map(([key, data]) => (
                <div key={key} className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {typeof data === 'object' ? data.avg : data} {typeof data === 'object' ? data.unit : '%'}
                  </div>
                  {showDetails && typeof data === 'object' && data.sd && (
                    <div className="text-xs text-gray-500 mt-1">
                      ±{data.sd} ({data.min}-{data.max})
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {detailedData.ruminantNutritiveValues?.meRuminants && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Energiewerte für Wiederkäuer</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">ME (Metabolisierbare Energie):</span>
                    <span className="font-medium ml-2">{detailedData.ruminantNutritiveValues.meRuminants.avg} MJ/kg TM</span>
                  </div>
                  <div>
                    <span className="text-blue-700">DE (Verdauliche Energie):</span>
                    <span className="font-medium ml-2">{detailedData.ruminantNutritiveValues.deRuminants.avg} MJ/kg TM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedNutritionView;