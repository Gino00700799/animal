import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Droplets } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAOResultsDisplay = ({ animalData, selectedCategory, requirements, optimizedDiet, validation }) => {
  const { language } = useLanguage();

  // Datos para gráficos
  const energyBreakdownData = [
    { name: 'Mantenimiento', value: requirements.energy.maintenanceME, color: '#3b82f6' },
    { name: 'Actividad', value: requirements.energy.activityME, color: '#10b981' },
    { name: 'Crecimiento', value: requirements.energy.growthME, color: '#f59e0b' }
  ];

  const nutritionAdequacyData = [
    { nutrient: 'Energía', required: requirements.energy.totalME, provided: optimizedDiet.totalNutrients.energy, adequacy: optimizedDiet.adequacy.energy },
    { nutrient: 'Proteína', required: requirements.nutrients.crudeProteinRequired, provided: optimizedDiet.totalNutrients.protein, adequacy: optimizedDiet.adequacy.protein },
    { nutrient: 'Calcio', required: requirements.nutrients.calciumRequired, provided: optimizedDiet.totalNutrients.calcium, adequacy: optimizedDiet.adequacy.calcium },
    { nutrient: 'Fósforo', required: requirements.nutrients.phosphorusRequired, provided: optimizedDiet.totalNutrients.phosphorus, adequacy: optimizedDiet.adequacy.phosphorus }
  ];

  const dietCompositionData = optimizedDiet.composition.map(item => ({
    name: item.ingredient.name.es,
    amount: item.amount,
    cost: item.amount * item.ingredient.costPerKg,
    energy: item.contribution.energy,
    protein: item.contribution.protein * 1000, // convertir a gramos
    category: item.ingredient.category
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header con resumen del animal */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{selectedCategory.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Dieta Optimizada - {selectedCategory.name.es}
              </h2>
              <p className="text-gray-600">
                {animalData.weight} kg • {animalData.age} meses • {animalData.dailyGain} kg/día ganancia
                {animalData.breed && ` • ${animalData.breed}`}
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar Reporte</span>
          </button>
        </div>

        {/* Estado de validación */}
        <div className={`p-4 rounded-lg border-2 ${
          validation.isValid 
            ? 'border-green-300 bg-green-50' 
            : 'border-yellow-300 bg-yellow-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {validation.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <span className={`font-semibold ${
              validation.isValid ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {validation.isValid ? 'Dieta Balanceada' : 'Dieta con Observaciones'}
            </span>
          </div>
          
          {validation.errors.length > 0 && (
            <div className="mb-2">
              <p className="text-red-800 font-medium">Errores:</p>
              <ul className="text-red-700 text-sm list-disc list-inside">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.warnings.length > 0 && (
            <div>
              <p className="text-yellow-800 font-medium">Advertencias:</p>
              <ul className="text-yellow-700 text-sm list-disc list-inside">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Métricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{requirements.energy.totalME}</div>
          <div className="text-sm text-gray-600">MJ ME/día requeridos</div>
          <div className="text-xs text-green-600 mt-1">
            {optimizedDiet.adequacy.energy}% cubierto
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <div className="text-2xl mb-2">💪</div>
          <div className="text-2xl font-bold text-gray-800">{requirements.nutrients.crudeProteinRequired}</div>
          <div className="text-sm text-gray-600">kg proteína/día</div>
          <div className="text-xs text-green-600 mt-1">
            {optimizedDiet.adequacy.protein}% cubierto
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <Droplets className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{requirements.waterRequirement}</div>
          <div className="text-sm text-gray-600">litros agua/día</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">€{optimizedDiet.totalCost}</div>
          <div className="text-sm text-gray-600">costo diario</div>
          <div className="text-xs text-gray-500 mt-1">
            €{(optimizedDiet.totalCost * 365).toFixed(0)}/año
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose de energía */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Desglose de Requerimientos Energéticos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={energyBreakdownData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value} MJ`}
              >
                {energyBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} MJ`, 'Energía']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Adecuación nutricional */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Adecuación Nutricional (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nutritionAdequacyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nutrient" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Adecuación']} />
              <Bar dataKey="adequacy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Composición Detallada de la Dieta */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          🌾 Composición Detallada de la Dieta
        </h3>
        
        <div className="space-y-4">
          {optimizedDiet.composition.map((item, index) => {
            const categoryEmojis = {
              'forrajes_secos': '🌾',
              'pastos_verdes': '🌱', 
              'ensilados': '🌽',
              'alimentos_energeticos': '⚡',
              'suplementos_proteicos': '💪',
              'minerales': '🧂',
              'vitaminas': '💊',
              'aditivos': '🧪'
            };
            
            const categoryNames = {
              'forrajes_secos': 'Forrajes Secos',
              'pastos_verdes': 'Pastos Verdes',
              'ensilados': 'Ensilados', 
              'alimentos_energeticos': 'Alimentos Energéticos',
              'suplementos_proteicos': 'Suplementos Proteicos',
              'minerales': 'Minerales',
              'vitaminas': 'Vitaminas',
              'aditivos': 'Aditivos'
            };

            const dmAmount = item.amount * (item.ingredient.composition.dryMatter / 100);
            const percentage = (dmAmount / optimizedDiet.totalNutrients.dryMatter * 100);

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Header del ingrediente */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{categoryEmojis[item.ingredient.category] || '📦'}</span>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        {item.ingredient.name.es}
                      </div>
                      <div className="text-sm text-gray-600">
                        {categoryNames[item.ingredient.category] || item.ingredient.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600 text-xl">
                      {item.amount} kg
                    </div>
                    <div className="text-sm text-gray-500">
                      {percentage.toFixed(1)}% de la dieta
                    </div>
                  </div>
                </div>

                {/* Información nutricional detallada */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-medium text-blue-800">Materia Seca</div>
                    <div className="text-blue-600">{dmAmount.toFixed(2)} kg</div>
                    <div className="text-xs text-blue-500">{item.ingredient.composition.dryMatter}% MS</div>
                  </div>
                  
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-medium text-green-800">Energía</div>
                    <div className="text-green-600">{item.contribution.energy.toFixed(1)} MJ</div>
                    <div className="text-xs text-green-500">{item.ingredient.composition.metabolizableEnergy} MJ/kg MS</div>
                  </div>
                  
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="font-medium text-purple-800">Proteína</div>
                    <div className="text-purple-600">{(item.contribution.protein * 1000).toFixed(0)} g</div>
                    <div className="text-xs text-purple-500">{item.ingredient.composition.crudeProtein}% PC</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="font-medium text-yellow-800">Costo</div>
                    <div className="text-yellow-600">€{(item.amount * item.ingredient.costPerKg).toFixed(2)}</div>
                    <div className="text-xs text-yellow-500">€{item.ingredient.costPerKg}/kg</div>
                  </div>
                </div>

                {/* Minerales principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="font-medium text-orange-800">Calcio</div>
                    <div className="text-orange-600">{(item.contribution.calcium * 1000).toFixed(1)} g</div>
                    <div className="text-xs text-orange-500">{item.ingredient.composition.calcium}% Ca</div>
                  </div>
                  
                  <div className="bg-red-50 p-2 rounded">
                    <div className="font-medium text-red-800">Fósforo</div>
                    <div className="text-red-600">{(item.contribution.phosphorus * 1000).toFixed(1)} g</div>
                    <div className="text-xs text-red-500">{item.ingredient.composition.phosphorus}% P</div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium text-gray-800">Fibra</div>
                    <div className="text-gray-600">{(dmAmount * (item.ingredient.composition.fiber || 0) / 100 * 1000).toFixed(0)} g</div>
                    <div className="text-xs text-gray-500">{item.ingredient.composition.fiber || 0}% FB</div>
                  </div>
                  
                  <div className="bg-indigo-50 p-2 rounded">
                    <div className="font-medium text-indigo-800">Disponibilidad</div>
                    <div className="text-indigo-600">
                      {item.ingredient.availability === 'year_round' ? '🟢 Todo el año' : 
                       item.ingredient.availability === 'seasonal' ? '🟡 Estacional' : '🔴 Limitada'}
                    </div>
                  </div>
                </div>

                {/* Barra de progreso visual */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Contribución a la dieta total</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen total */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3">📊 Resumen Total de la Dieta</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600 text-lg">{optimizedDiet.totalNutrients.dryMatter.toFixed(1)} kg</div>
              <div className="text-gray-600">Materia Seca Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600 text-lg">{optimizedDiet.totalNutrients.energy.toFixed(1)} MJ</div>
              <div className="text-gray-600">Energía Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600 text-lg">{(optimizedDiet.totalNutrients.protein * 1000).toFixed(0)} g</div>
              <div className="text-gray-600">Proteína Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600 text-lg">{optimizedDiet.totalNutrients.calcium.toFixed(1)} g</div>
              <div className="text-gray-600">Calcio Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600 text-lg">€{optimizedDiet.totalCost.toFixed(2)}</div>
              <div className="text-gray-600">Costo Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones prácticas */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones de Manejo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Alimentación</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Dividir la ración en 2-3 comidas diarias</li>
              <li>• Ofrecer forrajes antes que concentrados</li>
              <li>• Mantener agua fresca disponible constantemente</li>
              <li>• Ajustar cantidades según condición corporal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Monitoreo</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Pesar animales semanalmente</li>
              <li>• Evaluar condición corporal mensualmente</li>
              <li>• Ajustar dieta según ganancia real</li>
              <li>• Revisar calidad de ingredientes regularmente</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> Esta formulación se basa en estándares FAO y NASEM. 
            Consulte con un nutricionista animal para ajustes específicos según condiciones locales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAOResultsDisplay;