
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProductDisplay } from "@/types/product.types";
import { ProductImageGallery } from "./gallery/ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { useState, useEffect } from "react";
import { findImagesBySku } from "@/components/diagnostic/hooks/services/productImageService";
import { toast } from "sonner";

interface ProductViewProps {
  product: ProductDisplay | any;
  isMockProduct: boolean;
}

export const ProductView = ({ product, isMockProduct }: ProductViewProps) => {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  
  // Load images specifically for this product
  useEffect(() => {
    const loadProductImages = async () => {
      // Skip for mock products, they already have images
      if (isMockProduct) {
        setProductImages(product.images || []);
        return;
      }
      
      setIsLoadingImages(true);
      
      try {
        console.log("Starting to load images for product:", product.id);
        let imagesList: string[] = [];
        
        // For Supabase products, first try to use the parsedImages array
        if (product.parsedImages && product.parsedImages.length > 0) {
          console.log("Using parsed images from product data:", product.parsedImages);
          imagesList = [...product.parsedImages];
        }
        // If no parsedImages, try to parse the Images JSON field
        else if (product.images && typeof product.images === 'string') {
          try {
            const parsed = JSON.parse(product.images);
            const images = Array.isArray(parsed) ? parsed : [parsed];
            console.log("Parsed images from JSON:", images);
            imagesList = [...images];
          } catch (e) {
            console.error("Failed to parse product images JSON:", e);
          }
        }
        
        // Try to find by SKU
        if (product.id) {
          console.log("Searching for images by SKU:", product.id);
          const skuImages = await findImagesBySku(product.id);
          
          if (skuImages.length > 0) {
            console.log("Found images by SKU:", skuImages);
            // Add SKU images to the list if we haven't already added them
            const newImages = skuImages.filter(img => !imagesList.includes(img));
            if (newImages.length > 0) {
              console.log("Adding new SKU images:", newImages);
              imagesList = [...imagesList, ...newImages];
            }
          }
        }
        
        // If we have images from any source, set them
        if (imagesList.length > 0) {
          console.log(`Setting ${imagesList.length} product images`);
          setProductImages(imagesList);
        } 
        // If still no images, use the imageUrl if available
        else if (product.imageUrl && product.imageUrl !== '/placeholder.svg') {
          console.log("Using imageUrl:", product.imageUrl);
          setProductImages([product.imageUrl]);
        } else {
          console.log("No images found for product, using placeholder");
          setProductImages(['/placeholder.svg']);
        }
      } catch (error) {
        console.error("Error loading product images:", error);
        toast.error("Error loading product images", {
          description: "Please try refreshing the page"
        });
        setProductImages(['/placeholder.svg']);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    loadProductImages();
  }, [product.id, isMockProduct, product.parsedImages, product.images, product.imageUrl]);
  
  const productTitle = isMockProduct 
    ? product.title 
    : (product.title || 'Untitled Product');
  
  const productPrice = isMockProduct 
    ? product.price 
    : (product.price || 0);
  
  const productDescription = isMockProduct 
    ? product.description 
    : (product.description || 'No description available');
  
  const productCategory = isMockProduct 
    ? product.category 
    : (product.category || '');
  
  const features = isMockProduct 
    ? product.features || ["Premium quality", "Sustainable materials", "Easy assembly", "1-year warranty"]
    : ["Premium quality", "Sustainable materials", "Easy assembly", "1-year warranty"];
  
  // Final fallback: if we still don't have images, use placeholder
  const displayImages = productImages.length > 0 
    ? productImages 
    : ['/placeholder.svg'];
  
  console.log("Product images for display:", displayImages); // For debugging
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Breadcrumbs */}
        <div className="container px-4 md:px-6 py-4">
          <ProductBreadcrumbs
            productTitle={productTitle}
            productCategory={productCategory}
          />
        </div>
        
        {/* Product Main */}
        <div className="container px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <ProductImageGallery images={displayImages} title={productTitle} />
            
            {/* Product Info */}
            <ProductInfo
              product={product}
              isMockProduct={isMockProduct}
              title={productTitle}
              price={productPrice}
              description={productDescription}
              features={features}
              images={displayImages}
            />
          </div>
        </div>
        
        {/* Product Tabs */}
        <ProductTabs 
          description={productDescription} 
          product={product}
          isMockProduct={isMockProduct}
        />
      </main>
      
      <Footer />
    </div>
  );
};
