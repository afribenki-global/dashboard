import React, { useEffect, useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Bell, TrendingUp, Users, AlertTriangle, DollarSign } from 'lucide-react';

interface NotificationManagerProps {
  user: any;
}

export function NotificationManager({ user }: NotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [lastMarketCheck, setLastMarketCheck] = useState<number>(0);
  const [lastSocialCheck, setLastSocialCheck] = useState<number>(0);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
          if (perm === 'granted') {
            // Welcome notification
            setTimeout(() => {
              toast(
                'Welcome to Benki! 🎉',
                {
                  description: 'Notifications are enabled. You\'ll get alerts for market changes and portfolio updates.',
                  icon: <Bell className="h-4 w-4 text-green-600" />,
                  duration: 5000,
                }
              );
            }, 2000);
          }
        });
      } else if (Notification.permission === 'granted') {
        // Welcome toast for already granted permission
        setTimeout(() => {
          toast(
            'Welcome back! 👋',
            {
              description: 'Stay updated with real-time market alerts and portfolio notifications.',
              icon: <Bell className="h-4 w-4 text-blue-600" />,
              duration: 4000,
            }
          );
        }, 1500);
      }
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;

    // Portfolio alerts - check every 10 minutes with simulated data
    const portfolioInterval = setInterval(() => {
      checkPortfolioAlerts();
    }, 600000); // 10 minutes

    // Simulated market alerts - no API calls needed
    const marketInterval = setInterval(() => {
      // Simulate random market movements without API calls
      const simulatedMarkets = [
        { name: 'NGX ASI', change: (Math.random() - 0.5) * 6 },
        { name: 'JSE All Share', change: (Math.random() - 0.5) * 4 },
        { name: 'NSE 20', change: (Math.random() - 0.5) * 3 }
      ];
      
      simulatedMarkets.forEach(market => {
        if (Math.abs(market.change) > 2.5) { // More than 2.5% change
          showMarketAlert(market);
        }
      });
    }, 900000); // 15 minutes

    return () => {
      clearInterval(marketInterval);
      clearInterval(portfolioInterval);
    };
  }, [permission, user.email]);

  const showMarketAlert = (market: any) => {
    const isPositive = market.change > 0;
    const icon = isPositive ? '📈' : '📉';
    const direction = isPositive ? 'up' : 'down';
    
    // Browser notification
    if (permission === 'granted') {
      new Notification(`${icon} Market Alert: ${market.name}`, {
        body: `${market.name} is ${direction} ${Math.abs(market.change).toFixed(1)}% today`,
        icon: '/favicon.ico',
        tag: `market-${market.name}`,
        requireInteraction: false
      });
    }

    // Toast notification
    toast(
      `${market.name} Alert`,
      {
        description: `${direction} ${Math.abs(market.change).toFixed(1)}% today`,
        icon: isPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />,
        duration: 5000,
      }
    );
  };

  const showCommunityUpdate = (post: any) => {
    // Browser notification
    if (permission === 'granted') {
      new Notification('🎉 Community Milestone!', {
        body: `${post.user.name} just achieved a new milestone in the Benki community`,
        icon: '/favicon.ico',
        tag: 'community-milestone',
        requireInteraction: false
      });
    }

    // Toast notification
    toast(
      'Community Milestone!',
      {
        description: `${post.user.name} achieved: ${post.achievement}`,
        icon: <Users className="h-4 w-4 text-purple-600" />,
        duration: 5000,
      }
    );
  };

  const checkPortfolioAlerts = () => {
    const portfolio = JSON.parse(localStorage.getItem(`benki_portfolio_${user.email}`) || '[]');
    
    portfolio.forEach((investment: any) => {
      // Simulate portfolio performance changes
      const dailyChange = (Math.random() - 0.5) * 4; // -2% to +2% daily change
      const newValue = investment.currentValue * (1 + dailyChange / 100);
      
      // Update investment value
      investment.currentValue = newValue;
      investment.performance.daily = dailyChange;
      
      // Alert for significant changes
      if (Math.abs(dailyChange) > 1.5) {
        showPortfolioAlert(investment, dailyChange);
      }
    });
    
    // Save updated portfolio
    localStorage.setItem(`benki_portfolio_${user.email}`, JSON.stringify(portfolio));
  };

  const showPortfolioAlert = (investment: any, change: number) => {
    const isPositive = change > 0;
    const icon = isPositive ? '💰' : '⚠️';
    const direction = isPositive ? 'gained' : 'declined';
    
    // Browser notification
    if (permission === 'granted') {
      new Notification(`${icon} Portfolio Update`, {
        body: `${investment.name} has ${direction} ${Math.abs(change).toFixed(1)}% today`,
        icon: '/favicon.ico',
        tag: `portfolio-${investment.id}`,
        requireInteraction: false
      });
    }

    // Toast notification
    toast(
      'Portfolio Update',
      {
        description: `${investment.name} ${direction} ${Math.abs(change).toFixed(1)}%`,
        icon: <DollarSign className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />,
        duration: 5000,
      }
    );
  };

  // Educational reminders
  useEffect(() => {
    const educationInterval = setInterval(() => {
      const tips = [
        "💡 Tip: Diversification helps reduce investment risk",
        "📚 New course available: Advanced Investment Strategies",
        "⭐ Community tip: Check your portfolio weekly, not daily",
        "🎯 Reminder: Review your investment goals monthly"
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      toast(
        'Benki Tip',
        {
          description: randomTip,
          icon: <Bell className="h-4 w-4 text-blue-600" />,
          duration: 6000,
        }
      );
    }, 1800000); // 30 minutes

    return () => clearInterval(educationInterval);
  }, []);

  return null; // This component doesn't render anything
}