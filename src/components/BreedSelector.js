import React from 'react';
import { Star, Award, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cattleBreedsByCountry, cattleTypes } from '../data/cattleBreeds';

const BreedSelector = ({ selectedCountry, selectedBreed, onBreedSelect }) => {
  const { t, language } = useLanguage();

  if (!selectedCountry) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Award className="w-16 h-16 mx-auto opacity-50" />
        </div>
        <p className="text-lg text-gray-500">{t('selectCountryFirst')}</p>
      </div>
    );
  }

  const country = cattleBreedsByCountry[selectedCountry];
  const breeds = country.breeds;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
        <Award className="w-6 h-6 mr-2 text-green-500" />
        {t('selectBreed')} - {country.name[language]} {country.flag}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breeds.map((breed) => {
          const breedType = cattleTypes[breed.type];
          const isSelected = selectedBreed?.id === breed.id;
          const isCustom = breed.type === 'custom';
          
          return (
            <div
              key={breed.id}
              onClick={() => onBreedSelect(breed)}
              className={`
                relative p-6 rounded-xl cursor-pointer transition-all duration-300 card-hover
                ${isSelected 
                  ? 'bg-gradient-to-br from-green-50 to-blue-50 shadow-xl ring-2 ring-green-400 transform scale-105' 
                  : 'bg-white/90 shadow-lg hover:shadow-xl'
                }
                ${isCustom ? 'border-2 border-dashed border-purple-300' : ''}
              `}
            >
              {/* Premium/Custom badges */}
              {isCustom && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  <Plus className="w-3 h-3 inline mr-1" />
                  {t('custom')}
                </div>
              )}
              
              {breed.milkProduction?.max > 10000 && !isCustom && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  <Star className="w-3 h-3 inline mr-1" />
                  {t('premium')}
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Breed emoji and name */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{breed.emoji}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-1">
                  {breed.name[language]}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {breed.characteristics[language]}
                </p>
              </div>

              {/* Breed type badge */}
              <div className="flex justify-center mb-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${breedType.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    breedType.color === 'red' ? 'bg-red-100 text-red-700' :
                    breedType.color === 'green' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }
                `}>
                  <span className="mr-1">{breedType.icon}</span>
                  {breedType.name[language]}
                </span>
              </div>

              {/* Quick stats */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('weight')}:</span>
                  <span className="font-medium">
                    {breed.averageWeight.min}-{breed.averageWeight.max}kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('height')}:</span>
                  <span className="font-medium">
                    {breed.averageHeight.min}-{breed.averageHeight.max}m
                  </span>
                </div>
                {breed.milkProduction && (
                  <div className="flex justify-between">
                    <span>{t('milkProduction')}:</span>
                    <span className="font-medium text-blue-600">
                      {breed.milkProduction.min}-{breed.milkProduction.max}L/Jahr
                    </span>
                  </div>
                )}
              </div>

              {/* Performance indicator */}
              {breed.milkProduction && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">{t('milkPerformance')}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        breed.milkProduction.max > 10000 ? 'bg-green-500' :
                        breed.milkProduction.max > 7000 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min((breed.milkProduction.max / 13000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedBreed && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 text-green-700 rounded-lg">
            <span className="text-2xl mr-3">{selectedBreed.emoji}</span>
            <div className="text-left">
              <div className="font-bold">{selectedBreed.name[language]}</div>
              <div className="text-sm">{selectedBreed.characteristics[language]}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedSelector;