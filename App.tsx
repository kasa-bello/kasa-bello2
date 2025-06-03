import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import AllProducts from "./pages/AllProducts";
import ProductImport from "./pages/ProductImport";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Product from "./pages/Product";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { CartDrawer } from "./components/ui/CartDrawer";
import ImageAssignment from "./pages/ImageAssignment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CartDrawer />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/admin/import" element={<ProductImport />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/image-assignment" element={<ImageAssignment />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
