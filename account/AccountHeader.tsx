
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AccountHeaderProps {
  onLogout: () => void;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your orders
        </p>
      </div>
      <Button 
        variant="outline"
        className="mt-4 lg:mt-0 lg:self-start"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </div>
  );
};
