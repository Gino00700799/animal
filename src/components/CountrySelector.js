import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cattleBreedsByCountry } from '../data/cattleBreeds';

const CountrySelector = ({ selectedCountry, onCountrySelect }) => {
  const { t, language } = useLanguage();

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
        <MapPin className="w-6 h-6 mr-2 text-blue-500" />
        {t('selectCountry')}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(cattleBreedsByCountry).map(([countryCode, country]) => (
          <button
            key={countryCode}
            onClick={() => onCountrySelect(countryCode)}
            className={`
              p-4 rounded-xl transition-all duration-300 card-hover text-center
              ${selectedCountry === countryCode
                ? 'bg-blue-500 text-white shadow-xl ring-2 ring-blue-300 transform scale-105'
                : 'bg-white/90 hover:bg-white shadow-lg hover:shadow-xl text-gray-700'
              }
            `}
          >
            <div className="text-3xl mb-2">{country.flag}</div>
            <div className="text-sm font-medium">
              {country.name[language]}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {country.breeds.length} {t('breeds')}
            </div>
          </button>
        ))}
      </div>
      
      {selectedCountry && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <span className="text-lg mr-2">
              {cattleBreedsByCountry[selectedCountry].flag}
            </span>
            <span className="font-medium">
              {cattleBreedsByCountry[selectedCountry].name[language]} {t('selected')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;