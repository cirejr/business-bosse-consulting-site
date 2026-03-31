'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, updatePassword } from '@/lib/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SettingsFormProps {
  user: {
    name: string;
    email: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsPasswordUpdating(false);
      return;
    }

    try {
      await updatePassword(formData);
      toast.success('Password updated successfully');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={isProfileUpdating}>
              {isProfileUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" disabled={isPasswordUpdating}>
              {isPasswordUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}