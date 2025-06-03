
import { Product } from '../data';
import { normalizeHeader, validateRequiredHeaders } from './headerUtils';
import { convertRowsToProducts } from './productConverter';

// Function to detect the delimiter used in a CSV file
const detectDelimiter = (firstLine: string): string => {
  // Check for common delimiters and return the one that appears most frequently
  const delimiters = [',', ';', '\t', '|'];
  let maxCount = 0;
  let bestDelimiter = ','; // Default to comma

  for (const delimiter of delimiters) {
    const count = (firstLine.match(new RegExp(delimiter, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  }

  console.log(`Detected delimiter: "${bestDelimiter}" (found ${maxCount} occurrences)`);
  return bestDelimiter;
};

// Function to parse CSV data with automatic delimiter detection
export const parseCSV = (text: string): string[][] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Detect the delimiter from the first line (headers)
  const delimiter = detectDelimiter(lines[0]);
  
  return lines.map(line => {
    // Custom parsing to handle quoted fields with delimiters
    const result: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    
    // Add the last cell
    if (cell) {
      result.push(cell.trim());
    }
    
    return result;
  });
};

// Function to import products from CSV file
export const importProductsFromCSV = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) {
          throw new Error("Failed to read file");
        }
        
        const rows = parseCSV(csvText);
        
        if (rows.length <= 1) {
          throw new Error("CSV file appears to be empty or has only headers");
        }
        
        // Log the actual headers found
        console.log("CSV Headers found:", rows[0]);
        
        // Normalize headers (case-insensitive)
        const normalizedHeaders = rows[0].map(header => normalizeHeader(header));
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
          throw new Error("No valid products found in the CSV file. Please check your data format.");
        }
        
        console.log(`Successfully parsed ${products.length} products from CSV`);
        resolve(products);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };
    
    reader.readAsText(file);
  });
};
