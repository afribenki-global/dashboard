import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface PortfolioProps {
  user: any;
}

export function Portfolio({ user }: PortfolioProps) {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(300);
  const [totalGrowth, setTotalGrowth] = useState(0);

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem(`benki_portfolio_${user.email}`);
    if (savedPortfolio) {
      try {
        const portfolioData = JSON.parse(savedPortfolio);
        setPortfolio(portfolioData);
        
        // Calculate total value and growth with null safety
        const currentValue = portfolioData.reduce((sum: number, investment: any) => {
          return sum + (investment.currentValue || investment.amount || 0);
        }, 0);
        
        const initialValue = portfolioData.reduce((sum: number, investment: any) => {
          return sum + (investment.initialInvestment || investment.amount || 0);
        }, 0);
        
        setTotalValue(currentValue + 300); // 300 base + investments
        setTotalGrowth(initialValue > 0 ? ((currentValue / initialValue) - 1) * 100 : 0);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setPortfolio([]);
      }
    }
  }, [user.email]);

  const performanceMetrics = [
    { period: 'Quarter', value: 5, color: 'text-green-600' },
    { period: 'Half-Year', value: 10, color: 'text-green-600' },
    { period: '1-Year', value: 18, color: 'text-green-600' }
  ];

  if (portfolio.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader className="text-center">
            <CardTitle className="text-orange-700 flex items-center justify-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Start Your Wealth Journey</span>
            </CardTitle>
            <CardDescription className="text-orange-600">
              No investments yet? Head to Invest Options to start building your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Join 150+ users who are already growing their wealth with Benki
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="text-green-600 font-medium">8-16%</div>
                <div className="text-gray-500">Expected Returns</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="text-blue-600 font-medium">$10</div>
                <div className="text-gray-500">Min Investment</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="text-purple-600 font-medium">Licensed</div>
                <div className="text-gray-500">Brokers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              +${(totalValue - 300).toFixed(2)} from initial $300
            </p>
          </CardContent>
        </Card>

        {performanceMetrics.map((metric) => (
          <Card key={metric.period} className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">{metric.period}</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>+{metric.value}%</div>
              <Progress value={metric.value} className="mt-2 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700">Your Investments</CardTitle>
          <CardDescription>Track your portfolio performance across different assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.map((investment, index) => {
              // Calculate safe values with null safety
              const currentValue = investment.currentValue || investment.amount || 0;
              const initialValue = investment.initialInvestment || investment.amount || 0;
              const growth = investment.growth !== undefined ? investment.growth : 
                            (initialValue > 0 ? ((currentValue / initialValue) - 1) * 100 : 0);
              const description = investment.description || 'No description available';
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(investment.name || 'N/A').charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{investment.name || 'Unknown Investment'}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${currentValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Initial: ${initialValue.toFixed(2)}
                      </div>
                    </div>
                    
                    <Badge 
                      variant={growth >= 0 ? "default" : "destructive"}
                      className={growth >= 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Performance Overview</CardTitle>
          <CardDescription>Your portfolio growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Portfolio Growing Steadily</p>
              <p className="text-sm text-gray-500">Average return: +18% annually</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}