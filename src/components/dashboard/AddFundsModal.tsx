import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function AddFundsModal({ isOpen, onClose, user }: AddFundsModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'method' | 'details' | 'confirmation'>('method');
  const [paymentDetails, setPaymentDetails] = useState({
    bankAccount: '',
    mobileNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountType: 'savings'
  });

  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'MTN MoMo, Airtel Money, M-Pesa',
      icon: <Smartphone className="h-5 w-5" />,
      processingTime: 'Instant',
      fee: 'Free',
      supported: ['Nigeria', 'Kenya', 'Ghana', 'Uganda'],
      color: 'green'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct transfer from your bank account',
      icon: <Building2 className="h-5 w-5" />,
      processingTime: '1-3 hours',
      fee: '₦50 (~$0.12)',
      supported: ['Nigeria', 'South Africa', 'Ghana', 'Kenya'],
      color: 'blue'
    },
    {
      id: 'verve_card',
      name: 'Verve Card',
      description: 'Nigerian local debit/credit cards',
      icon: <CreditCard className="h-5 w-5" />,
      processingTime: 'Instant',
      fee: '1.5%',
      supported: ['Nigeria'],
      color: 'purple'
    },
    {
      id: 'crypto_wallet',
      name: 'Crypto Wallet',
      description: 'USDC, Bitcoin, Ethereum',
      icon: <Wallet className="h-5 w-5" />,
      processingTime: '10-30 minutes',
      fee: 'Network fees',
      supported: ['All countries'],
      color: 'orange'
    }
  ];

  const mobileProviders = [
    { id: 'mtn', name: 'MTN MoMo', countries: ['Nigeria', 'Ghana'] },
    { id: 'airtel', name: 'Airtel Money', countries: ['Nigeria', 'Kenya'] },
    { id: 'mpesa', name: 'M-Pesa', countries: ['Kenya'] },
    { id: 'vodafone', name: 'Vodafone Cash', countries: ['Ghana'] }
  ];

  const banks = [
    'Access Bank', 'GTBank', 'First Bank', 'UBA', 'Zenith Bank', 
    'Fidelity Bank', 'Stanbic IBTC', 'Standard Chartered', 'Wema Bank', 'FCMB'
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('details');
  };

  const handleDetailsSubmit = () => {
    // Validate required fields based on payment method
    if (!amount || parseFloat(amount) < 5) {
      toast.error('Minimum funding amount is $5');
      return;
    }

    if (selectedMethod === 'mobile_money' && !paymentDetails.mobileNumber) {
      toast.error('Mobile number is required');
      return;
    }

    if (selectedMethod === 'bank_transfer' && (!paymentDetails.bankAccount || !paymentDetails.bankName)) {
      toast.error('Bank account details are required');
      return;
    }

    if (selectedMethod === 'verve_card' && (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv)) {
      toast.error('Complete card details are required');
      return;
    }

    setStep('confirmation');
  };

  const handleConfirmPayment = async () => {
    try {
      toast.loading('Processing payment...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update user's portfolio with new funds
      const currentPortfolio = JSON.parse(localStorage.getItem(`benki_portfolio_${user.email}`) || '[]');
      const fundingRecord = {
        id: Date.now(),
        type: 'funding',
        amount: parseFloat(amount),
        method: selectedMethod,
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      // Add to transaction history
      const transactions = JSON.parse(localStorage.getItem(`benki_transactions_${user.email}`) || '[]');
      transactions.unshift(fundingRecord);
      localStorage.setItem(`benki_transactions_${user.email}`, JSON.stringify(transactions));
      
      toast.dismiss();
      toast.success(`Successfully added $${amount} to your account!`);
      
      // Reset modal
      setStep('method');
      setSelectedMethod('');
      setAmount('');
      setPaymentDetails({
        bankAccount: '',
        mobileNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        bankName: '',
        accountType: 'savings'
      });
      
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error('Payment failed. Please try again.');
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Payment Method</h3>
        <p className="text-gray-600 text-sm">Select your preferred way to add funds</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              method.supported.includes(user.country || 'Nigeria')
                ? 'border-gray-200 hover:border-green-300'
                : 'border-gray-100 opacity-50'
            }`}
            onClick={() => method.supported.includes(user.country || 'Nigeria') && handleMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${method.color}-50 text-${method.color}-600`}>
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.processingTime}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Fee: {method.fee}</p>
                </div>
              </div>
              {!method.supported.includes(user.country || 'Nigeria') && (
                <div className="mt-2 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not available in {user.country || 'your country'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {selectedMethodData?.name} Details
        </h3>
        <p className="text-gray-600 text-sm">Enter your payment information</p>
      </div>

      {/* Amount Input */}
      <div>
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (min $5)"
          className="border-green-200 focus:border-green-400"
          min="5"
          step="0.01"
        />
      </div>

      {/* Method-specific fields */}
      {selectedMethod === 'mobile_money' && (
        <>
          <div>
            <Label htmlFor="provider">Mobile Money Provider</Label>
            <Select onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, provider: value }))}>
              <SelectTrigger className="border-green-200 focus:border-green-400">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {mobileProviders
                  .filter(p => p.countries.includes(user.country || 'Nigeria'))
                  .map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={paymentDetails.mobileNumber}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileNumber: e.target.value }))}
              placeholder="+234 801 234 5678"
              className="border-green-200 focus:border-green-400"
            />
          </div>
        </>
      )}

      {selectedMethod === 'bank_transfer' && (
        <>
          <div>
            <Label htmlFor="bank">Bank Name</Label>
            <Select onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, bankName: value }))}>
              <SelectTrigger className="border-green-200 focus:border-green-400">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="account">Account Number</Label>
            <Input
              id="account"
              type="text"
              value={paymentDetails.bankAccount}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankAccount: e.target.value }))}
              placeholder="1234567890"
              className="border-green-200 focus:border-green-400"
            />
          </div>
        </>
      )}

      {selectedMethod === 'verve_card' && (
        <>
          <div>
            <Label htmlFor="card">Card Number</Label>
            <Input
              id="card"
              type="text"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
              placeholder="5060 XXXX XXXX XXXX"
              className="border-green-200 focus:border-green-400"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                type="text"
                value={paymentDetails.expiryDate}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                placeholder="MM/YY"
                className="border-green-200 focus:border-green-400"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                placeholder="123"
                className="border-green-200 focus:border-green-400"
                maxLength={3}
              />
            </div>
          </div>
        </>
      )}

      {selectedMethod === 'crypto_wallet' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Crypto Payment</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You'll be redirected to our crypto payment processor to complete this transaction securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2 text-blue-700">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Your payment information is encrypted and processed securely by our licensed payment partners.
        </p>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Payment</h3>
        <p className="text-gray-600 text-sm">Review your payment details</p>
      </div>

      <Card className="border-green-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-green-600">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Method:</span>
            <span className="font-medium">{selectedMethodData?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Time:</span>
            <span className="text-sm">{selectedMethodData?.processingTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fee:</span>
            <span className="text-sm">{selectedMethodData?.fee}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-green-600">${amount}</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 text-center">
          By confirming, you agree to our Terms of Service and confirm that this payment is authorized.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-700">Add Funds</DialogTitle>
          <DialogDescription>
            Choose from African-friendly payment methods
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'method' && renderMethodSelection()}
          {step === 'details' && renderPaymentDetails()}
          {step === 'confirmation' && renderConfirmation()}
        </div>

        <DialogFooter className="flex justify-between">
          {step !== 'method' && (
            <Button
              variant="outline"
              onClick={() => setStep(step === 'confirmation' ? 'details' : 'method')}
            >
              Back
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step === 'details' && (
              <Button onClick={handleDetailsSubmit} className="bg-green-600 hover:bg-green-700">
                Continue
              </Button>
            )}
            {step === 'confirmation' && (
              <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700">
                Confirm Payment
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}