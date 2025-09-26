import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  MessageCircle, 
  Search, 
  Filter,
  UserPlus,
  UserMinus,
  Target,
  BarChart3,
  Globe,
  Shield,
  Star,
  Send,
  Heart,
  Share2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CirclesProps {
  user: any;
}

export function Circles({ user }: CirclesProps) {
  const [circles, setCircles] = useState<any[]>([]);
  const [userCircles, setUserCircles] = useState<string[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [circleMembers, setCircleMembers] = useState<any[]>([]);
  const [circlePosts, setCirclePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [showCircleDetails, setShowCircleDetails] = useState(false);

  useEffect(() => {
    fetchCircles();
    fetchUserProfile();
  }, [user?.email]);

  useEffect(() => {
    if (selectedCircle) {
      fetchCircleMembers(selectedCircle.id);
      fetchCirclePosts(selectedCircle.id);
    }
  }, [selectedCircle]);

  const fetchCircles = async () => {
    try {
      setLoading(true);
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCircles(data);
      }
    } catch (error) {
      console.error('Error fetching circles:', error);
      toast.error('Failed to load circles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
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
        setUserCircles(profile.joinedCircles || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchCircleMembers = async (circleId: string) => {
    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles/${circleId}/members`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const members = await response.json();
        setCircleMembers(members);
      }
    } catch (error) {
      console.error('Error fetching circle members:', error);
    }
  };

  const fetchCirclePosts = async (circleId: string) => {
    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles/${circleId}/posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const posts = await response.json();
        setCirclePosts(posts);
      }
    } catch (error) {
      console.error('Error fetching circle posts:', error);
    }
  };

  const joinCircle = async (circleId: string) => {
    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles/${circleId}/join`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user?.email,
            userEmail: user?.email
          })
        }
      );

      if (response.ok) {
        setUserCircles([...userCircles, circleId]);
        toast.success('Successfully joined circle!');
        fetchCircles(); // Refresh to update member count
      } else {
        throw new Error('Failed to join circle');
      }
    } catch (error) {
      console.error('Error joining circle:', error);
      toast.error('Failed to join circle');
    }
  };

  const leaveCircle = async (circleId: string) => {
    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles/${circleId}/leave`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user?.email
          })
        }
      );

      if (response.ok) {
        setUserCircles(userCircles.filter(id => id !== circleId));
        toast.success('Left circle successfully');
        fetchCircles(); // Refresh to update member count
      } else {
        throw new Error('Failed to leave circle');
      }
    } catch (error) {
      console.error('Error leaving circle:', error);
      toast.error('Failed to leave circle');
    }
  };

  const createPost = async (circleId: string) => {
    if (!newPost.trim()) return;

    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/circles/${circleId}/posts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: newPost,
            userId: user?.email,
            userEmail: user?.email
          })
        }
      );

      if (response.ok) {
        const post = await response.json();
        setCirclePosts([post, ...circlePosts]);
        setNewPost('');
        toast.success('Post created successfully!');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCircles = circles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circle.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           circle.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(circles.map(c => c.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investment Circles</h2>
          <p className="text-gray-600">Join communities with shared investment interests</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Users className="h-3 w-3 mr-1" />
          {userCircles.length} Joined
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search circles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-md bg-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover Circles</TabsTrigger>
          <TabsTrigger value="my-circles">My Circles ({userCircles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCircles.map((circle) => (
                <Card key={circle.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={circle.image}
                        alt={circle.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-2 right-2 ${getRiskLevelColor(circle.riskLevel)}`}>
                        {circle.riskLevel}
                      </Badge>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{circle.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {circle.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {circle.memberCount} members
                        </div>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {circle.averageReturn}% avg return
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Total Investment:</span>
                          <span className="font-medium">${circle.totalInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Min Investment:</span>
                          <span className="font-medium">${circle.minInvestment}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {userCircles.includes(circle.id) ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => leaveCircle(circle.id)}
                              className="flex-1"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Leave
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCircle(circle);
                                setShowCircleDetails(true);
                              }}
                              className="flex-1"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => joinCircle(circle.id)}
                            className="w-full"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Join Circle
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-circles" className="space-y-6">
          {userCircles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Circles Joined</h3>
                <p className="text-gray-600 mb-4">
                  Join investment circles to connect with like-minded investors and share insights.
                </p>
                <Button onClick={() => setSelectedCategory('all')}>
                  Explore Circles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circles.filter(circle => userCircles.includes(circle.id)).map((circle) => (
                <Card key={circle.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={circle.image}
                        alt={circle.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                        <Star className="h-3 w-3 mr-1" />
                        Member
                      </Badge>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {circle.memberCount} members
                        </div>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {circle.averageReturn}% return
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCircle(circle);
                          setShowCircleDetails(true);
                        }}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        View Circle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Circle Details Modal */}
      <Dialog open={showCircleDetails} onOpenChange={setShowCircleDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedCircle && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <img
                    src={selectedCircle.image}
                    alt={selectedCircle.name}
                    className="w-8 h-8 rounded"
                  />
                  <span>{selectedCircle.name}</span>
                  <Badge className={getRiskLevelColor(selectedCircle.riskLevel)}>
                    {selectedCircle.riskLevel}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedCircle.description}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="discussion" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="discussion" className="space-y-4 mt-4">
                  {userCircles.includes(selectedCircle.id) && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your thoughts with the circle..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => createPost(selectedCircle.id)}
                          disabled={!newPost.trim()}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Post
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {circlePosts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {post.userEmail.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">
                                  {post.userEmail.split('@')[0]}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(post.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{post.content}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments?.length || 0}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                                  <Share2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {circlePosts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No discussions yet. Be the first to start!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="members" className="mt-4">
                  <div className="space-y-3">
                    {circleMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar>
                          <AvatarFallback>
                            {member.userEmail.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.userEmail.split('@')[0]}</p>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Performance</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Average Return:</span>
                            <span className="font-bold text-green-600">{selectedCircle.averageReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Investment:</span>
                            <span className="font-bold">${selectedCircle.totalInvestment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <Badge className={getRiskLevelColor(selectedCircle.riskLevel)}>
                              {selectedCircle.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">Community</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Members:</span>
                            <span className="font-bold">{selectedCircle.memberCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Posts Today:</span>
                            <span className="font-bold">{circlePosts.filter(p => 
                              new Date(p.timestamp).toDateString() === new Date().toDateString()
                            ).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activity Level:</span>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}