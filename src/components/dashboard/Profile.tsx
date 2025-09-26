import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProfileManagement } from './ProfileManagement';
import { Circles } from './Circles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Users, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  user: any;
}

export function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || ''
  });

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
  };

  const handleSave = () => {
    // Update user data in localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('benki_user', JSON.stringify(updatedUser));
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || ''
    });
    setIsEditing(false);
  };

  const signupDate = user.signupDate ? new Date(user.signupDate).toLocaleDateString() : 'Not available';

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-orange-700">Your Profile</CardTitle>
          <CardDescription className="text-orange-600">
            Manage your personal information, KYC, and community connections
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Manage Profile</span>
          </TabsTrigger>
          <TabsTrigger value="circles" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Circles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-gray-900">Personal Information</CardTitle>
            <CardDescription>Keep your contact details up to date</CardDescription>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave}
                size="sm"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-orange-200 focus:border-orange-400"
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
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
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
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <Label className="text-sm text-gray-600">Email Address</Label>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <Label className="text-sm text-gray-600">Phone Number</Label>
                  <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <Label className="text-sm text-gray-600">Country</Label>
                  <p className="font-medium text-gray-900">{user.country || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <Label className="text-sm text-gray-600">Member Since</Label>
                  <p className="font-medium text-gray-900">{signupDate}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Account Statistics</CardTitle>
          <CardDescription>Your Benki journey so far</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {JSON.parse(localStorage.getItem(`benki_portfolio_${user.email}`) || '[]').length}
              </div>
              <div className="text-sm text-green-600">Active Investments</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">18%</div>
              <div className="text-sm text-blue-600">Avg Returns</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">A+</div>
              <div className="text-sm text-purple-600">Credit Rating</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">Gold</div>
              <div className="text-sm text-orange-600">Member Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Financial Goals</CardTitle>
          <CardDescription>Track your progress towards financial freedom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Emergency Fund</span>
                <span className="text-sm text-gray-600">60% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">$300 of $500 goal</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Investment Portfolio</span>
                <span className="text-sm text-gray-600">25% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">$250 of $1,000 goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="profile">
          <ProfileManagement user={user} />
        </TabsContent>

        <TabsContent value="circles">
          <Circles user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}