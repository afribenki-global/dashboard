import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Shield, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight 
} from 'lucide-react';

interface KYCNotificationBarProps {
  user: any;
  onKYCClick: () => void;
  onDismiss?: () => void;
}

export function KYCNotificationBar({ user, onKYCClick, onDismiss }: KYCNotificationBarProps) {
  const [kycStatus, setKycStatus] = useState('pending');
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCStatus();
    
    // Check if notification was previously dismissed today
    const dismissedToday = localStorage.getItem(`kyc_dismissed_${user?.email}_${new Date().toDateString()}`);
    if (dismissedToday) {
      setDismissed(true);
    }
  }, [user?.email]);

  const fetchKYCStatus = async () => {
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
        const profile = await response.json();
        setKycStatus(profile.kycStatus || 'pending');
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(`kyc_dismissed_${user?.email}_${new Date().toDateString()}`, 'true');
    onDismiss?.();
  };

  // Don't show if verified, loading, or dismissed
  if (loading || kycStatus === 'verified' || dismissed) {
    return null;
  }

  const getNotificationContent = () => {
    switch (kycStatus) {
      case 'submitted':
        return {
          icon: <Clock className="h-4 w-4 text-blue-600" />,
          badge: <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>,
          title: 'KYC Verification in Progress',
          description: 'Your documents are being reviewed. This usually takes 1-3 business days.',
          action: null,
          bgColor: 'bg-blue-50 border-blue-200',
          canDismiss: true
        };
      
      case 'rejected':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          badge: <Badge className="bg-red-100 text-red-800">Action Required</Badge>,
          title: 'KYC Verification Required',
          description: 'Your KYC was rejected. Please update your documents and try again.',
          action: (
            <Button size="sm" onClick={onKYCClick} className="bg-red-600 hover:bg-red-700">
              Resubmit KYC
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ),
          bgColor: 'bg-red-50 border-red-200',
          canDismiss: false
        };
      
      default: // pending
        return {
          icon: <Shield className="h-4 w-4 text-orange-600" />,
          badge: <Badge className="bg-orange-100 text-orange-800">Action Required</Badge>,
          title: 'Complete Your KYC Verification',
          description: 'Verify your identity to unlock all investment features and higher limits.',
          action: (
            <Button size="sm" onClick={onKYCClick} className="bg-orange-600 hover:bg-orange-700">
              Complete KYC
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ),
          bgColor: 'bg-orange-50 border-orange-200',
          canDismiss: true
        };
    }
  };

  const content = getNotificationContent();

  return (
    <Alert className={`${content.bgColor} mb-6`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 flex-1">
          {content.icon}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm">{content.title}</span>
              {content.badge}
            </div>
            <AlertDescription className="text-sm">
              {content.description}
            </AlertDescription>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {content.action}
          {content.canDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}