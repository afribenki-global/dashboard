import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Copy,
  Share2,
  CheckCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  shareType?: 'success' | 'milestone' | 'tip' | 'general';
  defaultContent?: string;
}

export function SocialShare({ isOpen, onClose, user, shareType = 'general', defaultContent = '' }: SocialShareProps) {
  const [shareContent, setShareContent] = useState(defaultContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'blue',
      shareUrl: (text: string, url: string) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'sky',
      shareUrl: (text: string, url: string) => 
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=BenkiWealth,AfricanInvesting`
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'blue',
      shareUrl: (text: string, url: string) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'pink',
      shareUrl: (text: string, url: string) => 
        `https://www.instagram.com/` // Instagram requires app integration
    }
  ];

  const generateShareContent = () => {
    const baseUrl = 'https://afribenki.com';
    
    switch (shareType) {
      case 'success':
        return {
          text: `🎉 Just achieved a new milestone with @BenkiWealth! ${shareContent} \n\nJoin me in building wealth through Africa's leading AI investment assistant. #BenkiWealth #AfricanInvesting #WealthBuilding`,
          url: `${baseUrl}?ref=${user.email.split('@')[0]}`
        };
      case 'milestone':
        return {
          text: `💰 Milestone reached! ${shareContent} \n\nThanks to @BenkiWealth for making investing accessible for African youth. Start your journey today! #BenkiWealth #AfricanFintech`,
          url: `${baseUrl}?ref=${user.email.split('@')[0]}`
        };
      case 'tip':
        return {
          text: `💡 Investment Tip: ${shareContent} \n\nLearned this through @BenkiWealth's educational platform. Join thousands of Africans building wealth! #InvestmentTips #BenkiWealth`,
          url: `${baseUrl}/learn?ref=${user.email.split('@')[0]}`
        };
      default:
        return {
          text: shareContent || `Building my wealth with @BenkiWealth - Africa's AI-powered investment assistant! 🚀 \n\nJoin me and thousands of others on this journey to financial freedom. #BenkiWealth #AfricanInvesting`,
          url: `${baseUrl}?ref=${user.email.split('@')[0]}`
        };
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleCopyLink = async () => {
    const { url } = generateShareContent();
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleShare = async () => {
    if (!shareContent.trim()) {
      toast.error('Please write something to share');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsSharing(true);
    const { text, url } = generateShareContent();

    try {
      // Open share links for selected platforms
      selectedPlatforms.forEach(platformId => {
        const platform = platforms.find(p => p.id === platformId);
        if (platform) {
          if (platform.id === 'instagram') {
            // Instagram doesn't support direct web sharing
            toast.info('Please share manually on Instagram using the copied text');
          } else {
            const shareUrl = platform.shareUrl(text, url);
            window.open(shareUrl, '_blank', 'width=600,height=400');
          }
        }
      });

      // Post to local community feed (offline-first approach)
      try {
        const savedPosts = JSON.parse(localStorage.getItem('benki_social_posts') || '[]');
        const newPost = {
          id: Date.now(),
          user: {
            name: user.email?.split('@')[0] || user.name || 'Anonymous',
            country: user.country || 'Unknown',
            avatar: (user.email?.slice(0, 2) || user.name?.slice(0, 2) || 'AN').toUpperCase()
          },
          content: shareContent,
          likes: 0,
          comments: 0,
          timestamp: 'Just now',
          type: shareType
        };
        
        const updatedPosts = [newPost, ...savedPosts].slice(0, 50); // Keep only latest 50
        localStorage.setItem('benki_social_posts', JSON.stringify(updatedPosts));
      } catch (error) {
        console.log('Local community posting failed:', error.message);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully shared your story!');
      setShareContent('');
      setSelectedPlatforms([]);
      onClose();
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const getShareTypeIcon = () => {
    switch (shareType) {
      case 'success':
      case 'milestone':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'tip':
        return <Share2 className="h-5 w-5 text-blue-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-purple-600" />;
    }
  };

  const getShareTypeTitle = () => {
    switch (shareType) {
      case 'success':
        return 'Share Your Success';
      case 'milestone':
        return 'Share Your Milestone';
      case 'tip':
        return 'Share Investment Tip';
      default:
        return 'Share Your Journey';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getShareTypeIcon()}
            <span>{getShareTypeTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            Inspire others in the Benki community and beyond
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Message
            </label>
            <Textarea
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
              placeholder={
                shareType === 'success' 
                  ? "Share your investment success story..."
                  : shareType === 'milestone'
                  ? "Describe your achievement..."
                  : shareType === 'tip'
                  ? "Share your investment tip..."
                  : "Tell others about your Benki journey..."
              }
              className="min-h-[100px] border-green-200 focus:border-green-400"
              maxLength={280}
            />
            <p className="text-xs text-gray-500 mt-1">
              {shareContent.length}/280 characters
            </p>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Share On
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <Card 
                  key={platform.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? `border-${platform.color}-500 bg-${platform.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <CardContent className="p-3 flex items-center space-x-2">
                    {selectedPlatforms.includes(platform.id) && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <div className={`text-${platform.color}-600`}>
                      {platform.icon}
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          {shareContent && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {generateShareContent().text}
              </p>
            </div>
          )}

          {/* Copy Link Option */}
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Copy className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Share Link</p>
              <p className="text-xs text-blue-600">Copy your referral link to share anywhere</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Copy
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={isSharing || !shareContent.trim() || selectedPlatforms.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSharing ? 'Sharing...' : 'Share Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}