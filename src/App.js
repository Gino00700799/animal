import React, { useState } from 'react';
import { Heart, Github, Coffee } from 'lucide-react';
import CountrySelector from './components/CountrySelector';
import BreedSelector from './components/BreedSelector';
import CalculationForm from './components/CalculationForm';
import ResultsDisplay from './components/ResultsDisplay';
import LanguageSelector from './components/LanguageSelector';
import FAODietCalculator from './components/FAODietCalculator';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';

const AppContent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [currentCalculator, setCurrentCalculator] = useState('fao'); // Only FAO calculator
  const { t } = useLanguage();

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedBreed(null);
    setMeasurements(null);
    setShowResults(false);
  };

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    setMeasurements(null);
    setShowResults(false);
  };

  const handleCalculate = (measurementData) => {
    setMeasurements(measurementData);
    setShowResults(true);
  };

  const handleReset = () => {
    setMeasurements(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🦁</div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  🐄 {t('cattleCalculator')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('cattleSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {/* Calculator Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentCalculator('fao')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentCalculator === 'fao'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🐂 FAO Pro
                </button>
              </div>
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <button className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
                <Coffee className="w-4 h-4" />
                <span className="text-sm">{t('buyMeCoffee')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* FAO Professional Calculator */}
        <FAODietCalculator />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-gray-600">{t('madeWith')}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">{t('by')}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('disclaimer')}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 Exotic Animal Calculator</span>
              <span>•</span>
              <button className="hover:text-gray-700 transition-colors">{t('privacyPolicy')}</button>
              <span>•</span>
              <button className="hover:text-gray-700 transition-colors">{t('termsOfService')}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;