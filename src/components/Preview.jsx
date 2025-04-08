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

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Kanban Cards</title>
          <style>
            @media print {
              @page {
                size: auto;
                margin: 0.5cm;
              }
              
              body {
                margin: 0;
                padding: 0;
              }
              
              .page-break {
                page-break-after: always;
              }
              
              .print-grid {
                display: grid;
                grid-gap: 20px;
                padding: 20px;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            .print-container {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
          </style>
          <link href="${window.location.origin}/src/index.css" rel="stylesheet" />
        </head>
        <body>
          <div class="print-container">
            ${Array.from(selectedItems).map(index => {
              const item = items[index];
              return `
                <div class="page-break">
                  ${document.querySelector(`[data-item-index="${index}"] .kanban-card`).outerHTML}
                </div>
                ${Array.from({ length: binLabelsCount }).map(() => `
                  <div class="page-break">
                    ${document.querySelector(`[data-item-index="${index}"] .bin-label`).outerHTML}
                  </div>
                `).join('')}
              `;
            }).join('')}
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;
    
    // Write content to print window
    printWindow.document.write(printContent);
    printWindow.document.close();
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
              onClick={handlePrint}
              disabled={selectedItems.size === 0}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              Print Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} data-item-index={index} className="space-y-4">
              <label className="flex items-center space-x-2 no-print">
                <input
                  type="checkbox"
                  checked={selectedItems.has(index)}
                  onChange={() => toggleItem(index)}
                  className="rounded"
                />
                <span>Select for printing</span>
              </label>
              <div className="kanban-card">
                <KanbanCard item={item} />
              </div>
              {Array.from({ length: binLabelsCount }).map((_, i) => (
                <div key={i} className="bin-label">
                  <BinLabel item={item} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}