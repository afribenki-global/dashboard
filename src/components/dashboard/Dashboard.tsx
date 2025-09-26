import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AnalyticsHome } from './AnalyticsHome';
import { Portfolio } from './Portfolio';
import { InvestOptions } from './InvestOptions';
import { Profile } from './Profile';
import { Settings } from './Settings';
import { SocialHub } from './SocialHub';
import { Education } from './Education';
import { KYCNotificationBar } from '../notifications/KYCNotificationBar';
import { LogOut, User, TrendingUp, CreditCard, Settings as SettingsIcon, BarChart3, Users, GraduationCap, Home } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState('home');

  const userName = user.email.split('@')[0];

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'invest', label: 'Invest', icon: CreditCard },
    { id: 'social', label: 'Community', icon: Users },
    { id: 'education', label: 'Learn', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <AnalyticsHome user={user} />;
      case 'portfolio':
        return <Portfolio user={user} />;
      case 'invest':
        return <InvestOptions user={user} />;
      case 'social':
        return <SocialHub user={user} />;
      case 'education':
        return <Education user={user} />;
      case 'profile':
        return <Profile user={user} />;
      case 'settings':
        return <Settings user={user} onLogout={onLogout} />;
      default:
        return <AnalyticsHome user={user} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-blue-50">
        <Sidebar className="border-r border-green-200">
          <SidebarHeader className="border-b border-green-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-700">Benki</h1>
                <p className="text-sm text-gray-600">Wealth Assistant</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wide mb-2">
                Dashboard
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        isActive={activeView === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500">Gold Member</p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-green-100 px-4 py-3 flex items-center justify-between">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-green-700">Benki</h1>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* KYC Notification Bar */}
            <KYCNotificationBar 
              user={user} 
              onKYCClick={() => setActiveView('profile')}
            />
            {renderContent()}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-green-100 px-6 py-4">
            <div className="text-center text-sm text-gray-500">
              Powered by AfriBenki - Democratizing wealth for Africa's youth. 
              <a 
                href="https://www.afribenki.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 ml-1"
              >
                Check www.afribenki.com
              </a>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}