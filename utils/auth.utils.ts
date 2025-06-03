
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User, Order } from '@/types/user.types';

export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error('Login failed', {
        description: error.message
      });
      return false;
    }
    
    toast.success('Login successful');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Login failed', {
      description: 'An unexpected error occurred'
    });
    return false;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) {
      toast.error('Registration failed', {
        description: error.message
      });
      return false;
    }
    
    toast.success('Registration successful', {
      description: `Welcome, ${name}!`
    });
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Registration failed', {
      description: 'An unexpected error occurred'
    });
    return false;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
    toast.info('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Logout failed', {
      description: 'An unexpected error occurred'
    });
  }
}

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!profile) return null;
    
    return {
      id: userId,
      email: '', // Will be updated by the caller
      name: profile.name || ''
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export function getDemoOrders(): Order[] {
  return [
    {
      id: '1001',
      date: '2023-10-15',
      total: 239.97,
      status: 'delivered',
      items: [
        { productId: '1', title: 'Modern Coffee Table', price: 129.99, quantity: 1 },
        { productId: '2', title: 'Ergonomic Office Chair', price: 54.99, quantity: 2 }
      ]
    },
    {
      id: '1002',
      date: '2023-11-22',
      total: 349.95,
      status: 'processing',
      items: [
        { productId: '3', title: 'Outdoor Patio Set', price: 349.95, quantity: 1 }
      ]
    }
  ];
}
