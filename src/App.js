import React, { useState } from 'react';
import { Heart, Github, Coffee } from 'lucide-react';
import CountrySelector from './components/CountrySelector';
import BreedSelector from './components/BreedSelector';
import CalculationForm from './components/CalculationForm';
import ResultsDisplay from './components/ResultsDisplay';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [showResults, setShowResults] = useState(false);
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
        {!showResults ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {t('cattleHeroTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('cattleHeroSubtitle')}
              </p>
            </div>

            {/* Country Selection */}
            <section className="mb-12">
              <CountrySelector
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
              />
            </section>

            {/* Breed Selection */}
            <section className="mb-12">
              <BreedSelector
                selectedCountry={selectedCountry}
                selectedBreed={selectedBreed}
                onBreedSelect={handleBreedSelect}
              />
            </section>

            {/* Calculation Form */}
            <section>
              <CalculationForm
                animal={selectedBreed}
                onCalculate={handleCalculate}
              />
            </section>
          </>
        ) : (
          /* Results Display */
          <ResultsDisplay
            animal={selectedBreed}
            measurements={measurements}
            onReset={handleReset}
          />
        )}

        {/* Features Section */}
        {!showResults && (
          <section className="mt-16 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Why Use Our Calculator?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/60 rounded-xl">
                <div className="text-4xl mb-4">🔬</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Scientific Accuracy
                </h4>
                <p className="text-gray-600">
                  Based on metabolic research and veterinary nutritional guidelines
                </p>
              </div>
              <div className="text-center p-6 bg-white/60 rounded-xl">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Visual Analytics
                </h4>
                <p className="text-gray-600">
                  Interactive charts and comparisons for better understanding
                </p>
              </div>
              <div className="text-center p-6 bg-white/60 rounded-xl">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Practical Recommendations
                </h4>
                <p className="text-gray-600">
                  Actionable feeding guidelines and care tips
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-gray-600">Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">by Rovo Dev</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              This calculator provides estimates for educational purposes. 
              Always consult with veterinary professionals for actual animal care.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 Exotic Animal Calculator</span>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
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
      <AppContent />
    </LanguageProvider>
  );
}

export default App;