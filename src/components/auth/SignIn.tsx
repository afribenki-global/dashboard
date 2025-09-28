
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Facebook, Mail, Github } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SignInProps {
  onLogin: (userData: any) => void;
  onSwitchToSignUp: () => void;
}

export function SignIn({ onLogin, onSwitchToSignUp }: SignInProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    // Check against localStorage (registered user)
    const savedUser = localStorage.getItem('benki_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if ((userData.username === formData.username || userData.email === formData.username) && userData.password === formData.password) {
        onLogin(userData);
        return;
      }
    }
    // Check against default user
    const defaultUser = localStorage.getItem('benki_default_user');
    if (defaultUser) {
      const userData = JSON.parse(defaultUser);
      if ((userData.username === formData.username || userData.email === formData.username) && userData.password === formData.password) {
        onLogin(userData);
        return;
      }
    }
    setError('Invalid username or password');
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      toast.loading(`Signing in with ${provider}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const socialUser = {
        username: `user@${provider}.com`,
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider: provider,
        avatar: provider.charAt(0).toUpperCase() + provider.slice(1).charAt(0).toUpperCase(),
        country: 'Nigeria',
        signInMethod: 'social'
      };
      localStorage.setItem('benki_user', JSON.stringify(socialUser));
      toast.dismiss();
      toast.success(`Successfully signed in with ${provider}!`);
      onLogin(socialUser);
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Benki</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back to Benki
          </h2>
          <p className="text-orange-500 font-medium">Continue your wealth journey</p>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">Sign In</CardTitle>
            <CardDescription>
              Access your AI-powered wealth dashboard
            </CardDescription>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
              <strong>Demo Login:</strong><br />
              Username: <span className="font-mono">user@gmail.com</span><br />
              Password: <span className="font-mono">soonami</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="user@gmail.com"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            </form>
            {/* Social Login Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-full"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  className="w-full"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              New here?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Sign Up
              </button>
            </p>
          </CardFooter>
        </Card>
        <div className="text-center mt-6 text-sm text-gray-500">
          Powered by AfriBenki - Democratizing wealth for Africa's youth
        </div>
      </div>
    </div>
  );
}