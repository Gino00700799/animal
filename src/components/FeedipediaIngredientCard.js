import React from 'react';
import { Globe, BookOpen, Users, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeedipediaIngredientCard = ({ ingredient, isSelected, onToggle, showDetails, canSelect = true, disabledReason = '' }) => {
  const { language } = useLanguage();

  const getProteinQualityColor = (protein) => {
    if (protein >= 40) return 'text-green-600 bg-green-50';
    if (protein >= 20) return 'text-blue-600 bg-blue-50';
    if (protein >= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getEnergyQualityColor = (energy) => {
    if (energy >= 12) return 'text-purple-600 bg-purple-50';
    if (energy >= 9) return 'text-blue-600 bg-blue-50';
    if (energy >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className={`
      border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer
      ${isSelected 
        ? 'border-green-500 bg-green-50 shadow-md' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }
    `} onClick={onToggle}>
      
      {/* Header mit wissenschaftlichem Namen */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-lg">
            {ingredient.name[language] || ingredient.name.es}
          </h4>
          <p className="text-sm text-gray-500 italic">
            {ingredient.scientificName}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {ingredient.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSelected && (
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Nährstoff-Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={`p-2 rounded-lg ${getEnergyQualityColor(ingredient.composition.metabolizableEnergy)}`}>
          <div className="text-xs font-medium">Energie ME</div>
          <div className="text-sm font-bold">
            {ingredient.composition.metabolizableEnergy} MJ/kg
          </div>
        </div>
        
        <div className={`p-2 rounded-lg ${getProteinQualityColor(ingredient.composition.crudeProtein)}`}>
          <div className="text-xs font-medium">Rohprotein</div>
          <div className="text-sm font-bold">
            {ingredient.composition.crudeProtein}%
          </div>
        </div>
      </div>

      {/* Zusätzliche Nährstoffinfo */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
        <div>
          <span className="font-medium">TM:</span> {ingredient.composition.dryMatter}%
        </div>
        <div>
          <span className="font-medium">NDF:</span> {ingredient.composition.ndf || 'N/A'}%
        </div>
        <div>
          <span className="font-medium">Fett:</span> {ingredient.composition.crudeFat}%
        </div>
      </div>

      {/* Bypass-Protein Info (wenn verfügbar) */}
      {ingredient.composition.bypassProtein && (
        <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
          <div className="text-xs text-yellow-800">
            <span className="font-medium">Bypass-Protein:</span> {ingredient.composition.bypassProtein}% | 
            <span className="font-medium"> Pansen-Protein:</span> {ingredient.composition.rumenProtein}%
          </div>
        </div>
      )}

      {/* Regionen und Tierarten */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <div className="text-xs text-gray-600">
            {ingredient.regions.slice(0, 3).join(', ')}
            {ingredient.regions.length > 3 && ` +${ingredient.regions.length - 3}`}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3 text-gray-400" />
          <div className="text-xs text-gray-600">
            {ingredient.animalTypes.slice(0, 2).join(', ')}
            {ingredient.animalTypes.length > 2 && ` +${ingredient.animalTypes.length - 2}`}
          </div>
        </div>
      </div>

      {/* Erweiterte Details (wenn showDetails aktiv) */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium text-gray-700">Stärke:</span>
              <div>{ingredient.composition.starch || 'N/A'}%</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">ADF:</span>
              <div>{ingredient.composition.adf || 'N/A'}%</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Asche:</span>
              <div>{ingredient.composition.ash}%</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">NE:</span>
              <div>{ingredient.composition.netEnergy} MJ/kg</div>
            </div>
          </div>
          
          {/* Mineralien (wenn verfügbar) */}
          {(ingredient.composition.calcium || ingredient.composition.phosphorus) && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium text-gray-700 mb-1">Mineralien:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {ingredient.composition.calcium && (
                  <div>Ca: {ingredient.composition.calcium} g/kg</div>
                )}
                {ingredient.composition.phosphorus && (
                  <div>P: {ingredient.composition.phosphorus} g/kg</div>
                )}
              </div>
            </div>
          )}
          
          {/* Feedipedia-Quelle */}
          <div className="mt-3 flex items-center space-x-2">
            <BookOpen className="w-3 h-3 text-blue-400" />
            <a 
              href={ingredient.source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              Feedipedia-Quelle
            </a>
          </div>
        </div>
      )}

      {/* Kosten */}
      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          €{ingredient.costPerKg}/kg
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          ingredient.availability === 'year_round' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {ingredient.availability === 'year_round' ? 'Ganzjährig' : 'Saisonal'}
        </span>
      </div>
    </div>
  );
};

export default FeedipediaIngredientCard;