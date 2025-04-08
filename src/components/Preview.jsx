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
    const printWindow = window.open('', '_blank');
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn('Could not access stylesheet rules');
          return '';
        }
      })
      .join('\n');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Kanban Cards</title>
          <style>
            ${styles}
            
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .page-break {
                page-break-after: always;
                margin-bottom: 10mm;
              }
              
              .print-container {
                display: flex;
                flex-direction: column;
                gap: 10mm;
              }
              
              .no-print {
                display: none !important;
              }
              
              /* Force background colors and images to print */
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Ensure images are printed */
              img {
                max-width: 100% !important;
                page-break-inside: avoid;
              }
              
              /* Maintain shadows in print */
              .shadow-sm {
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
                -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
              }
              
              /* Ensure borders print */
              .border, .border-2, .border-gray-300 {
                border-width: 2px !important;
                border-style: solid !important;
                border-color: #D1D5DB !important;
              }
              
              /* Fix rounded corners */
              .rounded-lg, .rounded-xl {
                border-radius: 0.5rem !important;
              }
            }
            
            /* Print-specific layout fixes */
            .print-card {
              width: 400px !important;
              height: 600px !important;
              margin: 0 auto !important;
              page-break-inside: avoid !important;
            }
            
            .print-label {
              width: 300px !important;
              height: 100px !important;
              margin: 0 auto !important;
              page-break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${Array.from(selectedItems).map(index => {
              const item = items[index];
              const cardHtml = document.querySelector(`[data-item-index="${index}"] .kanban-card`).outerHTML;
              const labelHtml = document.querySelector(`[data-item-index="${index}"] .bin-label`).outerHTML;
              
              return `
                <div class="page-break print-card">
                  ${cardHtml}
                </div>
                ${Array.from({ length: binLabelsCount }).map(() => `
                  <div class="page-break print-label">
                    ${labelHtml}
                  </div>
                `).join('')}
              `;
            }).join('')}
          </div>
          <script>
            window.onload = () => {
              // Small delay to ensure styles are applied
              setTimeout(() => window.print(), 500);
            };
          </script>
        </body>
      </html>
    `;

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