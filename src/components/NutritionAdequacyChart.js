import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const NutritionAdequacyChart = ({ nutritionAdequacyData, className = "" }) => {
  const { t, language } = useLanguage();
  
  // Funktion zur Bestimmung der Balkenfarbe basierend auf Adäquanz
  const getBarColor = (adequacy) => {
    if (adequacy < 85) return '#ef4444'; // Rot - kritisch niedrig
    if (adequacy >= 85 && adequacy < 90) return '#f97316'; // Orange - niedrig
    if (adequacy >= 90 && adequacy <= 110) return '#10b981'; // Grün - optimal
    if (adequacy > 110 && adequacy <= 120) return '#3b82f6'; // Blau - gut
    if (adequacy > 120) return '#f59e0b'; // Gelb - zu hoch
    return '#6b7280'; // Grau - Standard
  };

  // Erweiterte Daten mit Farben
  const chartData = nutritionAdequacyData.map(item => ({
    ...item,
    color: getBarColor(item.adequacy)
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let status = '';
      let statusColor = '';

      if (data.adequacy < 85) {
        status = t('criticalLow');
        statusColor = 'text-red-600';
      } else if (data.adequacy < 90) {
        status = t('low');
        statusColor = 'text-orange-600';
      } else if (data.adequacy <= 110) {
        status = t('optimal');
        statusColor = 'text-green-600';
      } else if (data.adequacy <= 120) {
        status = t('good');
        statusColor = 'text-blue-600';
      } else {
        status = t('tooHigh');
        statusColor = 'text-yellow-600';
      }

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            {t('requirement')}: {data.required.toFixed(2)} {data.nutrient === 'Energía' ? 'MJ' : 'kg'}
          </p>
          <p className="text-sm text-gray-600">
            {t('provided')}: {data.provided.toFixed(2)} {data.nutrient === 'Energía' ? 'MJ' : 'kg'}
          </p>
          <p className="text-sm font-medium">
            {t('adequacy')}: <span className={statusColor}>{data.adequacy.toFixed(1)}%</span>
          </p>
          <p className={`text-xs font-medium ${statusColor}`}>
            {t('status')}: {status}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Component für individuelle Farben
  const CustomBar = (props) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={props.payload?.color || fill} />;
  };

  return (
    <div className={className}>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('nutritionalAdequacy')} (%)
          </h3>
          <div className="text-xs text-gray-500">
            {t('targetRange')}: 90-110%
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="nutrient" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: t('adequacy') + ' (%)', angle: -90, position: 'insideLeft' }}
            />
            
            {/* Referenzlinien für optimale Bereiche */}
            <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} />
            <ReferenceLine y={90} stroke="#10b981" strokeDasharray="2 2" strokeWidth={2} />
            <ReferenceLine y={110} stroke="#10b981" strokeDasharray="2 2" strokeWidth={2} />
            <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth={1} />
            
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="adequacy" 
              radius={[4, 4, 0, 0]}
              shape={<CustomBar />}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Legende */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">&lt;85% Kritisch</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600">85-90% Niedrig</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">90-110% Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">110-120% Gut</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">&gt;120% Zu hoch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionAdequacyChart;