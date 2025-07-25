import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Wheat, Droplets, Zap, TrendingUp, Info, Calculator } from 'lucide-react';
import { getCattleNutritionForWeight, calculateCattleFeedRequirements, nutritionExplanations, cattleNutritionData } from '../data/cattleNutrition';

const CattleNutritionDisplay = ({ animal, measurements }) => {
  if (!animal || !measurements || !['bull', 'cow', 'calf'].includes(animal.id)) {
    return null;
  }

  const nutritionData = getCattleNutritionForWeight(measurements.weight);
  const feedRequirements = calculateCattleFeedRequirements(measurements.weight, nutritionData);

  // Data for charts
  const nutritionChartData = [
    { name: 'Trockenmasse', value: nutritionData.tmKg, color: '#8b5cf6', unit: 'kg' },
    { name: 'TDN (Energie)', value: nutritionData.tdnKg, color: '#06b6d4', unit: 'kg' },
    { name: 'Protein (DCP)', value: nutritionData.dcpKg, color: '#10b981', unit: 'kg' }
  ];

  const feedTypeData = [
    { name: 'Heu', value: feedRequirements.hayKg, color: '#f59e0b' },
    { name: 'Kraftfutter', value: feedRequirements.concentrateKg, color: '#ef4444' },
    { name: 'Silage', value: feedRequirements.silageKg, color: '#10b981' }
  ];

  const phaseComparisonData = cattleNutritionData.map(data => ({
    weight: data.gewichtKg,
    tm: data.tmKg,
    tdn: data.tdnKg,
    dcp: data.dcpKg * 10, // Scale up for better visualization
    phase: data.phase.split(' ')[0] // First word only for chart
  }));

  return (
    <div className="space-y-6 mt-8">
      {/* Professional Cattle Nutrition Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🐂</div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-800">
                Professionelle Rinder-Ernährung
              </h3>
              <p className="text-yellow-700">
                Wissenschaftlich basierte Fütterungsempfehlungen für {animal.name}
              </p>
            </div>
          </div>
          <div className="bg-yellow-200 px-4 py-2 rounded-lg">
            <div className="text-sm text-yellow-800 font-medium">Gewicht: {measurements.weight}kg</div>
            <div className="text-xs text-yellow-700">{nutritionData.phase}</div>
          </div>
        </div>

        {/* Current Phase Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Entwicklungsphase</div>
            <div className="font-bold text-gray-800">{nutritionData.phase}</div>
            <div className="text-xs text-gray-500">{nutritionData.ageMonths}</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Beschreibung</div>
            <div className="font-medium text-gray-800">{nutritionData.description}</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Tägliche Kosten</div>
            <div className="font-bold text-green-600">{feedRequirements.dailyCostEuro}€</div>
            <div className="text-xs text-gray-500">Geschätzte Futterkosten</div>
          </div>
        </div>
      </div>

      {/* Key Nutrition Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center border-l-4 border-purple-500">
          <Wheat className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{nutritionData.tmKg}</div>
          <div className="text-sm text-gray-600">kg Trockenmasse/Tag</div>
          <div className="text-xs text-purple-600 mt-1">Gesamtfutterbedarf</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center border-l-4 border-cyan-500">
          <Zap className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{nutritionData.tdnKg}</div>
          <div className="text-sm text-gray-600">kg TDN/Tag</div>
          <div className="text-xs text-cyan-600 mt-1">Energiebedarf</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center border-l-4 border-green-500">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{nutritionData.dcpKg}</div>
          <div className="text-sm text-gray-600">kg DCP/Tag</div>
          <div className="text-xs text-green-600 mt-1">Proteinbedarf</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center border-l-4 border-blue-500">
          <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{feedRequirements.waterLiters}</div>
          <div className="text-sm text-gray-600">Liter Wasser/Tag</div>
          <div className="text-xs text-blue-600 mt-1">Wasserbedarf</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-purple-500" />
            Nährstoff-Aufschlüsselung
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nutritionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `${value} ${nutritionChartData.find(d => d.name === name)?.unit || 'kg'}`, 
                name
              ]} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feed Types Distribution */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Wheat className="w-5 h-5 mr-2 text-yellow-500" />
            Futter-Zusammensetzung
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={feedTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}kg`}
              >
                {feedTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} kg`, 'Menge']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Phase Comparison */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          Wachstumsphasen-Vergleich
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={phaseComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weight" label={{ value: 'Gewicht (kg)', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'dcp') return [(value / 10).toFixed(2) + ' kg', 'DCP'];
                return [value + ' kg', name.toUpperCase()];
              }}
              labelFormatter={(weight) => {
                const phase = phaseComparisonData.find(d => d.weight === weight);
                return `${weight}kg - ${phase?.phase || ''}`;
              }}
            />
            <Line type="monotone" dataKey="tm" stroke="#8b5cf6" strokeWidth={3} name="TM" />
            <Line type="monotone" dataKey="tdn" stroke="#06b6d4" strokeWidth={3} name="TDN" />
            <Line type="monotone" dataKey="dcp" stroke="#10b981" strokeWidth={3} name="DCP" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-purple-500 mr-2"></div>
              <span>Trockenmasse (TM)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-cyan-500 mr-2"></div>
              <span>Energie (TDN)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-green-500 mr-2"></div>
              <span>Protein (DCP)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feed Requirements */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-500" />
          Detaillierte Fütterungsempfehlungen
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feed Types */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Futtermengen pro Tag:</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm">🌾 Heu (Grundfutter)</span>
                <span className="font-medium">{feedRequirements.hayKg} kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm">🌽 Kraftfutter</span>
                <span className="font-medium">{feedRequirements.concentrateKg} kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm">🥬 Silage (optional)</span>
                <span className="font-medium">{feedRequirements.silageKg} kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm">💧 Wasser</span>
                <span className="font-medium">{feedRequirements.waterLiters} L</span>
              </div>
            </div>
          </div>

          {/* Nutrition Explanations */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Nährstoff-Erklärungen:</h5>
            <div className="space-y-3">
              {Object.entries(nutritionExplanations).map(([key, info]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm text-gray-800">{info.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{info.description}</div>
                  <div className="text-xs text-blue-600 mt-1">{info.importance}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Metrics */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Zusätzliche Kennzahlen:</h5>
            <div className="space-y-2">
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-sm font-medium">Energie-Bedarf</div>
                <div className="text-lg font-bold text-purple-600">{feedRequirements.energyMJ} MJ ME</div>
                <div className="text-xs text-gray-500">Metabolisierbare Energie</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-sm font-medium">Protein-Bedarf</div>
                <div className="text-lg font-bold text-green-600">{feedRequirements.proteinKg} kg</div>
                <div className="text-xs text-gray-500">Verdauliches Rohprotein</div>
              </div>
              <div className="p-2 bg-yellow-50 rounded">
                <div className="text-sm font-medium">Tägliche Kosten</div>
                <div className="text-lg font-bold text-yellow-600">{feedRequirements.dailyCostEuro}€</div>
                <div className="text-xs text-gray-500">Geschätzte Futterkosten</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Notes */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">💡 Professionelle Hinweise:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Diese Werte basieren auf wissenschaftlichen Fütterungsstandards für Rinder</li>
          <li>• TM = Trockenmasse, TDN = Total Digestible Nutrients, DCP = Digestible Crude Protein</li>
          <li>• Anpassungen je nach Rasse, Aktivität und Umweltbedingungen erforderlich</li>
          <li>• Regelmäßige Gewichtskontrolle und Körperkondition bewerten</li>
          <li>• Bei Abweichungen Tierarzt oder Fütterungsberater konsultieren</li>
        </ul>
      </div>
    </div>
  );
};

export default CattleNutritionDisplay;