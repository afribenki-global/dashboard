import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Target,
  Calendar,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InvestmentFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function InvestmentFlowModal({ isOpen, onClose, user }: InvestmentFlowModalProps) {
  const [step, setStep] = useState<'category' | 'selection' | 'amount' | 'confirmation'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('growth');

  const categories = [
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Low risk, steady returns',
      icon: <Shield className="h-6 w-6" />,
      riskLevel: 'Low',
      expectedReturn: '8-12%',
      color: 'green',
      suitable: 'Beginners, risk-averse investors'
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Moderate risk, balanced growth',
      icon: <Target className="h-6 w-6" />,
      riskLevel: 'Medium',
      expectedReturn: '12-18%',
      color: 'blue',
      suitable: 'Most investors seeking balance'
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      description: 'High risk, high potential returns',
      icon: <TrendingUp className="h-6 w-6" />,
      riskLevel: 'High',
      expectedReturn: '18-30%',
      color: 'purple',
      suitable: 'Experienced investors, long-term goals'
    }
  ];

  const investments = {
    conservative: [
      {
        id: 'ng_bonds',
        name: "Nigerian High-Yield Bonds",
        yield: "8-16%",
        minInvestment: 10,
        riskLevel: "Low",
        description: "Government-backed bonds with steady returns",
        features: ['Government guaranteed', 'Fixed returns', 'Low volatility'],
        currency: 'NGN'
      },
      {
        id: 'gh_treasury',
        name: "Ghanaian Treasury Bills",
        yield: "10-14%",
        minInvestment: 25,
        riskLevel: "Low",
        description: "Short-term government securities",
        features: ['91-365 day terms', 'Government backed', 'Regular income'],
        currency: 'GHS'
      }
    ],
    balanced: [
      {
        id: 'ke_equities',
        name: "Kenyan Equities Fund",
        yield: "12-20%",
        minInvestment: 20,
        riskLevel: "Medium",
        description: "Diversified portfolio of Kenyan blue-chip stocks",
        features: ['NSE listed companies', 'Dividend income', 'Capital appreciation'],
        currency: 'KES'
      },
      {
        id: 'sa_reits',
        name: "South African REITs",
        yield: "10-16%",
        minInvestment: 50,
        riskLevel: "Medium",
        description: "Real Estate Investment Trusts",
        features: ['Property exposure', 'Quarterly dividends', 'Inflation hedge'],
        currency: 'ZAR'
      }
    ],
    aggressive: [
      {
        id: 'tech_startups',
        name: "West African Tech Startups",
        yield: "20-40%",
        minInvestment: 100,
        riskLevel: "High",
        description: "Early-stage technology companies across West Africa",
        features: ['High growth potential', 'Equity participation', 'Long-term horizon'],
        currency: 'USD'
      },
      {
        id: 'commodity_fund',
        name: "African Commodity Fund",
        yield: "15-35%",
        minInvestment: 75,
        riskLevel: "High",
        description: "Exposure to African natural resources",
        features: ['Gold, oil, agriculture', 'Commodity cycles', 'Currency hedge'],
        currency: 'USD'
      }
    ]
  };

  const goals = [
    { id: 'growth', label: 'Long-term Growth', description: 'Build wealth over 5+ years' },
    { id: 'income', label: 'Regular Income', description: 'Generate monthly/quarterly income' },
    { id: 'savings', label: 'Smart Savings', description: 'Better than bank interest rates' },
    { id: 'retirement', label: 'Retirement Planning', description: 'Secure your future' }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('selection');
  };

  const handleInvestmentSelect = (investment: any) => {
    setSelectedInvestment(investment);
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    if (!investmentAmount || parseFloat(investmentAmount) < selectedInvestment.minInvestment) {
      toast.error(`Minimum investment amount is $${selectedInvestment.minInvestment}`);
      return;
    }

    setStep('confirmation');
  };

  const handleConfirmInvestment = async () => {
    try {
      toast.loading('Processing investment...');
      
      // Simulate investment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create investment record
      const investment = {
        id: Date.now().toString(),
        name: selectedInvestment.name,
        description: selectedInvestment.description || 'No description available',
        amount: parseFloat(investmentAmount),
        initialInvestment: parseFloat(investmentAmount),
        currentValue: parseFloat(investmentAmount),
        riskLevel: selectedInvestment.riskLevel,
        yield: selectedInvestment.yield,
        currency: selectedInvestment.currency,
        goal: investmentGoal,
        growth: 0, // Initial growth is 0
        startDate: new Date().toISOString(),
        performance: {
          daily: 0,
          monthly: 0,
          total: 0
        }
      };
      
      // Update portfolio
      const currentPortfolio = JSON.parse(localStorage.getItem(`benki_portfolio_${user.email}`) || '[]');
      currentPortfolio.push(investment);
      localStorage.setItem(`benki_portfolio_${user.email}`, JSON.stringify(currentPortfolio));
      
      // Add to transaction history
      const transactions = JSON.parse(localStorage.getItem(`benki_transactions_${user.email}`) || '[]');
      transactions.unshift({
        id: Date.now(),
        type: 'investment',
        name: selectedInvestment.name,
        amount: parseFloat(investmentAmount),
        date: new Date().toISOString(),
        status: 'completed'
      });
      localStorage.setItem(`benki_transactions_${user.email}`, JSON.stringify(transactions));
      
      toast.dismiss();
      toast.success(`Successfully invested $${investmentAmount} in ${selectedInvestment.name}!`);
      
      // Reset modal
      setStep('category');
      setSelectedCategory('');
      setSelectedInvestment(null);
      setInvestmentAmount('');
      setInvestmentGoal('growth');
      
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error('Investment failed. Please try again.');
    }
  };

  const getCurrentStepProgress = () => {
    const steps = ['category', 'selection', 'amount', 'confirmation'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  const renderCategorySelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Investment Style</h3>
        <p className="text-gray-600 text-sm">Select based on your risk tolerance and goals</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all hover:shadow-md border-gray-200 hover:border-blue-300"
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-50 text-${category.color}-600`}>
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{category.suitable}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`bg-${category.color}-100 text-${category.color}-800`}>
                    {category.riskLevel}
                  </Badge>
                  <p className="text-sm font-medium text-gray-700 mt-1">{category.expectedReturn}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInvestmentSelection = () => {
    const categoryInvestments = investments[selectedCategory as keyof typeof investments] || [];
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Investment</h3>
          <p className="text-gray-600 text-sm">
            {categories.find(c => c.id === selectedCategory)?.name} investment options
          </p>
        </div>

        <div className="space-y-3">
          {categoryInvestments.map((investment) => (
            <Card 
              key={investment.id}
              className="cursor-pointer transition-all hover:shadow-md border-gray-200 hover:border-blue-300"
              onClick={() => handleInvestmentSelect(investment)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{investment.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{investment.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {investment.currency}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Expected Yield: </span>
                      <span className="font-medium text-green-600">{investment.yield}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Min: </span>
                      <span className="font-medium">${investment.minInvestment}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {investment.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAmountInput = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Amount</h3>
        <p className="text-gray-600 text-sm">How much would you like to invest?</p>
      </div>

      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{selectedInvestment?.name}</CardTitle>
          <CardDescription>{selectedInvestment?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Expected Yield:</span>
            <span className="font-medium text-green-600">{selectedInvestment?.yield}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Minimum Investment:</span>
            <span className="font-medium">${selectedInvestment?.minInvestment}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="amount">Investment Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          placeholder={`Min $${selectedInvestment?.minInvestment}`}
          className="border-blue-200 focus:border-blue-400"
          min={selectedInvestment?.minInvestment}
          step="1"
        />
      </div>

      <div>
        <Label>Investment Goal</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {goals.map((goal) => (
            <Card 
              key={goal.id}
              className={`cursor-pointer transition-all ${
                investmentGoal === goal.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setInvestmentGoal(goal.id)}
            >
              <CardContent className="p-3 text-center">
                <p className="font-medium text-sm">{goal.label}</p>
                <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {investmentAmount && parseFloat(investmentAmount) >= (selectedInvestment?.minInvestment || 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">Projected Returns</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>1 Year (Conservative):</span>
              <span className="font-medium text-green-700">
                ${(parseFloat(investmentAmount) * 1.08).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>3 Years (Expected):</span>
              <span className="font-medium text-green-700">
                ${(parseFloat(investmentAmount) * 1.15 ** 3).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>5 Years (Optimistic):</span>
              <span className="font-medium text-green-700">
                ${(parseFloat(investmentAmount) * 1.20 ** 5).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Investment</h3>
        <p className="text-gray-600 text-sm">Review your investment details</p>
      </div>

      <Card className="border-green-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Investment:</span>
            <span className="font-medium">{selectedInvestment?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-green-600">${investmentAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expected Yield:</span>
            <span className="font-medium">{selectedInvestment?.yield}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Risk Level:</span>
            <Badge className={`
              ${selectedInvestment?.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : ''}
              ${selectedInvestment?.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${selectedInvestment?.riskLevel === 'High' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {selectedInvestment?.riskLevel}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Goal:</span>
            <span className="text-sm">{goals.find(g => g.id === investmentGoal)?.label}</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Important Information</p>
            <p className="text-blue-700 mt-1">
              This investment will be added to your portfolio and tracked automatically. 
              You can monitor performance and make adjustments anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-blue-700">New Investment</DialogTitle>
          <DialogDescription>
            Start your investment journey with guided selection
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCurrentStepProgress()}%` }}
          ></div>
        </div>

        <div className="py-4">
          {step === 'category' && renderCategorySelection()}
          {step === 'selection' && renderInvestmentSelection()}
          {step === 'amount' && renderAmountInput()}
          {step === 'confirmation' && renderConfirmation()}
        </div>

        <DialogFooter className="flex justify-between">
          {step !== 'category' && (
            <Button
              variant="outline"
              onClick={() => {
                const steps = ['category', 'selection', 'amount', 'confirmation'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1] as any);
              }}
            >
              Back
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step === 'amount' && (
              <Button onClick={handleAmountSubmit} className="bg-blue-600 hover:bg-blue-700">
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 'confirmation' && (
              <Button onClick={handleConfirmInvestment} className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-4 w-4 mr-1" />
                Invest Now
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}