
import * as XLSX from 'xlsx';
import { Product } from '../data';
import { normalizeHeader, validateRequiredHeaders } from './headerUtils';
import { convertRowsToProducts } from './productConverter';

// Function to import products from Excel file
export const importProductsFromExcel = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          throw new Error("Failed to read file");
        }
        
        // Parse Excel file
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert worksheet to array of arrays
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (rows.length <= 1) {
          throw new Error("Excel file appears to be empty or has only headers");
        }
        
        // Log the actual headers found
        console.log("Excel Headers found:", rows[0]);
        
        // Normalize headers (case-insensitive)
        const normalizedHeaders = rows[0].map(header => 
          typeof header === 'string' ? normalizeHeader(header) : '');
        console.log("Normalized headers:", normalizedHeaders);
        
        // Check for required headers
        const missingHeaders = validateRequiredHeaders(normalizedHeaders);
        
        if (missingHeaders.length > 0) {
          // Show what headers were found to help debugging
          const foundHeaders = rows[0].join(", ");
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}. Found headers: ${foundHeaders}`);
        }
        
        // Convert rows to products
        const products = convertRowsToProducts(rows);
        
        if (products.length === 0) {
          throw new Error("No valid products found in the Excel file. Please check your data format.");
        }
        
        console.log(`Successfully parsed ${products.length} products from Excel`);
        resolve(products);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
