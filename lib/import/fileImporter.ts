
import { Product } from '../data';
import { importProductsFromCSV } from './csvImporter';
import { importProductsFromExcel } from './excelImporter';
import { importProductsToSupabase } from './supabaseImporter';

// Unified function to import products from any supported file format
export const importProductsFromFile = async (file: File): Promise<Product[]> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'csv') {
    return importProductsFromCSV(file);
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    return importProductsFromExcel(file);
  } else {
    throw new Error(`Unsupported file format: ${fileType}. Please upload a CSV or Excel file.`);
  }
};

// Re-export the Supabase importer for convenience
export { importProductsToSupabase };
