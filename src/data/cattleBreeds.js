// Cattle breeds data organized by country/region

export const cattleBreedsByCountry = {
  germany: {
    name: { de: "Deutschland", en: "Germany", es: "Alemania" },
    flag: "🇩🇪",
    breeds: [
      {
        id: "angus_bull_de",
        name: { de: "Angus Bulle", en: "Angus Bull", es: "Toro Angus" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 700, max: 1000 },
        averageHeight: { min: 1.5, max: 1.8 },
        meatYield: { min: 60, max: 65 }, // percentage
        calorieMultiplier: 78,
        characteristics: {
          de: "Kraftvoller Fleischbulle, hornlos, hervorragende Fleischqualität",
          en: "Powerful beef bull, polled, excellent meat quality",
          es: "Toro de carne poderoso, sin cuernos, excelente calidad de carne"
        }
      },
      {
        id: "simmental_bull_de",
        name: { de: "Fleckvieh Bulle", en: "Simmental Bull", es: "Toro Simmental" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 800, max: 1200 },
        averageHeight: { min: 1.5, max: 1.8 },
        meatYield: { min: 58, max: 63 },
        calorieMultiplier: 80,
        characteristics: {
          de: "Großer Fleischbulle, rotbraun mit weißen Abzeichen, sehr muskulös",
          en: "Large beef bull, red-brown with white markings, very muscular",
          es: "Toro de carne grande, marrón rojizo con marcas blancas, muy musculoso"
        }
      },
      {
        id: "limousin_bull_de",
        name: { de: "Limousin Bulle", en: "Limousin Bull", es: "Toro Limousin" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 900, max: 1300 },
        averageHeight: { min: 1.6, max: 1.9 },
        meatYield: { min: 62, max: 68 },
        calorieMultiplier: 82,
        characteristics: {
          de: "Goldbrauner Fleischbulle, sehr mageres Fleisch, hohe Ausbeute",
          en: "Golden-brown beef bull, very lean meat, high yield",
          es: "Toro de carne dorado-marrón, carne muy magra, alto rendimiento"
        }
      },
      {
        id: "calf_de",
        name: { de: "Mastkalb", en: "Veal Calf", es: "Ternero de Engorde" },
        type: "veal",
        emoji: "🐮",
        averageWeight: { min: 150, max: 300 },
        averageHeight: { min: 0.9, max: 1.3 },
        meatYield: { min: 55, max: 60 },
        calorieMultiplier: 85,
        characteristics: {
          de: "Junges Kalb für Kalbfleischproduktion, zartes Fleisch",
          en: "Young calf for veal production, tender meat",
          es: "Ternero joven para producción de ternera, carne tierna"
        }
      }
    ]
  },
  
  usa: {
    name: { de: "USA", en: "USA", es: "EE.UU." },
    flag: "🇺🇸",
    breeds: [
      {
        id: "black_angus_us",
        name: { de: "Black Angus Bulle", en: "Black Angus Bull", es: "Toro Black Angus" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 800, max: 1100 },
        averageHeight: { min: 1.5, max: 1.8 },
        meatYield: { min: 62, max: 67 },
        calorieMultiplier: 79,
        characteristics: {
          de: "Amerikanischer Black Angus, marmoriertes Fleisch, Premium-Qualität",
          en: "American Black Angus, marbled meat, premium quality",
          es: "Black Angus americano, carne marmoleada, calidad premium"
        }
      },
      {
        id: "hereford_bull_us",
        name: { de: "Hereford Bulle", en: "Hereford Bull", es: "Toro Hereford" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 750, max: 1050 },
        averageHeight: { min: 1.4, max: 1.7 },
        meatYield: { min: 60, max: 65 },
        calorieMultiplier: 77,
        characteristics: {
          de: "Rotbraun mit weißem Gesicht, robuste Fleischrasse",
          en: "Red-brown with white face, robust beef breed",
          es: "Marrón rojizo con cara blanca, raza de carne robusta"
        }
      },
      {
        id: "texas_longhorn_bull",
        name: { de: "Texas Longhorn Bulle", en: "Texas Longhorn Bull", es: "Toro Texas Longhorn" },
        type: "beef",
        emoji: "🤠",
        averageWeight: { min: 650, max: 950 },
        averageHeight: { min: 1.4, max: 1.7 },
        meatYield: { min: 58, max: 62 },
        calorieMultiplier: 76,
        characteristics: {
          de: "Charakteristische lange Hörner, robust, mageres Fleisch",
          en: "Characteristic long horns, robust, lean meat",
          es: "Cuernos largos característicos, robusto, carne magra"
        }
      },
      {
        id: "wagyu_calf_us",
        name: { de: "Wagyu Kalb", en: "Wagyu Calf", es: "Ternero Wagyu" },
        type: "veal",
        emoji: "🐮",
        averageWeight: { min: 200, max: 350 },
        averageHeight: { min: 1.0, max: 1.4 },
        meatYield: { min: 65, max: 70 },
        calorieMultiplier: 88,
        characteristics: {
          de: "Premium Wagyu Kalb, höchste Fleischqualität, intensive Marmorierung",
          en: "Premium Wagyu calf, highest meat quality, intense marbling",
          es: "Ternero Wagyu premium, máxima calidad de carne, marmoleado intenso"
        }
      }
    ]
  },
  
  france: {
    name: { de: "Frankreich", en: "France", es: "Francia" },
    flag: "🇫🇷",
    breeds: [
      {
        id: "charolais_bull",
        name: { de: "Charolais Bulle", en: "Charolais Bull", es: "Toro Charolais" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 1000, max: 1400 },
        averageHeight: { min: 1.6, max: 1.9 },
        meatYield: { min: 64, max: 69 },
        calorieMultiplier: 83,
        characteristics: {
          de: "Großer cremweißer Fleischbulle, sehr muskulös, hohe Fleischausbeute",
          en: "Large cream-white beef bull, very muscular, high meat yield",
          es: "Toro de carne grande blanco crema, muy musculoso, alto rendimiento de carne"
        }
      },
      {
        id: "limousin_bull_fr",
        name: { de: "Limousin Bulle (Frankreich)", en: "Limousin Bull (France)", es: "Toro Limousin (Francia)" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 850, max: 1200 },
        averageHeight: { min: 1.5, max: 1.8 },
        meatYield: { min: 63, max: 68 },
        calorieMultiplier: 81,
        characteristics: {
          de: "Französischer Limousin Bulle, goldbraun, sehr mageres Fleisch",
          en: "French Limousin bull, golden-brown, very lean meat",
          es: "Toro Limousin francés, dorado-marrón, carne muy magra"
        }
      },
      {
        id: "blonde_aquitaine_bull",
        name: { de: "Blonde d'Aquitaine Bulle", en: "Blonde d'Aquitaine Bull", es: "Toro Blonde d'Aquitaine" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 950, max: 1350 },
        averageHeight: { min: 1.6, max: 1.9 },
        meatYield: { min: 65, max: 70 },
        calorieMultiplier: 84,
        characteristics: {
          de: "Blonde französische Fleischrasse, sehr große Bullen, excellente Fleischqualität",
          en: "Blonde French beef breed, very large bulls, excellent meat quality",
          es: "Raza francesa rubia de carne, toros muy grandes, excelente calidad de carne"
        }
      }
    ]
  },
  
  switzerland: {
    name: { de: "Schweiz", en: "Switzerland", es: "Suiza" },
    flag: "🇨🇭",
    breeds: [
      {
        id: "brown_swiss_bull",
        name: { de: "Braunvieh Bulle", en: "Brown Swiss Bull", es: "Toro Pardo Suizo" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 800, max: 1100 },
        averageHeight: { min: 1.5, max: 1.8 },
        meatYield: { min: 60, max: 65 },
        calorieMultiplier: 79,
        characteristics: {
          de: "Schweizer Braunvieh Bulle, robust, gute Fleischqualität",
          en: "Swiss Brown bull, robust, good meat quality",
          es: "Toro Pardo Suizo, robusto, buena calidad de carne"
        }
      },
      {
        id: "simmental_calf_ch",
        name: { de: "Simmental Kalb (Schweiz)", en: "Simmental Calf (Switzerland)", es: "Ternero Simmental (Suiza)" },
        type: "veal",
        emoji: "🐮",
        averageWeight: { min: 180, max: 320 },
        averageHeight: { min: 0.9, max: 1.3 },
        meatYield: { min: 58, max: 63 },
        calorieMultiplier: 86,
        characteristics: {
          de: "Schweizer Simmental Kalb, rotbraun-weiß, zartes Fleisch",
          en: "Swiss Simmental calf, red-brown-white, tender meat",
          es: "Ternero Simmental suizo, marrón rojizo-blanco, carne tierna"
        }
      }
    ]
  },
  
  netherlands: {
    name: { de: "Niederlande", en: "Netherlands", es: "Países Bajos" },
    flag: "🇳🇱",
    breeds: [
      {
        id: "dutch_black_bull",
        name: { de: "Niederländischer Schwarzbulle", en: "Dutch Black Bull", es: "Toro Negro Holandés" },
        type: "beef",
        emoji: "🐂",
        averageWeight: { min: 750, max: 1000 },
        averageHeight: { min: 1.4, max: 1.7 },
        meatYield: { min: 61, max: 66 },
        calorieMultiplier: 78,
        characteristics: {
          de: "Niederländischer Fleischbulle, schwarz-weiß, gute Fleischqualität",
          en: "Dutch beef bull, black-white, good meat quality",
          es: "Toro de carne holandés, negro-blanco, buena calidad de carne"
        }
      },
      {
        id: "dutch_veal_calf",
        name: { de: "Niederländisches Kalbfleisch-Kalb", en: "Dutch Veal Calf", es: "Ternero de Ternera Holandés" },
        type: "veal",
        emoji: "🐮",
        averageWeight: { min: 160, max: 280 },
        averageHeight: { min: 0.8, max: 1.2 },
        meatYield: { min: 56, max: 61 },
        calorieMultiplier: 84,
        characteristics: {
          de: "Niederländisches Kalbfleisch-Kalb, helle Fleischfarbe, zart",
          en: "Dutch veal calf, light meat color, tender",
          es: "Ternero de ternera holandés, color de carne claro, tierno"
        }
      }
    ]
  },
  
  custom: {
    name: { de: "Eigene Rasse", en: "Custom Breed", es: "Raza Personalizada" },
    flag: "➕",
    breeds: [
      {
        id: "custom_breed",
        name: { de: "Benutzerdefinierte Rasse", en: "Custom Breed", es: "Raza Personalizada" },
        type: "custom",
        emoji: "🐮",
        averageWeight: { min: 400, max: 1000 },
        averageHeight: { min: 1.2, max: 1.8 },
        milkProduction: { min: 2000, max: 12000 },
        calorieMultiplier: 75,
        characteristics: {
          de: "Definiere deine eigene Rinderrasse",
          en: "Define your own cattle breed",
          es: "Define tu propia raza de ganado"
        }
      }
    ]
  }
};

export const cattleTypes = {
  dairy: {
    name: { de: "Milchkuh", en: "Dairy Cow", es: "Vaca Lechera" },
    icon: "🥛",
    color: "blue"
  },
  beef: {
    name: { de: "Fleischrind", en: "Beef Cattle", es: "Ganado de Carne" },
    icon: "🥩",
    color: "red"
  },
  veal: {
    name: { de: "Kalbfleisch", en: "Veal", es: "Ternera" },
    icon: "🐮",
    color: "green"
  },
  dual: {
    name: { de: "Zweinutzung", en: "Dual Purpose", es: "Doble Propósito" },
    icon: "⚖️",
    color: "green"
  },
  custom: {
    name: { de: "Benutzerdefiniert", en: "Custom", es: "Personalizado" },
    icon: "🔧",
    color: "purple"
  }
};

export const getAllBreeds = () => {
  const allBreeds = [];
  Object.entries(cattleBreedsByCountry).forEach(([countryCode, country]) => {
    country.breeds.forEach(breed => {
      allBreeds.push({
        ...breed,
        country: countryCode,
        countryName: country.name,
        countryFlag: country.flag
      });
    });
  });
  return allBreeds;
};

export const getBreedsByCountry = (countryCode) => {
  return cattleBreedsByCountry[countryCode]?.breeds || [];
};

export const getBreedById = (breedId) => {
  const allBreeds = getAllBreeds();
  return allBreeds.find(breed => breed.id === breedId);
};