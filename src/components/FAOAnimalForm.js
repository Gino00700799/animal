import React, { useState, useEffect } from 'react';
import { Scale, Calendar, TrendingUp, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { validateActivityFactor } from '../utils/nutritionConstraints';

const FAOAnimalForm = ({ selectedCategory, onAnimalDataChange }) => {
  const { t, language } = useLanguage();
  const [animalData, setAnimalData] = useState({
    weight: '',
    age: '',
    dailyGain: '',
    activityFactor: 0.1, // factor de actividad para confinamiento
    breed: '',
    errors: {}
  });

  useEffect(() => {
    if (selectedCategory) {
      setAnimalData(prev => ({
        ...prev,
        weight: selectedCategory.defaultValues.weight.toString(),
        age: selectedCategory.defaultValues.age.toString(),
        dailyGain: selectedCategory.defaultValues.dailyGain.toString(),
        errors: {}
      }));
    }
  }, [selectedCategory]);

  const validateField = (field, value) => {
    const errors = { ...animalData.errors };
    
    switch (field) {
      case 'weight':
        if (!value || parseFloat(value) <= 0) {
          errors.weight = 'El peso debe ser mayor a 0 kg';
        } else if (selectedCategory) {
          const weight = parseFloat(value);
          if (weight < selectedCategory.weightRange.min || weight > selectedCategory.weightRange.max) {
            errors.weight = `Peso fuera del rango para ${selectedCategory.name.es}: ${selectedCategory.weightRange.min}-${selectedCategory.weightRange.max} kg`;
          } else {
            delete errors.weight;
          }
        }
        break;
        
      case 'age':
        if (!value || parseFloat(value) <= 0) {
          errors.age = 'La edad debe ser mayor a 0 meses';
        } else if (selectedCategory) {
          const age = parseFloat(value);
          if (age < selectedCategory.ageRange.min || age > selectedCategory.ageRange.max) {
            errors.age = `Edad fuera del rango para ${selectedCategory.name.es}: ${selectedCategory.ageRange.min}-${selectedCategory.ageRange.max} meses`;
          } else {
            delete errors.age;
          }
        }
        break;
        
      case 'dailyGain':
        if (value === '' || parseFloat(value) < 0) {
          errors.dailyGain = 'La ganancia diaria no puede ser negativa';
        } else if (selectedCategory) {
          const gain = parseFloat(value);
          if (gain < selectedCategory.dailyGainRange.min || gain > selectedCategory.dailyGainRange.max) {
            errors.dailyGain = `Ganancia fuera del rango para ${selectedCategory.name.es}: ${selectedCategory.dailyGainRange.min}-${selectedCategory.dailyGainRange.max} kg/día`;
          } else {
            delete errors.dailyGain;
          }
        }
        break;
        
      case 'activityFactor':
        const validationResult = validateActivityFactor(value);
        if (!validationResult.isValid) {
          errors.activityFactor = validationResult.error;
        } else {
          delete errors.activityFactor;
          // Migration: Update value if it was corrected
          if (validationResult.migrated) {
            value = validationResult.correctedValue;
          }
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    const errors = validateField(field, value);
    const newData = {
      ...animalData,
      [field]: value,
      errors
    };
    
    setAnimalData(newData);
    
    // Si no hay errores, enviar datos al componente padre
    if (Object.keys(errors).length === 0 && newData.weight && newData.age && newData.dailyGain !== '') {
      onAnimalDataChange({
        weight: parseFloat(newData.weight),
        age: parseFloat(newData.age),
        dailyGain: parseFloat(newData.dailyGain),
        activityFactor: parseFloat(newData.activityFactor),
        breed: newData.breed,
        category: selectedCategory?.id
      });
    }
  };

  if (!selectedCategory) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🐂</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {t('selectCategory')}
        </h3>
        <p className="text-gray-500">
          {t('selectCategoryFirst')}
        </p>
      </div>
    );
  }

  const isFormValid = animalData.weight && animalData.age && animalData.dailyGain !== '' && 
                     Object.keys(animalData.errors).length === 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{selectedCategory.emoji}</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {t('animalData')} - {selectedCategory.name[language] || selectedCategory.name.es}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('enterAnimalData')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Scale className="w-4 h-4 inline mr-1" />
            {t('bodyWeight')}
          </label>
          <input
            type="number"
            value={animalData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              animalData.errors.weight ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${selectedCategory.weightRange.min}-${selectedCategory.weightRange.max} kg`}
            min={selectedCategory.weightRange.min}
            max={selectedCategory.weightRange.max}
            step="0.1"
          />
          {animalData.errors.weight && (
            <p className="text-red-500 text-xs mt-1">{animalData.errors.weight}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {t('recommendedRange')}: {selectedCategory.weightRange.min}-{selectedCategory.weightRange.max} kg
          </p>
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            {t('age')}
          </label>
          <input
            type="number"
            value={animalData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              animalData.errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${selectedCategory.ageRange.min}-${selectedCategory.ageRange.max} meses`}
            min={selectedCategory.ageRange.min}
            max={selectedCategory.ageRange.max}
            step="0.5"
          />
          {animalData.errors.age && (
            <p className="text-red-500 text-xs mt-1">{animalData.errors.age}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {t('typicalRange')}: {selectedCategory.ageRange.min}-{selectedCategory.ageRange.max} meses
          </p>
        </div>

        {/* Ganancia Diaria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {t('dailyGain')}
          </label>
          <input
            type="number"
            value={animalData.dailyGain}
            onChange={(e) => handleInputChange('dailyGain', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              animalData.errors.dailyGain ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${selectedCategory.dailyGainRange.min}-${selectedCategory.dailyGainRange.max} kg/día`}
            min={selectedCategory.dailyGainRange.min}
            max={selectedCategory.dailyGainRange.max}
            step="0.1"
          />
          {animalData.errors.dailyGain && (
            <p className="text-red-500 text-xs mt-1">{animalData.errors.dailyGain}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Rango esperado: {selectedCategory.dailyGainRange.min}-{selectedCategory.dailyGainRange.max} kg/día
          </p>
        </div>

        {/* Factor de Actividad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏠 {t('activityFactor')}
          </label>
          <select
            value={animalData.activityFactor}
            onChange={(e) => handleInputChange('activityFactor', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              animalData.errors.activityFactor ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value={0.1}>0.1 - {language === 'de' ? 'Intensiv (Stallhaltung)' : language === 'en' ? 'Intensive (Confinement)' : 'Intensivo (Confinamiento)'}</option>
            <option value={0.2}>0.2 - {language === 'de' ? 'Semi-intensiv' : language === 'en' ? 'Semi-intensive' : 'Semi-intensivo'}</option>
            <option value={0.3}>0.3 - {language === 'de' ? 'Extensiv (Weide)' : language === 'en' ? 'Extensive (Pasture)' : 'Extensivo (Pastoreo)'}</option>
          </select>
          {animalData.errors.activityFactor && (
            <p className="text-red-500 text-xs mt-1">{animalData.errors.activityFactor}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {language === 'de' ? 'Wählen Sie das Haltungssystem' : 
             language === 'en' ? 'Select the management system' : 
             'Selecciona el sistema de manejo'}
          </p>
        </div>

        {/* Raza (opcional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raza (opcional)
          </label>
          <input
            type="text"
            value={animalData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Angus, Brahman, Charolais..."
          />
          <p className="text-gray-500 text-xs mt-1">
            Información adicional para el reporte (opcional)
          </p>
        </div>
      </div>

      {/* Resumen de Validación */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isFormValid ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isFormValid ? 'Datos válidos - Listo para calcular' : 'Completa todos los campos requeridos'}
            </span>
          </div>
          {isFormValid && (
            <div className="text-xs text-gray-500">
              ✓ Categoría: {selectedCategory.name.es}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAOAnimalForm;