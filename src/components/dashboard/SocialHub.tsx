import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Circles } from './Circles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  Users, 
  Share2, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Trophy,
  Send,
  Plus,
  Star,
  Target,
  DollarSign,
  ExternalLink,
  Globe,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { SocialShare } from '../social/SocialShare';

interface SocialHubProps {
  user: any;
}

export function SocialHub({ user }: SocialHubProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  // Sample social data
  const samplePosts = [
    {
      id: 1,
      user: { name: 'Amara K.', country: 'Nigeria', avatar: 'AK' },
      content: 'Just hit my first $1000 in investments! 🎉 Started with $100 three months ago thanks to Benki\'s guidance. The Nigerian High-Yield Bonds have been incredible!',
      achievement: 'First $1K Milestone',
      likes: 47,
      comments: 12,
      timestamp: '2 hours ago',
      type: 'milestone'
    },
    {
      id: 2,
      user: { name: 'David M.', country: 'Kenya', avatar: 'DM' },
      content: 'Quick tip: Diversifying across the Kenyan Equities Fund and Ghanaian Savings has reduced my portfolio risk by 30% while maintaining 14% returns. Don\'t put all eggs in one basket! 🧺',
      likes: 23,
      comments: 8,
      timestamp: '5 hours ago',
      type: 'tip'
    },
    {
      id: 3,
      user: { name: 'Sarah T.', country: 'South Africa', avatar: 'ST' },
      content: 'Celebrating 6 months with Benki! My portfolio grew from $300 to $450. The AI assistant really helped me understand risk management. Here\'s to financial freedom! 🚀',
      achievement: '6-Month Journey',
      likes: 89,
      comments: 24,
      timestamp: '1 day ago',
      type: 'milestone'
    },
    {
      id: 4,
      user: { name: 'Emmanuel C.', country: 'Ghana', avatar: 'EC' },
      content: 'PSA: The West African Tech Startups fund just announced a 25% quarterly return! High risk but incredible potential. Perfect for those with higher risk tolerance.',
      likes: 15,
      comments: 6,
      timestamp: '2 days ago',
      type: 'update'
    }
  ];

  const topInvestors = [
    { name: 'Fatima A.', country: 'Nigeria', returns: '28%', rank: 1, avatar: 'FA' },
    { name: 'Joseph K.', country: 'Kenya', returns: '24%', rank: 2, avatar: 'JK' },
    { name: 'Grace O.', country: 'Ghana', returns: '22%', rank: 3, avatar: 'GO' },
    { name: 'Marcus S.', country: 'South Africa', returns: '21%', rank: 4, avatar: 'MS' },
    { name: user.email.split('@')[0], country: user.country, returns: '18%', rank: 12, avatar: user.email.slice(0, 2).toUpperCase() }
  ];

  useEffect(() => {
    // Load social feed from localStorage or use sample data (offline-first approach)
    const loadSocialFeed = () => {
      const savedPosts = localStorage.getItem('benki_social_posts');
      if (savedPosts) {
        try {
          const parsed = JSON.parse(savedPosts);
          setPosts(parsed);
        } catch (error) {
          console.log('Invalid saved posts, using sample data');
          setPosts(samplePosts);
          localStorage.setItem('benki_social_posts', JSON.stringify(samplePosts));
        }
      } else {
        setPosts(samplePosts);
        localStorage.setItem('benki_social_posts', JSON.stringify(samplePosts));
      }
    };

    loadSocialFeed();
  }, []);

  const handleSharePost = async () => {
    if (!newPost.trim()) {
      toast.error('Please write something to share');
      return;
    }

    const postData = {
      content: newPost,
      user: { 
        name: user.email.split('@')[0], 
        country: user.country || 'Unknown', 
        avatar: user.email.slice(0, 2).toUpperCase() 
      },
      type: 'update'
    };

    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/social-post`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }
      );

      if (response.ok) {
        const newPost = await response.json();
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem('benki_social_posts', JSON.stringify(updatedPosts));
        
        setNewPost('');
        setShowShareForm(false);
        toast.success('Your story has been shared with the community!');
      } else {
        throw new Error('Failed to post to server');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      
      // Fallback to local storage
      const post = {
        id: Date.now(),
        ...postData,
        likes: 0,
        comments: 0,
        timestamp: 'Just now'
      };

      const updatedPosts = [post, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('benki_social_posts', JSON.stringify(updatedPosts));
      
      setNewPost('');
      setShowShareForm(false);
      toast.success('Your story has been shared locally!');
    }
  };

  const handleLike = (postId: number) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('benki_social_posts', JSON.stringify(updatedPosts));
    toast.success('Liked!');
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'tip':
        return <Star className="h-4 w-4 text-blue-600" />;
      default:
        return <Share2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Ghana': '🇬🇭',
      'South Africa': '🇿🇦',
      'Cameroon': '🇨🇲',
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-purple-700 flex items-center justify-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Benki Community</span>
          </CardTitle>
          <CardDescription className="text-purple-600">
            Connect, share, and learn from fellow African investors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-700">12,847</div>
              <div className="text-sm text-purple-600">Active Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">$2.3M</div>
              <div className="text-sm text-green-600">Total Invested</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">18.5%</div>
              <div className="text-sm text-blue-600">Avg Returns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Community Feed</span>
          </TabsTrigger>
          <TabsTrigger value="circles" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Investment Circles</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Share Your Story */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-green-600" />
                  <span>Share Your Journey</span>
                </span>
                <Button
                  onClick={() => setShowShareForm(!showShareForm)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardTitle>
            </CardHeader>
            {showShareForm && (
              <CardContent className="space-y-4">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your investment milestone, tip, or success story..."
                  className="min-h-[100px] border-green-200 focus:border-green-400"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowShareForm(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSharePost}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Post
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Feed Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-500 text-white">
                        {post.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{post.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {getCountryFlag(post.user.country)} {post.user.country}
                        </span>
                        {post.achievement && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Trophy className="h-3 w-3 mr-1" />
                            {post.achievement}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                      </div>
                      
                      <p className="text-gray-800 leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center space-x-4 pt-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <div className="flex items-center space-x-1 text-gray-400">
                          {getPostIcon(post.type)}
                          <span className="text-sm capitalize">{post.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Investors Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-700">
                <Trophy className="h-5 w-5" />
                <span>Top Performers</span>
              </CardTitle>
              <CardDescription>This month's highest returns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topInvestors.map((investor, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    investor.name === user.email.split('@')[0] 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      investor.rank <= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {investor.rank}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs">
                        {investor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{investor.name}</p>
                      <p className="text-xs text-gray-500">
                        {getCountryFlag(investor.country)} {investor.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{investor.returns}</div>
                    <div className="text-xs text-gray-500">Returns</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Challenges */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Target className="h-5 w-5" />
                <span>Community Challenges</span>
              </CardTitle>
              <CardDescription>Join monthly investment goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">Save $50 in January</span>
                  <Badge className="bg-blue-100 text-blue-800">87% joined</Badge>
                </div>
                <div className="text-sm text-blue-600 mb-2">2,847 participants</div>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Challenge
                </Button>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Diversify Portfolio</span>
                  <Badge className="bg-green-100 text-green-800">New</Badge>
                </div>
                <div className="text-sm text-green-600 mb-2">Invest in 3+ asset types</div>
                <Button size="sm" variant="outline" className="w-full border-green-300 text-green-700">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-purple-200 bg-gradient-to-b from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-purple-700">Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Posts shared</span>
                <span className="font-medium">
                  {posts.filter(p => p.user.name === user.email.split('@')[0]).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Likes received</span>
                <span className="font-medium">
                  {posts
                    .filter(p => p.user.name === user.email.split('@')[0])
                    .reduce((sum, p) => sum + p.likes, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Community rank</span>
                <span className="font-medium text-green-600">#12</span>
              </div>
              <Separator />
              <div className="text-center space-y-2">
                <div className="text-sm text-purple-600 mb-1">Help others invest wisely!</div>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                  onClick={() => setShowSocialShare(true)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Share Success
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="circles">
          <Circles user={user} />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Top Investors Leaderboard - Full View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-700">
                <Trophy className="h-5 w-5" />
                <span>Community Leaderboard</span>
              </CardTitle>
              <CardDescription>Top performers across all investment categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topInvestors.map((investor, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${ 
                    investor.name === user.email.split('@')[0] 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${ 
                      investor.rank <= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {investor.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                        {investor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{investor.name}</p>
                      <p className="text-sm text-gray-500">
                        {getCountryFlag(investor.country)} {investor.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">{investor.returns}</div>
                    <div className="text-sm text-gray-500">This Month</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Challenges - Full View */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Target className="h-5 w-5" />
                <span>Active Community Challenges</span>
              </CardTitle>
              <CardDescription>Join monthly investment goals and compete with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-blue-800 text-lg">Save $50 Challenge</span>
                  <Badge className="bg-blue-100 text-blue-800">87% joined</Badge>
                </div>
                <div className="text-sm text-blue-600 mb-2">2,847 participants • Ends Jan 31st</div>
                <div className="text-sm text-gray-600 mb-4">Save at least $50 across any investment vehicle this month. Top savers get bonus rewards!</div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join Challenge
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    View Rankings
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-green-800 text-lg">Portfolio Diversification</span>
                  <Badge className="bg-green-100 text-green-800">New</Badge>
                </div>
                <div className="text-sm text-green-600 mb-2">1,234 participants • Ongoing</div>
                <div className="text-sm text-gray-600 mb-4">Invest in 3+ different asset types to reduce risk and maximize potential returns.</div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join Challenge
                  </Button>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-purple-800 text-lg">African Markets Master</span>
                  <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
                </div>
                <div className="text-sm text-purple-600 mb-2">567 participants • Feb Challenge</div>
                <div className="text-sm text-gray-600 mb-4">Invest in markets from 3+ African countries. Learn about continental opportunities!</div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join Challenge
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social Share Modal */}
      <SocialShare 
        isOpen={showSocialShare} 
        onClose={() => setShowSocialShare(false)} 
        user={user}
        shareType="general"
      />
    </div>
  );
}