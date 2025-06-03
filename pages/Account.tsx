
import React, { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Package, Settings, User as UserIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Import our new components
import { AccountHeader } from '@/components/account/AccountHeader';
import { ProfileTab } from '@/components/account/ProfileTab';
import { OrdersTab } from '@/components/account/OrdersTab';
import { SettingsTab } from '@/components/account/SettingsTab';

const Account = () => {
  const { user, orders, logout, isAuthenticated } = useUser();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto py-10 px-4">
        <AccountHeader onLogout={handleLogout} />
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileTab user={user} />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <OrdersTab orders={orders} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
