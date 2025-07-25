import React from 'react';
import { getDietInfo } from '../data/animals';

const AnimalCard = ({ animal, isSelected, onSelect }) => {
  const dietInfo = getDietInfo(animal.diet);
  const isFeatured = animal.featured;
  const isPremium = animal.category === 'premium';

  return (
    <div
      className={`
        relative p-6 rounded-xl cursor-pointer transition-all duration-300 card-hover
        ${isSelected 
          ? 'bg-white shadow-xl ring-2 ring-primary-500 transform scale-105' 
          : 'bg-white/90 shadow-lg hover:shadow-xl'
        }
        ${isFeatured ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}
        ${isPremium ? 'border-2 border-yellow-500' : ''}
      `}
      onClick={() => onSelect(animal)}
    >
      {/* Premium/Featured badges */}
      {isPremium && (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          ⭐ PREMIUM
        </div>
      )}
      
      {isFeatured && !isPremium && (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          🔥 FEATURED
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Animal emoji and name */}
      <div className="text-center mb-4">
        <div className={`mb-2 ${isPremium ? 'text-7xl' : 'text-6xl'}`}>
          {animal.emoji}
        </div>
        <h3 className={`font-bold mb-1 ${isPremium ? 'text-2xl text-yellow-800' : 'text-xl text-gray-800'}`}>
          {animal.name}
        </h3>
        <p className={`text-sm ${isPremium ? 'text-yellow-700 font-medium' : 'text-gray-600'}`}>
          {animal.description}
        </p>
      </div>

      {/* Diet badge */}
      <div className="flex justify-center mb-4">
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${dietInfo.bgColor} ${dietInfo.color}
        `}>
          <span className="mr-1">{dietInfo.icon}</span>
          {dietInfo.description}
        </span>
      </div>

      {/* Quick stats */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Weight range:</span>
          <span className="font-medium">
            {animal.averageWeight.min}-{animal.averageWeight.max}kg
          </span>
        </div>
        <div className="flex justify-between">
          <span>Height range:</span>
          <span className="font-medium">
            {animal.averageHeight.min}-{animal.averageHeight.max}m
          </span>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className={`
        absolute inset-0 rounded-xl transition-opacity duration-300
        ${isSelected ? 'opacity-0' : 'opacity-0 hover:opacity-5'}
        bg-gradient-to-br from-primary-500 to-primary-700
      `} />
    </div>
  );
};

export default AnimalCard;