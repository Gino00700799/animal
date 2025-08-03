import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const NutritionWarnings = ({ 
  animalData, 
  optimizedDiet, 
  requirements, 
  className = "" 
}) => {
  const warnings = [];
  
  // 1. Warnung bei Energiezufuhr > 120%
  if (optimizedDiet.adequacy.energy > 120) {
    warnings.push({
      type: 'energy_excess',
      level: 'warning',
      icon: AlertTriangle,
      title: 'Energiezufuhr über optimalem Bereich',
      message: `⚠️ Energiezufuhr über optimalem Bereich (${optimizedDiet.adequacy.energy.toFixed(1)}% > 120%) – überprüfe Kosten/Nutzen.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    });
  }

  // 2. Warnung bei zu geringer Trockensubstanzaufnahme (< 2.5% vom Körpergewicht)
  const minDryMatterIntake = animalData.weight * 0.025; // 2.5% vom Körpergewicht
  const actualDryMatterIntake = optimizedDiet.totalNutrients.dryMatter;
  
  if (actualDryMatterIntake < minDryMatterIntake) {
    warnings.push({
      type: 'dry_matter_low',
      level: 'error',
      icon: AlertCircle,
      title: 'Trockensubstanzaufnahme zu gering',
      message: `⚠️ Trockensubstanzaufnahme liegt unter der empfohlenen Mindestmenge (${actualDryMatterIntake.toFixed(1)} kg < ${minDryMatterIntake.toFixed(1)} kg) – mögliche Leistungseinbußen.`,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      details: `Empfohlen: mindestens ${minDryMatterIntake.toFixed(1)} kg TS/Tag (2.5% vom Körpergewicht von ${animalData.weight} kg)`
    });
  }

  // 3. Warnung bei sehr niedrigem Protein (< 85%)
  if (optimizedDiet.adequacy.protein < 85) {
    warnings.push({
      type: 'protein_low',
      level: 'error',
      icon: AlertCircle,
      title: 'Proteinversorgung unzureichend',
      message: `⚠️ Proteinversorgung deutlich unter Bedarf (${optimizedDiet.adequacy.protein.toFixed(1)}% < 85%) – Wachstum und Gesundheit gefährdet.`,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    });
  }

  // 4. Positive Bestätigung wenn alles im optimalen Bereich ist
  const energyOptimal = optimizedDiet.adequacy.energy >= 90 && optimizedDiet.adequacy.energy <= 120;
  const proteinOptimal = optimizedDiet.adequacy.protein >= 90 && optimizedDiet.adequacy.protein <= 110;
  const dryMatterOptimal = actualDryMatterIntake >= minDryMatterIntake;

  if (energyOptimal && proteinOptimal && dryMatterOptimal && warnings.length === 0) {
    warnings.push({
      type: 'optimal',
      level: 'success',
      icon: CheckCircle,
      title: 'Optimale Nährstoffversorgung',
      message: '✅ Alle Nährstoffe liegen im optimalen Bereich. Dieta gut ausbalanciert.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    });
  }

  if (warnings.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {warnings.map((warning, index) => {
        const Icon = warning.icon;
        
        return (
          <div
            key={`${warning.type}-${index}`}
            className={`
              ${warning.bgColor} ${warning.borderColor} ${warning.textColor}
              border-2 rounded-lg p-4 shadow-sm
              ${warning.level === 'error' ? 'border-l-4 border-l-red-500' : ''}
              ${warning.level === 'warning' ? 'border-l-4 border-l-yellow-500' : ''}
              ${warning.level === 'success' ? 'border-l-4 border-l-green-500' : ''}
            `}
          >
            <div className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 ${warning.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">
                  {warning.title}
                </div>
                <div className="text-sm leading-relaxed">
                  {warning.message}
                </div>
                {warning.details && (
                  <div className="text-xs mt-2 opacity-80">
                    {warning.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionWarnings;