
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user.types';

interface ProfileTabProps {
  user: User;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </CardContent>
    </Card>
  );
};
