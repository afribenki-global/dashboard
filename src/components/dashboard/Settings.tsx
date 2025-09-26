import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Shield,
  Smartphone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  user: any;
  onLogout: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    investment: true,
    security: true
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== user.password) {
      toast.error('Current password is incorrect');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Update password in localStorage
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('benki_user', JSON.stringify(updatedUser));
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast.success('Password updated successfully!');
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast.success('Notification preferences updated');
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle dark mode class on document
    document.documentElement.classList.toggle('dark');
    toast.success(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-purple-700">Account Settings</CardTitle>
          <CardDescription className="text-purple-600">
            Manage your security, notifications, and preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Lock className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Update Password
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security Features</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Two-Factor Authentication</p>
                  <p className="text-sm text-green-600">Add an extra layer of security</p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-800">Login Alerts</p>
                  <p className="text-sm text-blue-600">Get notified of new logins</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications on mobile</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Investment Updates</p>
                  <p className="text-sm text-gray-600">Get notified about portfolio changes</p>
                </div>
              </div>
              <Switch 
                checked={notifications.investment}
                onCheckedChange={(checked) => handleNotificationChange('investment', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Security Alerts</p>
                  <p className="text-sm text-gray-600">Important security notifications</p>
                </div>
              </div>
              <Switch 
                checked={notifications.security}
                onCheckedChange={(checked) => handleNotificationChange('security', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>Customize how Benki looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="h-5 w-5 text-gray-500" /> : <Sun className="h-5 w-5 text-gray-500" />}
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Account Actions</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
            
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium">Need help?</p>
              <p className="text-sm text-red-600">
                Contact our support team at support@afribenki.com or visit our help center.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}