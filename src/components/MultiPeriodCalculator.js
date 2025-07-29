import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Calculator, BarChart3, Download } from 'lucide-react';
import { optimizeDiet } from '../utils/dietOptimization';
import { calculateCompleteNutrientRequirements } from '../utils/faoCalculations';
import { getAllIngredients } from '../data/faoIngredients';

const MultiPeriodCalculator = ({ animalData, selectedCategory, selectedIngredients }) => {
  const [periods, setPeriods] = useState(3); // Número de períodos (meses)
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMultiPeriod = async () => {
    if (!animalData || !selectedIngredients.length) return;

    setIsCalculating(true);
    
    try {
      const calculations = [];
      let currentWeight = animalData.weight;
      const monthlyGain = animalData.dailyGain * 30; // Ganancia por mes
      
      for (let month = 1; month <= periods; month++) {
        // Calcular peso promedio del mes
        const startWeight = currentWeight;
        const endWeight = currentWeight + monthlyGain;
        const avgWeight = (startWeight + endWeight) / 2;
        
        // Datos del animal para este período
        const periodAnimalData = {
          ...animalData,
          weight: avgWeight,
          startWeight,
          endWeight
        };

        // Calcular requerimientos nutricionales
        const requirements = calculateCompleteNutrientRequirements({
          ...periodAnimalData,
          category: selectedCategory.id
        });

        // Optimizar dieta para este período
        const dietRequirements = {
          totalME: requirements.energy.totalME,
          crudeProteinRequired: requirements.nutrients.crudeProteinRequired,
          calciumRequired: requirements.nutrients.calciumRequired,
          phosphorusRequired: requirements.nutrients.phosphorusRequired,
          dryMatterIntake: requirements.nutrients.dryMatterIntake
        };

        const optimizedDiet = optimizeDiet(dietRequirements, selectedIngredients);

        // Calcular costos mensuales
        const dailyCost = optimizedDiet.totalCost;
        const monthlyCost = dailyCost * 30;
        const weightGained = monthlyGain;
        const costPerKgGain = dailyCost / animalData.dailyGain;

        calculations.push({
          month,
          startWeight,
          endWeight,
          avgWeight,
          weightGained,
          requirements,
          optimizedDiet,
          dailyCost,
          monthlyCost,
          costPerKgGain,
          cumulativeCost: calculations.reduce((sum, calc) => sum + calc.monthlyCost, 0) + monthlyCost,
          cumulativeGain: month * monthlyGain
        });

        currentWeight = endWeight;
      }

      // Calcular totales y análisis
      const totalCost = calculations.reduce((sum, calc) => sum + calc.monthlyCost, 0);
      const totalGain = calculations.reduce((sum, calc) => sum + calc.weightGained, 0);
      const avgCostPerKg = totalCost / totalGain;
      const finalWeight = animalData.weight + totalGain;

      // Análisis económico
      const meatPrice = 4.50; // €/kg peso vivo
      const totalValue = totalGain * meatPrice;
      const grossMargin = totalValue - totalCost;
      const roi = (grossMargin / totalCost) * 100;

      setResults({
        periods: calculations,
        summary: {
          initialWeight: animalData.weight,
          finalWeight,
          totalGain,
          totalCost,
          avgCostPerKg,
          totalValue,
          grossMargin,
          roi,
          durationMonths: periods
        }
      });

    } catch (error) {
      console.error('Error calculating multi-period:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (animalData && selectedIngredients.length > 0) {
      calculateMultiPeriod();
    }
  }, [animalData, selectedIngredients, periods]);

  if (!results) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Calculadora Multi-Período
          </h3>
          <p className="text-gray-600">
            Selecciona una categoría de animal e ingredientes para calcular el engorde por períodos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Análisis de Engorde Multi-Período
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Períodos:</label>
              <select
                value={periods}
                onChange={(e) => setPeriods(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={1}>1 mes</option>
                <option value={2}>2 meses</option>
                <option value={3}>3 meses</option>
                <option value={4}>4 meses</option>
                <option value={6}>6 meses</option>
              </select>
            </div>
            {isCalculating && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>

        {/* Resumen ejecutivo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-blue-600 mb-2" />
            <div className="font-bold text-blue-800 text-lg">
              {results.summary.totalGain.toFixed(0)} kg
            </div>
            <div className="text-sm text-blue-600">Ganancia Total</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <div className="font-bold text-green-800 text-lg">
              €{results.summary.totalCost.toFixed(0)}
            </div>
            <div className="text-sm text-green-600">Costo Total</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Calculator className="w-6 h-6 mx-auto text-purple-600 mb-2" />
            <div className="font-bold text-purple-800 text-lg">
              €{results.summary.avgCostPerKg.toFixed(2)}
            </div>
            <div className="text-sm text-purple-600">€/kg Ganancia</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <BarChart3 className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
            <div className="font-bold text-yellow-800 text-lg">
              {results.summary.roi.toFixed(1)}%
            </div>
            <div className="text-sm text-yellow-600">ROI</div>
          </div>
        </div>
      </div>

      {/* Tabla detallada por período */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Desglose por Período
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Mes</th>
                <th className="text-right py-2">Peso Inicial</th>
                <th className="text-right py-2">Peso Final</th>
                <th className="text-right py-2">Ganancia</th>
                <th className="text-right py-2">Costo/Día</th>
                <th className="text-right py-2">Costo/Mes</th>
                <th className="text-right py-2">€/kg Ganancia</th>
                <th className="text-right py-2">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {results.periods.map((period) => (
                <tr key={period.month} className="border-b border-gray-100">
                  <td className="py-2 font-medium">Mes {period.month}</td>
                  <td className="text-right py-2">{period.startWeight.toFixed(0)} kg</td>
                  <td className="text-right py-2">{period.endWeight.toFixed(0)} kg</td>
                  <td className="text-right py-2 text-green-600 font-medium">
                    +{period.weightGained.toFixed(0)} kg
                  </td>
                  <td className="text-right py-2">€{period.dailyCost.toFixed(2)}</td>
                  <td className="text-right py-2">€{period.monthlyCost.toFixed(0)}</td>
                  <td className="text-right py-2">€{period.costPerKgGain.toFixed(2)}</td>
                  <td className="text-right py-2 font-medium">
                    €{period.cumulativeCost.toFixed(0)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 font-semibold bg-gray-50">
                <td className="py-2">TOTAL</td>
                <td className="text-right py-2">{results.summary.initialWeight} kg</td>
                <td className="text-right py-2">{results.summary.finalWeight.toFixed(0)} kg</td>
                <td className="text-right py-2 text-green-600">
                  +{results.summary.totalGain.toFixed(0)} kg
                </td>
                <td className="text-right py-2">-</td>
                <td className="text-right py-2">€{results.summary.totalCost.toFixed(0)}</td>
                <td className="text-right py-2">€{results.summary.avgCostPerKg.toFixed(2)}</td>
                <td className="text-right py-2">€{results.summary.totalCost.toFixed(0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Análisis económico */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Análisis Económico
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Inversión y Retorno</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Costo total alimentación:</span>
                <span className="font-medium">€{results.summary.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor ganancia (€4.50/kg):</span>
                <span className="font-medium text-green-600">€{results.summary.totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Margen bruto:</span>
                <span className="font-bold text-green-600">€{results.summary.grossMargin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ROI:</span>
                <span className="font-bold text-blue-600">{results.summary.roi.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Eficiencia Productiva</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ganancia diaria promedio:</span>
                <span className="font-medium">{animalData.dailyGain} kg/día</span>
              </div>
              <div className="flex justify-between">
                <span>Conversión alimenticia:</span>
                <span className="font-medium">
                  {(results.summary.totalCost / results.summary.totalGain / 4.50 * animalData.dailyGain).toFixed(2)}:1
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duración total:</span>
                <span className="font-medium">{results.summary.durationMonths} meses</span>
              </div>
              <div className="flex justify-between">
                <span>Peso final:</span>
                <span className="font-medium">{results.summary.finalWeight.toFixed(0)} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Composición de raciones por período */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Evolución de las Raciones
        </h4>
        
        <div className="space-y-4">
          {results.periods.map((period) => (
            <div key={period.month} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2">
                Mes {period.month} ({period.startWeight.toFixed(0)}-{period.endWeight.toFixed(0)} kg)
              </h5>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {period.optimizedDiet.composition.slice(0, 4).map((item, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{item.ingredient.name.es}</div>
                    <div className="text-gray-600">{item.amount} kg/día</div>
                    <div className="text-xs text-gray-500">
                      €{(item.amount * item.ingredient.costPerKg).toFixed(2)}/día
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-gray-600">
                Total: {period.optimizedDiet.totalNutrients.dryMatter.toFixed(1)} kg MS/día • 
                €{period.dailyCost.toFixed(2)}/día • 
                {period.optimizedDiet.adequacy.energy}% energía • 
                {period.optimizedDiet.adequacy.protein}% proteína
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiPeriodCalculator;