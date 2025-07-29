import React, { useState } from 'react';
import { Download, FileText, Mail, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ExportReport = ({ animal, measurements, nutritionData, feedRequirements }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { t, language } = useLanguage();

  const generatePDFReport = async () => {
    setIsExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const reportData = {
        animal: animal.name[language],
        weight: measurements.weight,
        height: measurements.height,
        nutritionData,
        feedRequirements,
        generatedAt: new Date().toLocaleDateString(language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : 'en-US')
      };

      // Create downloadable content
      const content = `
RINDER ERNÄHRUNGS-BERICHT
========================

Tier: ${animal.name[language]}
Gewicht: ${measurements.weight} kg
Höhe: ${measurements.height} m
Generiert am: ${reportData.generatedAt}

NÄHRSTOFFBEDARF:
- Trockenmasse: ${nutritionData.tmKg} kg/Tag
- TDN (Energie): ${nutritionData.tdnKg} kg/Tag
- Protein (DCP): ${nutritionData.dcpKg} kg/Tag

FUTTERBEDARF:
- Heu: ${feedRequirements.hayKg} kg/Tag
- Kraftfutter: ${feedRequirements.concentrateKg} kg/Tag
- Silage: ${feedRequirements.silageKg} kg/Tag
- Wasser: ${feedRequirements.waterLiters} Liter/Tag

Tägliche Kosten: €${feedRequirements.dailyCostEuro}

Dieser Bericht wurde mit dem Rinder Ernährungs-Rechner erstellt.
Konsultieren Sie immer einen Tierarzt für spezifische Empfehlungen.
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rinder-bericht-${animal.name.en.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1500);
  };

  const shareViaEmail = () => {
    const subject = `Rinder Ernährungs-Bericht für ${animal.name[language]}`;
    const body = `Hier ist der Ernährungs-Bericht für ${animal.name[language]}:

Gewicht: ${measurements.weight} kg
Höhe: ${measurements.height} m

Täglicher Nährstoffbedarf:
- Trockenmasse: ${nutritionData.tmKg} kg
- TDN: ${nutritionData.tdnKg} kg  
- Protein: ${nutritionData.dcpKg} kg

Erstellt mit dem Rinder Ernährungs-Rechner.`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-blue-500" />
        Bericht exportieren
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={generatePDFReport}
          disabled={isExporting}
          className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Erstelle...' : 'Als Datei herunterladen'}
        </button>
        
        <button
          onClick={shareViaEmail}
          className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Mail className="w-4 h-4 mr-2" />
          Per E-Mail teilen
        </button>
        
        <button
          onClick={printReport}
          className="flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Drucken
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        💡 Tipp: Speichere den Bericht für deine Aufzeichnungen oder teile ihn mit deinem Tierarzt.
      </p>
    </div>
  );
};

export default ExportReport;