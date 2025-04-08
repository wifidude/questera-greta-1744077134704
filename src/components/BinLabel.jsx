import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';

export default function BinLabel({ item }) {
  const categoryColor = CATEGORIES[item.category] || '#ffffff';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex w-[300px] h-[100px] border-2 border-gray-300 print:shadow-none print:border-[1px]"
    >
      <div 
        className="w-2 flex-shrink-0"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="flex-grow p-3 flex">
        <div className="flex-grow">
          <h4 className="font-bold text-gray-900 text-sm line-clamp-2">
            {item.productName}
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            {item.partNumber}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {item.location}
          </p>
        </div>
        <div className="w-[80px] aspect-square ml-3">
          <img 
            src={item.imageUrl} 
            alt={item.productName}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}