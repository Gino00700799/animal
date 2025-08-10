import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NutritionBalanceDisplay = ({ validation, requirements, diet }) => {
  const { language } = useLanguage();

  if (!validation || !validation.balanceDetails) {
    return null;
  }

  const { balanceDetails } = validation;
  const { isBalanced, reasons, adequacyRates } = balanceDetails;

  const getStatusColor = (isBalanced) => {
    return isBalanced ? 'green' : 'red';
  };

  const getStatusIcon = (isBalanced) => {
    return isBalanced ? (
      <CheckCircle className="w-6 h-6 text-green-600" />
    ) : (
      <XCircle className="w-6 h-6 text-red-600" />
    );
  };

  const getAdequacyColor = (percentage) => {
    if (percentage >= 95 && percentage <= 105) return 'text-green-600 bg-green-50';
    if (percentage >= 85 && percentage < 95) return 'text-yellow-600 bg-yellow-50';
    if (percentage > 105 && percentage <= 120) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon(isBalanced)}
        <div>
          <h3 className={`text-xl font-bold ${isBalanced ? 'text-green-800' : 'text-red-800'}`}>
            {isBalanced 
              ? (language === 'de' ? 'Diät Balanciert' : language === 'en' ? 'Diet Balanced' : 'Dieta Balanceada')
              : (language === 'de' ? 'Diät NICHT Balanciert' : language === 'en' ? 'Diet NOT Balanced' : 'Dieta NO Balanceada')
            }
          </h3>
          <p className="text-gray-600 text-sm">
            {language === 'de' ? 'Strikte Validierung nach FAO-Standards' :
             language === 'en' ? 'Strict validation according to FAO standards' :
             'Validación estricta según estándares FAO'}
          </p>
        </div>
      </div>

      {/* Adequacy Rates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-3 rounded-lg ${getAdequacyColor(adequacyRates.energy)}`}>
          <div className="font-medium">
            {language === 'de' ? 'Energie' : language === 'en' ? 'Energy' : 'Energía'}
          </div>
          <div className="text-lg font-bold">{adequacyRates.energy}%</div>
          <div className="text-xs">95-105% Ziel</div>
        </div>
        
        <div className={`p-3 rounded-lg ${getAdequacyColor(adequacyRates.protein)}`}>
          <div className="font-medium">
            {language === 'de' ? 'Protein' : language === 'en' ? 'Protein' : 'Proteína'}
          </div>
          <div className="text-lg font-bold">{adequacyRates.protein}%</div>
          <div className="text-xs">95-105% Ziel</div>
        </div>
        
        <div className={`p-3 rounded-lg ${getAdequacyColor(adequacyRates.dryMatter)}`}>
          <div className="font-medium">
            {language === 'de' ? 'Trockensubstanz' : language === 'en' ? 'Dry Matter' : 'Materia Seca'}
          </div>
          <div className="text-lg font-bold">{adequacyRates.dryMatter}%</div>
          <div className="text-xs">95-105% Ziel</div>
        </div>

        {adequacyRates.ca_p_ratio && (
          <div className={`p-3 rounded-lg ${
            adequacyRates.ca_p_ratio >= 1.5 && adequacyRates.ca_p_ratio <= 2.5 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            <div className="font-medium">Ca:P Verhältnis</div>
            <div className="text-lg font-bold">{adequacyRates.ca_p_ratio}:1</div>
            <div className="text-xs">1.5-2.5:1 Ziel</div>
          </div>
        )}
      </div>

      {/* Calcium and Phosphorus Percentages */}
      {adequacyRates.ca_pct_dm !== undefined && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${
            adequacyRates.ca_pct_dm >= 0.4 && adequacyRates.ca_pct_dm <= 0.8 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            <div className="font-medium">Calcium % TM</div>
            <div className="text-lg font-bold">{adequacyRates.ca_pct_dm}%</div>
            <div className="text-xs">0.4-0.8% Ziel</div>
          </div>
          
          <div className={`p-3 rounded-lg ${
            adequacyRates.p_pct_dm >= 0.25 && adequacyRates.p_pct_dm <= 0.45 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            <div className="font-medium">Phosphor % TM</div>
            <div className="text-lg font-bold">{adequacyRates.p_pct_dm}%</div>
            <div className="text-xs">0.25-0.45% Ziel</div>
          </div>
        </div>
      )}

      {/* Problems List */}
      {reasons.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">
              {language === 'de' ? 'Gefundene Probleme' : 
               language === 'en' ? 'Problems Found' : 
               'Problemas Encontrados'} ({reasons.length})
            </span>
          </div>
          <ul className="space-y-1">
            {reasons.map((reason, index) => (
              <li key={index} className="text-red-700 text-sm flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {isBalanced && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              {language === 'de' ? 'Alle Nährstoff-Ziele erreicht!' : 
               language === 'en' ? 'All nutritional targets met!' : 
               '¡Todos los objetivos nutricionales cumplidos!'}
            </span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            {language === 'de' ? 'Diese Ration erfüllt alle FAO-Standards für eine ausgewogene Rinderernährung.' :
             language === 'en' ? 'This ration meets all FAO standards for balanced cattle nutrition.' :
             'Esta ración cumple con todos los estándares FAO para una nutrición bovina equilibrada.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NutritionBalanceDisplay;