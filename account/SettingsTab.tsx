
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const SettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Password</h3>
          <Button variant="outline">Change Password</Button>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Notifications</h3>
          <p className="text-muted-foreground">
            Manage how we contact you about orders, updates, and account activity
          </p>
          <Button variant="outline">Notification Preferences</Button>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-muted-foreground">
            Permanently delete your account and all of your content
          </p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  );
};
