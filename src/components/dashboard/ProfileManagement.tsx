import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  User, 
  Shield, 
  FileText, 
  Camera, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Upload,
  Edit
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileManagementProps {
  user: any;
  onProfileUpdate?: (profile: any) => void;
}

export function ProfileManagement({ user, onProfileUpdate }: ProfileManagementProps) {
  const [profile, setProfile] = useState<any>({});
  const [kycData, setKycData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchUserProfile();
  }, [user?.email]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/user-profile/${user?.email}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setKycData(profileData.kycData || {});
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      setSaving(true);
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/user-profile/${user?.email}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        onProfileUpdate?.(updatedProfile);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const submitKYC = async () => {
    try {
      setSaving(true);
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/kyc/${user?.email}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(kycData)
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        toast.success('KYC submitted successfully! Verification in progress...');
      } else {
        throw new Error('Failed to submit KYC');
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      toast.error('Failed to submit KYC');
    } finally {
      setSaving(false);
    }
  };

  const getKYCStatusBadge = () => {
    switch (profile.kycStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const calculateProfileCompletion = () => {
    const requiredFields = [
      'firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 
      'address', 'city', 'country', 'occupation', 'annualIncome'
    ];
    
    const completedFields = requiredFields.filter(field => profile[field]?.trim()).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Complete Your Profile</AlertTitle>
          <AlertDescription className="text-orange-700">
            Your profile is {profileCompletion}% complete. Complete your profile to unlock all features.
            <Progress value={profileCompletion} className="mt-2 h-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* KYC Status Alert */}
      {profile.kycStatus !== 'verified' && (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">KYC Verification Required</AlertTitle>
          <AlertDescription className="text-blue-700">
            Complete your KYC verification to access all investment features and higher limits.
            {getKYCStatusBadge()}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Financial Profile</span>
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>KYC Verification</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName || ''}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName || ''}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={profile.phoneNumber || ''}
                    onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth || ''}
                    onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select 
                    value={profile.country || ''} 
                    onValueChange={(value) => setProfile({...profile, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="ghana">Ghana</SelectItem>
                      <SelectItem value="south-africa">South Africa</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                      <SelectItem value="rwanda">Rwanda</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city || ''}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                  placeholder="Enter your city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => updateProfile(profile)} 
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Personal Info'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Financial Profile</span>
              </CardTitle>
              <CardDescription>
                Help us understand your financial situation and investment goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    value={profile.occupation || ''}
                    onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                    placeholder="Your profession or job title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (USD) *</Label>
                  <Select 
                    value={profile.annualIncome || ''} 
                    onValueChange={(value) => setProfile({...profile, annualIncome: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-plus">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentExperience">Investment Experience</Label>
                  <Select 
                    value={profile.investmentExperience || ''} 
                    onValueChange={(value) => setProfile({...profile, investmentExperience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-5 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (5+ years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select 
                    value={profile.riskTolerance || ''} 
                    onValueChange={(value) => setProfile({...profile, riskTolerance: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="very-aggressive">Very Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => updateProfile(profile)} 
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Financial Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>KYC Verification</span>
                {getKYCStatusBadge()}
              </CardTitle>
              <CardDescription>
                Complete your Know Your Customer verification to unlock all features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.kycStatus === 'verified' ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">KYC Verified</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your identity has been successfully verified. You have access to all platform features.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Document Type *</Label>
                    <Select 
                      value={kycData.idType || ''} 
                      onValueChange={(value) => setKycData({...kycData, idType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national-id">National ID</SelectItem>
                        <SelectItem value="passport">International Passport</SelectItem>
                        <SelectItem value="drivers-license">Driver's License</SelectItem>
                        <SelectItem value="voters-card">Voter's Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      value={kycData.idNumber || ''}
                      onChange={(e) => setKycData({...kycData, idNumber: e.target.value})}
                      placeholder="Enter your ID number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bvn">BVN (Nigerian users)</Label>
                    <Input
                      id="bvn"
                      value={kycData.bvn || ''}
                      onChange={(e) => setKycData({...kycData, bvn: e.target.value})}
                      placeholder="Enter your BVN (if applicable)"
                      maxLength={11}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Document Upload</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload a clear photo of your ID document
                      </p>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selfie Verification</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Take a selfie holding your ID document
                      </p>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Selfie
                      </Button>
                    </div>
                  </div>

                  {profile.kycStatus !== 'submitted' && (
                    <Button 
                      onClick={submitKYC} 
                      disabled={saving || !kycData.idType || !kycData.idNumber}
                      className="w-full md:w-auto"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {saving ? 'Submitting...' : 'Submit KYC Verification'}
                    </Button>
                  )}

                  {profile.kycStatus === 'submitted' && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">KYC Under Review</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Your KYC documents are being reviewed. This usually takes 1-3 business days.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}