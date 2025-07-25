import React, { useState, useEffect } from 'react';
import { Scale, Ruler, Calculator, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CalculationForm = ({ animal, onCalculate }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const { t, language } = useLanguage();

  useEffect(() => {
    // Reset form when animal changes
    setWeight('');
    setHeight('');
    setAge('');
    setErrors({});
  }, [animal]);

  const validateInputs = () => {
    const newErrors = {};
    
    if (!weight || parseFloat(weight) <= 0) {
      newErrors.weight = t('validWeight');
    } else if (parseFloat(weight) < 1 || parseFloat(weight) > 10000) {
      newErrors.weight = t('weightBetween');
    }
    
    if (!height || parseFloat(height) <= 0) {
      newErrors.height = t('validHeight');
    } else if (parseFloat(height) < 0.1 || parseFloat(height) > 10) {
      newErrors.height = t('heightBetween');
    }
    
    if (!age || parseFloat(age) <= 0) {
      newErrors.age = t('validAge');
    } else if (parseFloat(age) < 0.1 || parseFloat(age) > 100) {
      newErrors.age = t('ageBetween');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      onCalculate({
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseFloat(age)
      });
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    setWeight(value);
    if (errors.weight && value && parseFloat(value) > 0) {
      setErrors(prev => ({ ...prev, weight: null }));
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    setHeight(value);
    if (errors.height && value && parseFloat(value) > 0) {
      setErrors(prev => ({ ...prev, height: null }));
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
    if (errors.age && value && parseFloat(value) > 0) {
      setErrors(prev => ({ ...prev, age: null }));
    }
  };

  const getPlaceholder = (type) => {
    if (!animal) return '';
    
    if (type === 'weight') {
      const { min, max } = animal.averageWeight;
      return `${min}-${max} kg`;
    } else {
      const { min, max } = animal.averageHeight;
      return `${min}-${max} m`;
    }
  };

  if (!animal) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
        <div className="text-center text-gray-500">
          <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{t('selectAnimalToCalculate')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg animate-fade-in">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{animal.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('calculateFor')} {animal.name ? animal.name[language] || animal.name : t(`animals.${animal.id}.name`)}
        </h2>
        <p className="text-gray-600">{t('enterMeasurements')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Scale className="w-4 h-4 inline mr-2" />
            {t('weight')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10000"
              value={weight}
              onChange={handleWeightChange}
              placeholder={getPlaceholder('weight')}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200
                ${errors.weight 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-primary-500'
                }
                focus:outline-none focus:ring-0 bg-white
              `}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {t('weightRange')}: {animal.averageWeight.min}-{animal.averageWeight.max} kg
          </p>
        </div>

        {/* Height Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Ruler className="w-4 h-4 inline mr-2" />
            {t('height')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10"
              value={height}
              onChange={handleHeightChange}
              placeholder={getPlaceholder('height')}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200
                ${errors.height 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-primary-500'
                }
                focus:outline-none focus:ring-0 bg-white
              `}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {t('heightRange')}: {animal.averageHeight.min}-{animal.averageHeight.max} m
          </p>
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {t('age')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={age}
              onChange={handleAgeChange}
              placeholder={t('agePlaceholder')}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200
                ${errors.age 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-primary-500'
                }
                focus:outline-none focus:ring-0 bg-white
              `}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {t('ageInfo')}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Calculator className="w-5 h-5 inline mr-2" />
          {t('calculateNeeds')}
        </button>
      </form>

      {/* Fun Facts */}
      {animal.funFacts && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">🤓 Fun Facts about {animal.name}s:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {animal.funFacts.map((fact, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalculationForm;