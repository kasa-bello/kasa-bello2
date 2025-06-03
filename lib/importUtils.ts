
// This file is maintained for backward compatibility
// New code should import directly from the specialized modules in /lib/import

// Re-export the main functions for backward compatibility
import { importProductsFromFile, importProductsToSupabase } from './import/fileImporter';

export { importProductsFromFile, importProductsToSupabase };
