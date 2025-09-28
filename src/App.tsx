import React, { useState, useEffect } from 'react';
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { Dashboard } from './components/dashboard/Dashboard';
import { FloatingAIChat } from './components/chat/FloatingAIChat';
import { NotificationManager } from './components/notifications/NotificationManager';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/common/ErrorBoundary';


export default function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup' | 'dashboard'>('signin');
  const [user, setUser] = useState<any>(null);

  // Ensure default user exists in localStorage
  useEffect(() => {
    const defaultUser = {
      username: 'user@gmail.com',
      email: 'user@gmail.com',
      password: 'soonami',
      name: 'User',
      provider: 'default',
    };
    const savedUser = localStorage.getItem('benki_user');
    const defaultUserExists = localStorage.getItem('benki_default_user');
    if (!defaultUserExists) {
      localStorage.setItem('benki_default_user', JSON.stringify(defaultUser));
    }
    // Check if user is logged in
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('benki_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('benki_user');
    setCurrentPage('signin');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {currentPage === 'signin' && (
          <SignIn 
            onLogin={handleLogin}
            onSwitchToSignUp={() => setCurrentPage('signup')}
          />
        )}
        {currentPage === 'signup' && (
          <SignUp 
            onSignUp={handleLogin}
            onSwitchToSignIn={() => setCurrentPage('signin')}
          />
        )}
        {currentPage === 'dashboard' && user && (
          <>
            <Dashboard user={user} onLogout={handleLogout} />
            <FloatingAIChat />
            <NotificationManager user={user} />
          </>
        )}
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}