import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to German
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('animalCalculatorLanguage');
    return savedLanguage || 'de';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('animalCalculatorLanguage', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return getTranslation(language, key);
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};