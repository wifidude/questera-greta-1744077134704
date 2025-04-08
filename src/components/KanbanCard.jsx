import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';
import { LOCATION_COLORS } from '../utils/spreadsheet';

export default function KanbanCard({ item }) {
  const categoryColor = CATEGORIES[item.category] || '#ffffff';
  const revDate = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  
  // Get location color based on first letter
  const locationFirstLetter = item.location?.charAt(0)?.toUpperCase() || 'A';
  const locationColor = LOCATION_COLORS[locationFirstLetter] || '#f8fafc';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden relative w-[400px] h-[600px] border-2 border-gray-300 print:shadow-none print:border-[1px]"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-3"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="p-6 h-full flex flex-col">
        {/* Product Name and Part Number */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {item.productName}
          </h3>
          <p className="text-xl text-gray-500 uppercase">
            {item.partNumber}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            {item.description}
          </p>
        </div>

        {/* Reorder Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-gray-600 mb-1">Reorder Point</div>
            <div className="text-2xl font-bold text-amber-700">
              {item.reorderPoint}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-gray-600 mb-1">Reorder QTY</div>
            <div className="text-2xl font-bold text-blue-600">
              {item.reorderQty}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div 
            className="rounded-lg p-2"
            style={{ backgroundColor: locationColor }}
          >
            <div className="text-gray-600 text-sm">Location</div>
            <div className="text-base">
              {item.location}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600 text-sm">Unit Cost</div>
            <div className="text-base">
              ${item.unitCost.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600 text-sm">Category</div>
            <div className="text-base">
              {item.category}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-600 text-sm">Supplier</div>
            <div className="text-base">
              {item.supplier}
            </div>
          </div>
        </div>

        {/* QR Code and Product Image */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <img 
              src={item.qrCode} 
              alt="QR Code"
              className="w-full h-[120px] object-contain mb-1"
            />
            <div className="text-center text-sm text-gray-600">
              Scan to Order
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <img 
              src={item.imageUrl} 
              alt={item.productName}
              className="w-full h-[120px] object-contain"
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