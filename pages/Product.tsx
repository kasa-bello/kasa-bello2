import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useProduct } from "@/hooks/useProducts";
import { ProductDisplay } from "@/types/product.types";
import { getProductById } from "@/lib/data";
import { ProductLoading } from "@/components/product/ProductLoading";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { ProductView } from "@/components/product/ProductView";
import { loadProductImagesBySku } from "@/utils/productSkuImageHelper";

const Product = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: supabaseProduct, isLoading: isLoadingSupabase } = useProduct(productId);
  const [mockProduct, setMockProduct] = useState<any>(null);
  const [isLoadingMock, setIsLoadingMock] = useState(true);
  const [productWithImages, setProductWithImages] = useState<ProductDisplay | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  
  // Effect to load mock product if available
  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      setMockProduct(product);
      setIsLoadingMock(false);
    }
  }, [productId]);
  
  // Determine which product to use (Supabase or mock)
  const product = supabaseProduct || mockProduct;
  
  // Effect to load images for the product
  useEffect(() => {
    const loadImages = async () => {
      if (!product || !productId) return;
      
      // Skip for mock products
      if (mockProduct) {
        setProductWithImages(product);
        return;
      }
      
      setIsLoadingImages(true);
      
      try {
        // If the product already has parsed images, use those
        if (product.parsedImages && product.parsedImages.length > 0) {
          setProductWithImages(product);
          return;
        }
        
        // Otherwise, try to load images by SKU
        const images = await loadProductImagesBySku(productId);
        
        if (images.length > 0) {
          // Create a new product object with the loaded images
          setProductWithImages({
            ...product,
            parsedImages: images
          });
        } else {
          // No images found, just use the original product
          setProductWithImages(product);
        }
      } catch (error) {
        console.error("Error loading product images:", error);
        setProductWithImages(product);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    if (product) {
      loadImages();
    }
  }, [product, productId, mockProduct]);
  
  // If still loading, show a loading state
  if (isLoadingSupabase || isLoadingMock || isLoadingImages) {
    return <ProductLoading />;
  }
  
  // If there was an error loading the product
  if (!productWithImages && !product) {
    return <ProductNotFound />;
  }
  
  return (
    <ProductView 
      product={productWithImages || product} 
      isMockProduct={!!mockProduct} 
    />
  );
};

export default Product;
