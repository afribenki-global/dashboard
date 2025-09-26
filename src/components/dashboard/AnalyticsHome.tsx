import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart3,
  Plus,
  Share2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { AddFundsModal } from './AddFundsModal';
import { InvestmentFlowModal } from './InvestmentFlowModal';
import { SocialShare } from '../social/SocialShare';

interface AnalyticsHomeProps {
  user: any;
}

export function AnalyticsHome({ user }: AnalyticsHomeProps) {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [marketStatus, setMarketStatus] = useState('loading');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showInvestmentFlow, setShowInvestmentFlow] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  // Sample market data for demonstration
  const portfolioChartData = [
    { month: 'Jan', value: 300, growth: 0 },
    { month: 'Feb', value: 315, growth: 5 },
    { month: 'Mar', value: 330, growth: 10 },
    { month: 'Apr', value: 345, growth: 15 },
    { month: 'May', value: 365, growth: 21.7 },
    { month: 'Jun', value: 380, growth: 26.7 },
  ];

  const marketIndicesData = [
    { name: 'NGX ASI', value: 104250.5, change: 2.3, status: 'up' },
    { name: 'JSE All Share', value: 78450.2, change: -0.8, status: 'down' },
    { name: 'GSE CI', value: 3245.7, change: 1.2, status: 'up' },
    { name: 'NSE 20', value: 1875.3, change: 0.5, status: 'up' },
  ];

  const topPerformers = [
    { name: 'Nigerian Bonds', return: '16.2%', risk: 'Low', color: 'green' },
    { name: 'Kenyan Equities', return: '14.8%', risk: 'Medium', color: 'blue' },
    { name: 'Tech Startups', return: '25.1%', risk: 'High', color: 'purple' },
    { name: 'African REITs', return: '12.4%', risk: 'Medium', color: 'orange' },
  ];

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem(`benki_portfolio_${user.email}`);
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    // Fetch real-time market data from backend with robust fallback
    const fetchMarketData = async () => {
      try {
        setMarketStatus('loading');
        
        // Try to fetch from backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/market-data`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMarketData(data);
            setMarketStatus('success');
            return;
          }
        }
        
        // If we get here, API didn't return good data
        throw new Error('Invalid API response');
      } catch (error) {
        // Use fallback data with simulated real-time updates
        const simulatedData = marketIndicesData.map(market => ({
          ...market,
          value: market.value + (Math.random() - 0.5) * (market.value * 0.02), // ±2% variation
          change: (Math.random() - 0.5) * 5, // ±2.5% change
          status: Math.random() > 0.5 ? 'up' : 'down'
        }));
        
        setMarketData(simulatedData);
        setMarketStatus('offline');
        console.log('Using offline market data - API unavailable');
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [user?.email]);

  const totalPortfolioValue = portfolio.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0) + 300;
  const totalGrowth = ((totalPortfolioValue - 300) / 300) * 100;

  // Time-based greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{getTimeBasedGreeting()}, {user.email.split('@')[0]}!</h2>
            <p className="text-green-100">Here's your wealth overview for today</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${totalPortfolioValue.toFixed(0)}</div>
            <div className="flex items-center text-green-100">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{totalGrowth.toFixed(1)}% growth
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Moved to top */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your wealth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowAddFunds(true)}
              className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">Add Funds</p>
            </button>
            <button 
              onClick={() => setShowInvestmentFlow(true)}
              className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">New Investment</p>
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">Set Goal</p>
            </button>
            <button 
              onClick={() => setShowSocialShare(true)}
              className="p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
            >
              <Share2 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-700">Share Success</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">${totalPortfolioValue}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{totalGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Active Investments</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{portfolio.length}</div>
            <p className="text-xs text-blue-600">
              Across {new Set(portfolio.map(p => p.riskLevel)).size} risk levels
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Monthly Return</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">+18%</div>
            <p className="text-xs text-purple-600">
              Above market average (12%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">A+</div>
            <p className="text-xs text-orange-600">
              Well diversified portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Portfolio Growth</span>
            </CardTitle>
            <CardDescription>Your investment performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={portfolioChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="month" 
                  className="text-gray-600"
                />
                <YAxis className="text-gray-600" />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'value' ? `$${value}` : `${value}%`,
                    name === 'value' ? 'Portfolio Value' : 'Growth %'
                  ]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#059669" 
                  fill="url(#greenGradient)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Indices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>African Markets</span>
            </CardTitle>
            <CardDescription>
              Real-time market indices 
              {marketStatus === 'success' && (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {marketStatus === 'offline' && (
                <Badge className="bg-blue-100 text-blue-800 ml-2">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Demo
                </Badge>
              )}
              {marketStatus === 'loading' && (
                <Badge variant="secondary" className="ml-2">
                  <Activity className="h-3 w-3 mr-1 animate-spin" />
                  Loading
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(marketData.length > 0 ? marketData : marketIndicesData).map((market, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{market.name}</p>
                    <p className="text-lg font-bold text-gray-800">
                      {market.value.toLocaleString(undefined, { 
                        minimumFractionDigits: 1, 
                        maximumFractionDigits: 1 
                      })}
                    </p>
                    {market.currency && (
                      <p className="text-xs text-gray-500">{market.currency}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${
                      market.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {market.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(market.change).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                </div>
              ))}
              {marketStatus === 'error' && (
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">Using cached market data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Community Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>Top Performing Assets</span>
            </CardTitle>
            <CardDescription>Best returns across African markets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${performer.color}-500`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">Risk: {performer.risk}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{performer.return}</div>
                    <Progress 
                      value={parseFloat(performer.return.replace('%', ''))} 
                      className="w-20 h-2 mt-1" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="border-yellow-200 bg-gradient-to-b from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Join thousands of African investors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700">12,847</div>
              <p className="text-sm text-yellow-600">Active Users</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nigeria</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kenya</span>
                <span className="font-medium">22%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ghana</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Others</span>
                <span className="font-medium">15%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium">$2.3M+</p>
              <p className="text-xs text-yellow-600">Total investments managed</p>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Modals */}
      <AddFundsModal 
        isOpen={showAddFunds} 
        onClose={() => setShowAddFunds(false)} 
        user={user} 
      />
      
      <InvestmentFlowModal 
        isOpen={showInvestmentFlow} 
        onClose={() => setShowInvestmentFlow(false)} 
        user={user} 
      />
      
      <SocialShare 
        isOpen={showSocialShare} 
        onClose={() => setShowSocialShare(false)} 
        user={user}
        shareType="success"
        defaultContent={`Just reached ${(totalPortfolioValue || 0).toFixed(0)} in my investment portfolio! 🎉`}
      />
    </div>
  );
}