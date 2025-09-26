import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TrendingUp, Shield, AlertTriangle, DollarSign, Info, Activity, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { InvestmentFlowModal } from './InvestmentFlowModal';

interface InvestOptionsProps {
  user: any;
}

export function InvestOptions({ user }: InvestOptionsProps) {
  const [livePerformance, setLivePerformance] = useState<any[]>([]);
  const [dataStatus, setDataStatus] = useState('loading');
  const [showInvestmentFlow, setShowInvestmentFlow] = useState(false);
  useEffect(() => {
    const fetchLivePerformance = async () => {
      try {
        setDataStatus('loading');
        
        // Try to fetch from backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-68307d5a/investment-performance`,
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
            setLivePerformance(data);
            setDataStatus('success');
            return;
          }
        }
        
        throw new Error('Invalid API response');
      } catch (error) {
        // Use simulated performance data when API is unavailable
        setDataStatus('offline');
        console.log('Using offline investment data - API unavailable');
      }
    };

    fetchLivePerformance();
    const interval = setInterval(fetchLivePerformance, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  }, []);

  const investmentOptions = [
    {
      name: "Nigerian High-Yield Bonds",
      yieldRange: "8-16%",
      riskLevel: "Low",
      minInvestment: 10,
      performance: {
        quarter: 4,
        half: 9,
        year: 15
      },
      description: "Government-backed bonds with steady returns",
      info: "Licensed by Central Bank of Nigeria, backed by Stanbic IBTC Trust Limited",
      color: "green"
    },
    {
      name: "Kenyan Equities Fund",
      yieldRange: "10-14%",
      riskLevel: "Medium",
      minInvestment: 25,
      performance: {
        quarter: 5,
        half: 10,
        year: 18
      },
      description: "Diversified stocks in tech and agriculture",
      info: "Regulated by Capital Markets Authority Kenya",
      color: "blue"
    },
    {
      name: "Ghanaian Savings Account",
      yieldRange: "6-8%",
      riskLevel: "Low",
      minInvestment: 5,
      performance: {
        quarter: 2,
        half: 4,
        year: 7
      },
      description: "High-interest account for short-term goals",
      info: "Insured by Ghana Deposit Protection Corporation",
      color: "green"
    },
    {
      name: "West African Tech Startups",
      yieldRange: "15-25%",
      riskLevel: "High",
      minInvestment: 50,
      performance: {
        quarter: 8,
        half: 15,
        year: 22
      },
      description: "Early-stage investments in fintech and agtech",
      info: "Curated by licensed investment advisors",
      color: "purple"
    },
    {
      name: "South African REITs",
      yieldRange: "9-13%",
      riskLevel: "Medium",
      minInvestment: 20,
      performance: {
        quarter: 3,
        half: 7,
        year: 12
      },
      description: "Real Estate Investment Trusts",
      info: "JSE-listed, regulated by FSCA",
      color: "orange"
    },
    {
      name: "African Infrastructure Fund",
      yieldRange: "11-17%",
      riskLevel: "Medium",
      minInvestment: 30,
      performance: {
        quarter: 6,
        half: 12,
        year: 16
      },
      description: "Investments in roads, energy, and telecom",
      info: "Backed by African Development Bank partnerships",
      color: "blue"
    },
    {
      name: "Pan-African Green Bonds",
      yieldRange: "7-12%",
      riskLevel: "Low",
      minInvestment: 15,
      performance: {
        quarter: 3,
        half: 6,
        year: 10
      },
      description: "Sustainable development projects",
      info: "ESG-compliant, UN Principles for Responsible Investment",
      color: "green"
    }
  ];

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'Medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'High':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-green-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInvest = (option: any) => {
    // Simulate investment
    const investment = {
      name: option.name,
      description: option.description,
      initialInvestment: option.minInvestment,
      currentValue: option.minInvestment * (1 + (option.performance.quarter / 100)),
      growth: option.performance.quarter,
      dateInvested: new Date().toISOString(),
      yieldRange: option.yieldRange,
      riskLevel: option.riskLevel
    };

    // Get existing portfolio
    const existingPortfolio = localStorage.getItem(`benki_portfolio_${user.email}`);
    const portfolio = existingPortfolio ? JSON.parse(existingPortfolio) : [];
    
    // Add new investment
    portfolio.push(investment);
    localStorage.setItem(`benki_portfolio_${user.email}`, JSON.stringify(portfolio));

    toast.success(`Successfully invested $${option.minInvestment} in ${option.name}!`, {
      description: "View your investment in the Portfolio tab."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-blue-700 flex items-center justify-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Investment Opportunities</span>
            {dataStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                <Wifi className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            )}
            {dataStatus === 'offline' && (
              <Badge className="bg-blue-100 text-blue-800 ml-2">
                <WifiOff className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
            {dataStatus === 'loading' && (
              <Badge className="bg-gray-100 text-gray-800 ml-2">
                <Activity className="h-3 w-3 mr-1 animate-spin" />
                Loading
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-blue-600">
            Choose from our curated selection of African investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-green-600 font-bold">12,847</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-blue-600 font-bold">
                {livePerformance.length > 0 
                  ? `${(livePerformance.reduce((sum, p) => sum + p.currentReturn, 0) / livePerformance.length).toFixed(1)}%`
                  : '18%'
                }
              </div>
              <div className="text-sm text-gray-600">Avg Returns</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-purple-600 font-bold">Licensed</div>
              <div className="text-sm text-gray-600">Brokers</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-orange-600 font-bold">$5+</div>
              <div className="text-sm text-gray-600">Min Start</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Performance Alert */}
      {livePerformance.length > 0 && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-700">
              <Activity className="h-4 w-4 animate-pulse" />
              <span className="font-medium">Live Market Update:</span>
              <span>
                {livePerformance.find(p => p.trend === 'up')?.name || 'Several investments'} showing strong performance today
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentOptions.map((option, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-gray-900 leading-tight">
                  {option.name}
                </CardTitle>
                <Badge className={`${getRiskColor(option.riskLevel)} flex items-center space-x-1`}>
                  {getRiskIcon(option.riskLevel)}
                  <span>{option.riskLevel}</span>
                </Badge>
              </div>
              <CardDescription className="text-gray-600">
                {option.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Yield and Investment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-lg font-bold text-green-700">{option.yieldRange}</div>
                  <div className="text-sm text-green-600">Expected Yield</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">${option.minInvestment}</div>
                  <div className="text-sm text-blue-600">Min Investment</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center justify-between">
                  <span>Performance</span>
                  {(() => {
                    const liveData = livePerformance.find(p => p.name === option.name);
                    return liveData && (
                      <Badge className={`${
                        liveData.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      } text-xs`}>
                        {liveData.trend === 'up' ? '↗' : '↘'} Live: {liveData.currentReturn.toFixed(1)}%
                      </Badge>
                    );
                  })()}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-green-600">+{option.performance.quarter}%</div>
                    <div className="text-gray-500">Quarter</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">+{option.performance.half}%</div>
                    <div className="text-gray-500">Half Year</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">+{option.performance.year}%</div>
                    <div className="text-gray-500">1 Year</div>
                  </div>
                </div>
                {(() => {
                  const liveData = livePerformance.find(p => p.name === option.name);
                  return liveData && liveData.volume && (
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>Volume: ${liveData.volume.toLocaleString()}</span>
                      <span className={`font-medium ${
                        liveData.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {liveData.trend === 'up' ? '↗' : '↘'} {liveData.trend}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Additional Info */}
              <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{option.info}</p>
              </div>

              {/* Invest Button */}
              <Button 
                onClick={() => setShowInvestmentFlow(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Invest Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Investment Flow Modal */}
      <InvestmentFlowModal 
        isOpen={showInvestmentFlow} 
        onClose={() => setShowInvestmentFlow(false)} 
        user={user} 
      />
    </div>
  );
}