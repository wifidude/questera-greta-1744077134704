import React, { useState } from 'react';
import { motion } from 'framer-motion';
import KanbanCard from './KanbanCard';
import BinLabel from './BinLabel';

export default function Preview({ items }) {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [binLabelsCount, setBinLabelsCount] = useState(3);

  const toggleItem = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Preview & Print
          </h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Bin Labels per Item:
              </span>
              <input
                type="number"
                min="1"
                value={binLabelsCount}
                onChange={(e) => setBinLabelsCount(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
            </label>
            <button
              onClick={() => {/* Implement print logic */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.has(index)}
                  onChange={() => toggleItem(index)}
                  className="rounded"
                />
                <span>Select for printing</span>
              </label>
              <KanbanCard item={item} />
              {Array.from({ length: binLabelsCount }).map((_, i) => (
                <BinLabel key={i} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}