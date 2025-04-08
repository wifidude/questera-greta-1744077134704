import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';

export default function FileUpload({ onUpload, loading }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center space-y-4"
      >
        <FiUpload className="w-12 h-12 text-gray-400" />
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-900">
            {loading ? 'Processing...' : 'Drop your spreadsheet here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to select a file
          </p>
        </div>
      </label>
    </motion.div>
  );
}