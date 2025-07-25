export const animals = [
  {
    id: 'bull',
    name: 'Bull (Stier)',
    emoji: '🐂',
    diet: 'herbivore',
    description: 'Powerful male cattle - King of the Farm',
    averageWeight: { min: 500, max: 1200 },
    averageHeight: { min: 1.4, max: 1.8 },
    calorieMultiplier: 75,
    featured: true,
    category: 'premium',
    funFacts: [
      'Can weigh up to 1200kg of pure muscle',
      'Extremely strong with incredible stamina',
      'Symbol of power and strength in many cultures',
      'Can consume up to 40kg of grass daily'
    ]
  },
  {
    id: 'cow',
    name: 'Dairy Cow (Milchkuh)',
    emoji: '🐄',
    diet: 'herbivore',
    description: 'Productive dairy cattle - Farm Essential',
    averageWeight: { min: 400, max: 800 },
    averageHeight: { min: 1.2, max: 1.6 },
    calorieMultiplier: 70,
    featured: true,
    category: 'premium',
    funFacts: [
      'Can produce up to 40 liters of milk per day',
      'Has four stomach chambers for digestion',
      'Spends 6-8 hours daily grazing',
      'Essential for dairy and beef production'
    ]
  },
  {
    id: 'calf',
    name: 'Calf (Kalb)',
    emoji: '🐮',
    diet: 'herbivore',
    description: 'Young cattle - Future of the Herd',
    averageWeight: { min: 30, max: 200 },
    averageHeight: { min: 0.7, max: 1.2 },
    calorieMultiplier: 85,
    featured: true,
    category: 'premium',
    funFacts: [
      'Grows rapidly in first year of life',
      'Drinks up to 10 liters of milk daily when young',
      'Very playful and energetic',
      'Needs high-energy diet for growth'
    ]
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    diet: 'herbivore',
    description: 'Tallest mammal in the world',
    averageWeight: { min: 800, max: 1930 },
    averageHeight: { min: 4.3, max: 5.7 },
    calorieMultiplier: 70,
    funFacts: [
      'Can eat up to 75 pounds of vegetation per day',
      'Has a 20-inch long tongue',
      'Only needs 5-30 minutes of sleep per day'
    ]
  },
  {
    id: 'gorilla',
    name: 'Gorilla',
    emoji: '🦍',
    diet: 'herbivore',
    description: 'Largest living primate',
    averageWeight: { min: 70, max: 220 },
    averageHeight: { min: 1.25, max: 1.8 },
    calorieMultiplier: 75,
    funFacts: [
      'Shares 98% of DNA with humans',
      'Can live up to 50 years',
      'Primarily eats leaves, stems, and fruits'
    ]
  },
  {
    id: 'zebra',
    name: 'Zebra',
    emoji: '🦓',
    diet: 'herbivore',
    description: 'Striped African equid',
    averageWeight: { min: 200, max: 450 },
    averageHeight: { min: 1.1, max: 1.5 },
    calorieMultiplier: 65,
    funFacts: [
      'Each zebra has a unique stripe pattern',
      'Can run up to 65 km/h',
      'Lives in herds for protection'
    ]
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    diet: 'herbivore',
    description: 'Largest land mammal',
    averageWeight: { min: 2700, max: 6000 },
    averageHeight: { min: 2.5, max: 4.0 },
    calorieMultiplier: 80,
    funFacts: [
      'Can eat up to 300 pounds of food per day',
      'Has excellent memory',
      'Can live up to 70 years'
    ]
  },
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    diet: 'carnivore',
    description: 'King of the jungle',
    averageWeight: { min: 120, max: 250 },
    averageHeight: { min: 0.9, max: 1.2 },
    calorieMultiplier: 90,
    meatPercentage: 85,
    funFacts: [
      'Can eat up to 15kg of meat in one meal',
      'Sleeps 16-20 hours per day',
      'Lives in social groups called prides'
    ]
  },
  {
    id: 'tiger',
    name: 'Tiger',
    emoji: '🐅',
    diet: 'carnivore',
    description: 'Largest wild cat',
    averageWeight: { min: 140, max: 300 },
    averageHeight: { min: 0.9, max: 1.1 },
    calorieMultiplier: 95,
    meatPercentage: 90,
    funFacts: [
      'Can leap horizontally up to 10 meters',
      'Excellent swimmers',
      'Each tiger has unique stripe patterns'
    ]
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    emoji: '🐆',
    diet: 'carnivore',
    description: 'Fastest land animal',
    averageWeight: { min: 35, max: 72 },
    averageHeight: { min: 0.7, max: 0.9 },
    calorieMultiplier: 85,
    meatPercentage: 95,
    funFacts: [
      'Can reach speeds up to 120 km/h',
      'Cannot roar, only purr and chirp',
      'Has semi-retractable claws for traction'
    ]
  },
  {
    id: 'hippo',
    name: 'Hippopotamus',
    emoji: '🦛',
    diet: 'herbivore',
    description: 'Semi-aquatic mammal',
    averageWeight: { min: 1500, max: 3200 },
    averageHeight: { min: 1.3, max: 1.6 },
    calorieMultiplier: 85,
    funFacts: [
      'Can hold breath underwater for 5 minutes',
      'Secretes natural sunscreen',
      'Despite appearance, closely related to whales'
    ]
  },
  {
    id: 'rhino',
    name: 'Rhinoceros',
    emoji: '🦏',
    diet: 'herbivore',
    description: 'Armored herbivore with horn',
    averageWeight: { min: 800, max: 2300 },
    averageHeight: { min: 1.4, max: 1.8 },
    calorieMultiplier: 75,
    funFacts: [
      'Horn is made of keratin, same as human hair',
      'Can run up to 50 km/h despite size',
      'Has poor eyesight but excellent hearing'
    ]
  },
  {
    id: 'bear',
    name: 'Brown Bear',
    emoji: '🐻',
    diet: 'omnivore',
    description: 'Large omnivorous mammal',
    averageWeight: { min: 130, max: 680 },
    averageHeight: { min: 1.0, max: 1.5 },
    calorieMultiplier: 80,
    meatPercentage: 60,
    funFacts: [
      'Can eat up to 90 pounds of food per day',
      'Hibernates for up to 7 months',
      'Has an excellent sense of smell'
    ]
  },
  {
    id: 'kangaroo',
    name: 'Kangaroo',
    emoji: '🦘',
    diet: 'herbivore',
    description: 'Hopping marsupial',
    averageWeight: { min: 18, max: 90 },
    averageHeight: { min: 0.8, max: 1.6 },
    calorieMultiplier: 70,
    funFacts: [
      'Can hop at speeds up to 60 km/h',
      'Cannot walk backwards',
      'Uses tail as a fifth leg for balance'
    ]
  },
  {
    id: 'panda',
    name: 'Giant Panda',
    emoji: '🐼',
    diet: 'herbivore',
    description: 'Bamboo-eating bear',
    averageWeight: { min: 70, max: 125 },
    averageHeight: { min: 0.6, max: 0.9 },
    calorieMultiplier: 65,
    funFacts: [
      'Eats 12-38 kg of bamboo daily',
      'Spends 14 hours a day eating',
      'Has a pseudo-thumb for gripping bamboo'
    ]
  },
  {
    id: 'penguin',
    name: 'Emperor Penguin',
    emoji: '🐧',
    diet: 'carnivore',
    description: 'Antarctic flightless bird',
    averageWeight: { min: 22, max: 45 },
    averageHeight: { min: 1.0, max: 1.3 },
    calorieMultiplier: 95,
    meatPercentage: 100,
    funFacts: [
      'Can dive up to 500 meters deep',
      'Males incubate eggs for 64 days',
      'Can hold breath for 20+ minutes'
    ]
  },
  {
    id: 'sloth',
    name: 'Three-toed Sloth',
    emoji: '🦥',
    diet: 'herbivore',
    description: 'Extremely slow arboreal mammal',
    averageWeight: { min: 3.5, max: 6 },
    averageHeight: { min: 0.4, max: 0.6 },
    calorieMultiplier: 45,
    funFacts: [
      'Moves so slowly that algae grows on fur',
      'Only defecates once a week',
      'Can rotate head 270 degrees'
    ]
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    emoji: '🦩',
    diet: 'omnivore',
    description: 'Pink wading bird',
    averageWeight: { min: 2, max: 4 },
    averageHeight: { min: 1.0, max: 1.5 },
    calorieMultiplier: 85,
    meatPercentage: 30,
    funFacts: [
      'Gets pink color from eating shrimp and algae',
      'Can only eat with head upside down',
      'Stands on one leg to conserve body heat'
    ]
  },
  {
    id: 'koala',
    name: 'Koala',
    emoji: '🐨',
    diet: 'herbivore',
    description: 'Eucalyptus-eating marsupial',
    averageWeight: { min: 4, max: 15 },
    averageHeight: { min: 0.6, max: 0.85 },
    calorieMultiplier: 55,
    funFacts: [
      'Sleeps 18-22 hours per day',
      'Only eats eucalyptus leaves',
      'Has fingerprints similar to humans'
    ]
  },
  {
    id: 'crocodile',
    name: 'Saltwater Crocodile',
    emoji: '🐊',
    diet: 'carnivore',
    description: 'Largest living reptile',
    averageWeight: { min: 400, max: 1000 },
    averageHeight: { min: 0.4, max: 0.6 },
    calorieMultiplier: 60,
    meatPercentage: 100,
    funFacts: [
      'Can go months without eating',
      'Has the strongest bite force of any animal',
      'Unchanged for 200 million years'
    ]
  },
  {
    id: 'ostrich',
    name: 'Ostrich',
    emoji: '🪶',
    diet: 'omnivore',
    description: 'Largest flightless bird',
    averageWeight: { min: 63, max: 145 },
    averageHeight: { min: 1.7, max: 2.8 },
    calorieMultiplier: 75,
    meatPercentage: 20,
    funFacts: [
      'Can run up to 70 km/h',
      'Lays the largest eggs of any bird',
      'Has the largest eyes of any land animal'
    ]
  },
  {
    id: 'wolf',
    name: 'Gray Wolf',
    emoji: '🐺',
    diet: 'carnivore',
    description: 'Pack-hunting predator',
    averageWeight: { min: 30, max: 80 },
    averageHeight: { min: 0.6, max: 0.85 },
    calorieMultiplier: 90,
    meatPercentage: 95,
    funFacts: [
      'Can smell prey from 2.4 km away',
      'Lives in packs with complex social structure',
      'Can travel 50+ km per day hunting'
    ]
  }
];

export const getDietInfo = (diet) => {
  const dietInfo = {
    herbivore: {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '🌱',
      description: 'Plant-eater'
    },
    carnivore: {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '🥩',
      description: 'Meat-eater'
    },
    omnivore: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: '🍽️',
      description: 'Eats both plants and meat'
    }
  };
  
  return dietInfo[diet] || dietInfo.herbivore;
};