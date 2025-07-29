import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllCategories } from '../data/faoCategories';

const FAOCategorySelector = ({ selectedCategory, onCategorySelect }) => {
  const { t, language } = useLanguage();
  const categories = getAllCategories();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🐂</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Categorías FAO de Ganado Vacuno
          </h3>
          <p className="text-gray-600 text-sm">
            Selecciona la categoría según peso, edad y propósito productivo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedCategory?.id === category.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{category.emoji}</span>
              <h4 className="font-semibold text-gray-800">
                {category.name[language] || category.name.es}
              </h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {category.description[language] || category.description.es}
            </p>
            
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Peso:</span>
                <span>{category.weightRange.min}-{category.weightRange.max} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Edad:</span>
                <span>{category.ageRange.min}-{category.ageRange.max} meses</span>
              </div>
              <div className="flex justify-between">
                <span>Ganancia:</span>
                <span>{category.dailyGainRange.min}-{category.dailyGainRange.max} kg/día</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{selectedCategory.emoji}</span>
            <h5 className="font-semibold text-green-800">
              {selectedCategory.name[language] || selectedCategory.name.es}
            </h5>
          </div>
          <p className="text-sm text-green-700">
            {selectedCategory.description[language] || selectedCategory.description.es}
          </p>
          <div className="mt-2 text-xs text-green-600">
            <strong>Valores por defecto:</strong> {selectedCategory.defaultValues.weight} kg, 
            {selectedCategory.defaultValues.age} meses, 
            {selectedCategory.defaultValues.dailyGain} kg/día de ganancia
          </div>
        </div>
      )}
    </div>
  );
};

export default FAOCategorySelector;