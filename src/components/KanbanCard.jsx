import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';

export default function KanbanCard({ item }) {
  const categoryColor = CATEGORIES[item.category] || '#ffffff';
  const revDate = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden relative w-[400px] h-[600px]"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-3"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="p-6 h-full flex flex-col">
        {/* Product Name and Part Number */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {item.productName}
          </h3>
          <p className="text-xl text-gray-500 uppercase">
            {item.partNumber}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 text-lg">
            {item.description}
          </p>
        </div>

        {/* Reorder Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Reorder Point</div>
            <div className="text-2xl font-bold text-amber-700">
              {item.reorderPoint}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Reorder QTY</div>
            <div className="text-2xl font-bold text-blue-600">
              {item.reorderQty}
            </div>
          </div>
        </div>

        {/* Location and Unit Cost */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Location</div>
            <div className="text-lg">
              {item.location}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Unit Cost</div>
            <div className="text-lg">
              ${item.unitCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Category and Supplier */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Category</div>
            <div className="text-lg">
              {item.category}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">Supplier</div>
            <div className="text-lg">
              {item.supplier}
            </div>
          </div>
        </div>

        {/* QR Code and Product Image */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <img 
              src={item.qrCode} 
              alt="QR Code"
              className="w-full aspect-square object-contain mb-2"
            />
            <div className="text-center text-sm text-gray-600">
              Scan to Order
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <img 
              src={item.imageUrl} 
              alt={item.productName}
              className="w-full aspect-square object-contain"
            />
          </div>
        </div>

        {/* Revision Date */}
        <div className="text-right text-sm text-gray-400 mt-2">
          Rev. Date: {revDate}
        </div>
      </div>
    </motion.div>
  );
}