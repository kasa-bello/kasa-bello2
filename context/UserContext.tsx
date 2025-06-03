
import React, { createContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, Order, UserContextType } from '@/types/user.types';
import { loginUser, registerUser, logoutUser, fetchUserProfile, getDemoOrders } from '@/utils/auth.utils';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            setUser({
              ...profile,
              email: session.user.email || '',
            });
          }
          
          // Load demo orders
          setOrders(getDemoOrders());
        } else {
          setUser(null);
          setOrders([]);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await loginUser(email, password);
    setIsLoading(false);
    return success;
  };
  
  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await registerUser(name, email, password);
    setIsLoading(false);
    return success;
  };
  
  // Logout function
  const logout = async () => {
    await logoutUser();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        orders,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
