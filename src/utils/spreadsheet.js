import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { CATEGORIES } from '../constants/categories';

const EXPECTED_COLUMNS = {
  'Product Name': 'A',
  'Part Number': 'B',
  'Description': 'C',
  'Location': 'D',
  'Category': 'E',
  'Reorder Point': 'F',
  'Reorder QTY': 'G',
  'Unit Cost': 'H',
  'Supplier': 'I',
  'Order Link': 'J',
  'Product Image URL': 'K'
};

export async function processSpreadsheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Get headers and validate
        const headers = jsonData[0];
        const columnMapping = validateAndMapColumns(headers);
        
        // Process rows
        const processedItems = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row.length) continue; // Skip empty rows
          
          const item = mapRowToItem(row, columnMapping);
          
          // Process category
          if (!CATEGORIES[item.category]) {
            console.warn(`Unknown category: ${item.category}`);
            item.category = 'Other';
          }
          
          // Generate QR code
          try {
            item.qrCode = await generateQRCode(item.orderLink);
          } catch (error) {
            console.warn(`Failed to generate QR code for ${item.productName}:`, error);
            item.qrCode = await generateQRCode('https://example.com');
          }
          
          // Process image
          try {
            item.imageUrl = await processImage(item.imageUrl);
          } catch (error) {
            console.warn(`Failed to process image for ${item.productName}:`, error);
            item.imageUrl = 'https://via.placeholder.com/150';
          }
          
          processedItems.push(item);
        }
        
        resolve(processedItems);
      } catch (error) {
        reject(new Error('Failed to process spreadsheet: ' + error.message));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function validateAndMapColumns(headers) {
  const mapping = {};
  const foundColumns = new Set();
  
  headers.forEach((header, index) => {
    const normalizedHeader = header.trim();
    const expectedColumn = Object.entries(EXPECTED_COLUMNS).find(([name]) => 
      normalizedHeader.toLowerCase() === name.toLowerCase()
    );
    
    if (expectedColumn) {
      mapping[expectedColumn[0]] = index;
      foundColumns.add(expectedColumn[0]);
    }
  });
  
  // Check for missing required columns
  const requiredColumns = ['Product Name', 'Part Number', 'Category'];
  const missingRequired = requiredColumns.filter(col => !foundColumns.has(col));
  
  if (missingRequired.length > 0) {
    throw new Error(`Missing required columns: ${missingRequired.join(', ')}`);
  }
  
  return mapping;
}

function mapRowToItem(row, columnMapping) {
  return {
    productName: getString(row[columnMapping['Product Name']]),
    partNumber: getString(row[columnMapping['Part Number']]),
    description: getString(row[columnMapping['Description']]),
    location: getString(row[columnMapping['Location']]),
    category: getString(row[columnMapping['Category']]),
    reorderPoint: getNumber(row[columnMapping['Reorder Point']]),
    reorderQty: getNumber(row[columnMapping['Reorder QTY']]),
    unitCost: getNumber(row[columnMapping['Unit Cost']]),
    supplier: getString(row[columnMapping['Supplier']]),
    orderLink: getString(row[columnMapping['Order Link']]),
    imageUrl: getString(row[columnMapping['Product Image URL']])
  };
}

function getString(value) {
  return value ? String(value).trim() : '';
}

function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

async function generateQRCode(url) {
  try {
    return await QRCode.toDataURL(url || 'https://example.com', {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return await QRCode.toDataURL('https://example.com');
  }
}

async function processImage(url) {
  if (!url) return 'https://via.placeholder.com/150';
  
  try {
    // Validate URL
    new URL(url);
    
    // Create a temp image to check loading
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    
    return url;
  } catch (error) {
    console.warn('Invalid image URL:', url);
    return 'https://via.placeholder.com/150';
  }
}