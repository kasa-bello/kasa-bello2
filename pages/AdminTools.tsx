
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { StorageCleanup } from "@/components/admin/StorageCleanup";
import { StorageTools } from "@/components/admin/StorageTools";

const AdminTools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Tools</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Advanced tools for system maintenance and management
            </p>
            
            <div className="max-w-2xl">
              <StorageTools />
              <StorageCleanup />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminTools;
