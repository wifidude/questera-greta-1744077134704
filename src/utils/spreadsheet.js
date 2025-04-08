import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { CATEGORIES } from '../constants/categories';

// Add location colors mapping
export const LOCATION_COLORS = {
  'A': '#f0f9ff', // Light blue
  'B': '#fef2f2', // Light red
  'C': '#f0fdf4', // Light green
  'D': '#faf5ff', // Light purple
  'E': '#fff7ed', // Light orange
  'F': '#f8fafc', // Light gray
  'G': '#fdf2f8', // Light pink
  'H': '#fffbeb', // Light yellow
};

// Utility functions for data type conversion
function getString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function getNumber(value) {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Required columns for the spreadsheet
const REQUIRED_COLUMNS = [
  'Product Name',
  'Part Number',
  'Description',
  'Location',
  'Category',
  'Reorder Point',
  'Reorder QTY',
  'Unit Cost',
  'Supplier',
  'Order Link',
  'Product Image URL'
];

// Map spreadsheet row to item object
function mapRowToItem(row, columnMapping) {
  return {
    productName: getString(row[columnMapping['Product Name']]),
    partNumber: getString(row[columnMapping['Part Number']]),
    description: getString(row[columnMapping['Description']]),
    location: getString(row[columnMapping['Location']]),
    category: getString(row[columnMapping['Category']]),
    reorderPoint: getString(row[columnMapping['Reorder Point']]),
    reorderQty: getNumber(row[columnMapping['Reorder QTY']]),
    unitCost: getNumber(row[columnMapping['Unit Cost']]),
    supplier: getString(row[columnMapping['Supplier']]),
    orderLink: getString(row[columnMapping['Order Link']]),
    imageUrl: getString(row[columnMapping['Product Image URL']])
  };
}

// Validate the spreadsheet structure
function validateSpreadsheet(worksheet) {
  const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
  const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  return headers.reduce((acc, header, index) => {
    if (REQUIRED_COLUMNS.includes(header)) {
      acc[header] = index;
    }
    return acc;
  }, {});
}

// Generate QR code for an item
async function generateQRCode(url) {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return '';
  }
}

// Process the spreadsheet file
export async function processSpreadsheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Validate spreadsheet structure
        const columnMapping = validateSpreadsheet(worksheet);
        
        // Convert worksheet to JSON
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
        
        // Process each row
        const items = await Promise.all(rows.map(async (row) => {
          const item = mapRowToItem(row, columnMapping);
          
          // Generate QR code if order link exists
          if (item.orderLink) {
            item.qrCode = await generateQRCode(item.orderLink);
          }
          
          // Validate category
          if (!CATEGORIES[item.category]) {
            console.warn(`Unknown category: ${item.category}`);
          }
          
          return item;
        }));
        
        resolve(items);
      } catch (error) {
        reject(new Error(`Failed to process spreadsheet: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}