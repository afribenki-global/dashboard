import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Facebook, Mail, Github } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SignUpProps {
  onSignUp: (userData: any) => void;
  onSwitchToSignIn: () => void;
}

export function SignUp({ onSignUp, onSwitchToSignIn }: SignUpProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const countries = [
    'Nigeria',
    'Ghana', 
    'Kenya',
    'Côte d\'Ivoire',
    'South Africa',
    'Cameroon',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.email) newErrors.push('Email is required');
    if (!formData.email.includes('@')) newErrors.push('Please enter a valid email');
    if (!formData.phone) newErrors.push('Phone number is required');
    if (!formData.country) newErrors.push('Please select your country');
    if (!formData.password) newErrors.push('Password is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Store user data in localStorage
    const userData = {
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      password: formData.password,
      signupDate: new Date().toISOString()
    };
    
    localStorage.setItem('benki_user', JSON.stringify(userData));
    onSignUp(userData);
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      toast.loading(`Creating account with ${provider}...`);
      
      // Simulate social signup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock user data for social signup
      const socialUser = {
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider: provider,
        avatar: provider.charAt(0).toUpperCase() + provider.slice(1).charAt(0).toUpperCase(),
        country: 'Nigeria',
        phone: '+234 XXX XXX XXXX',
        signInMethod: 'social',
        signupDate: new Date().toISOString()
      };
      
      // Store user data
      localStorage.setItem('benki_user', JSON.stringify(socialUser));
      
      toast.dismiss();
      toast.success(`Account created successfully with ${provider}!`);
      onSignUp(socialUser);
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to create account with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Benki</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Join Benki - Start Building Wealth Today
          </h2>
          <p className="text-orange-500 font-medium">Turn chats into wealth</p>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">Create Your Account</CardTitle>
            <CardDescription>
              Join Africa's leading AI wealth assistant
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 801 234 5678"
                  className="border-green-200 focus:border-green-400"
                />
                <p className="text-sm text-gray-500 mt-1">Include country code (e.g., +234, +233)</p>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className="border-green-200 focus:border-green-400">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Sign Up
              </Button>
            </form>

            {/* Social SignUp Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignUp('google')}
                  className="w-full"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignUp('facebook')}
                  className="w-full"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignUp('github')}
                  className="w-full"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
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