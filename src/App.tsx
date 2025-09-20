import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User, TronAccount } from './types';
import { loginUser, fetchAccounts, registerUser, fetchUser } from './services/apiService';
import { parseTronAccount, getRoleUser } from './services/utils';
import ToastContainer, { ToastProps } from './components/Toast';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordForm from './components/ResetPasswordForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import TokenTransfer from './components/TokenTransfer';
import Setting from './components/Setting';
import AdminPanel from './components/AdminPanel';
import SiteKeyManager from './components/SiteKeyManager';
import TokenPurchase from './components/TokenPurchase';
import PaymentSuccess from './components/PaymentSuccess';
import SupportContact from './components/SupportContact';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import PaymentInterface from './components/PaymentInterface';
import AnnouncementManager from './components/AnnouncementManager';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<TronAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  
  // Toast state
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Toast functions
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, onClose: removeToast }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenR = urlParams.get('reset-token');
        if (tokenR) {
          setResetToken(tokenR);
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsLoading(false);
          return;
        }

        const savedUser = localStorage.getItem('tronpick_user');
        const token = localStorage.getItem('tronpick_token');
        if (savedUser && token) {
          const userData = await fetchUser();
          setUser(userData);
          // Get user role from JWT token
          const role = getRoleUser(token);
          setUserRole(role);
          
          const accounts = await fetchAccounts();
          const parsedAccounts = accounts.map(parseTronAccount);
          setAccounts(parsedAccounts);
          setAccountsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const updateAccounts = useCallback((newAccounts: TronAccount[]) => {
    // Ensure no duplicates before setting state
    const uniqueAccounts = newAccounts.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    setAccounts(uniqueAccounts);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginUser(email, password);
      setUser(response.user);
      localStorage.setItem('tronpick_user', JSON.stringify(response.user));
      localStorage.setItem('tronpick_token', response.token.access_token);
      
      const accounts = await fetchAccounts();
      const parsedAccounts = accounts.map(parseTronAccount);
      updateAccounts(parsedAccounts); // Use the callback to ensure uniqueness
      
      showToast('success', 'Connexion réussie. Bienvenue !');
    } catch (error: any) {
      console.error('Login failed:', error);
      showToast('error', 'Échec de la connexion.'+ error.response?.data?.detail || 'Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const newUser = await registerUser(username, email, password);
      setUser(newUser.user);
      localStorage.setItem('tronpick_user', JSON.stringify(newUser.user));
      localStorage.setItem('tronpick_token', newUser.token.access_token);
      
      // Only fetch accounts once
      if (!accountsLoaded) {
        const accounts = await fetchAccounts();
        const parsedAccounts = accounts.map(parseTronAccount);
        setAccounts(parsedAccounts);
        setAccountsLoaded(true);
      }
      
      showToast('success', 'Inscription réussie. Bienvenue !');
    } catch (error) {
      console.error('Registration failed:', error);
      showToast('error', 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tronpick_user');
    localStorage.removeItem('tronpick_token');
    setAccounts([]);
    showToast('info', 'Déconnexion réussie');
  };

  const addAccount = async (account: TronAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const removeAccount = async (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const handleTokenTransfer = (amount: number) => {
    if (user) {
      setUser({ ...user, tokens: user.tokens - amount });
    }
  };

  const handleTokenPurchase = (amount: number) => {
    if (user) {
      setUser({ ...user, tokens: user.tokens + amount });
    }
  };

  const handleResetPasswordSuccess = () => {
    setResetToken(null);
    showToast('success', 'Mot de passe réinitialisé avec succès');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (resetToken) {
    return <ResetPasswordForm token={resetToken} onSuccess={handleResetPasswordSuccess} />;
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            !user ? (
              <LandingPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            !user ? (
              <LoginPage onLogin={handleLogin} isLoading={isLoading} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !user ? (
              <RegisterPage onRegister={handleRegister} isLoading={isLoading} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            !user ? (
              <ForgotPasswordPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/support" 
          element={<SupportContact showToast={showToast} />} 
        />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Protected routes */}
        <Route 
          path="/*" 
          element={
            user ? (
              <Layout 
                user={user} 
                userRole={userRole} 
                onLogout={handleLogout}
                accountsCount={accounts.length}
              >
                <Routes>
                  <Route 
                    path="/dashboard" 
                    element={
                      <Dashboard 
                        user={user} 
                        accounts={accounts} 
                        onUpdateAccounts={updateAccounts}
                      />
                    } 
                  />
                  <Route 
                    path="/accounts" 
                    element={
                      <AccountManager 
                        accounts={accounts}
                        onAddAccount={addAccount}
                        onRemoveAccount={removeAccount}
                        showToast={showToast}
                      />
                    } 
                  />
                  <Route 
                    path="/transfer" 
                    element={
                      <TokenTransfer
                        user={user}
                        onTokensTransferred={handleTokenTransfer}
                        showToast={showToast}
                      />
                    } 
                  />
                  <Route 
                    path="/buy-tokens" 
                    element={
                      <TokenPurchase
                        user={user}
                        onTokensPurchased={handleTokenPurchase}
                        showToast={showToast}
                      />
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <Setting user={user} showToast={showToast} />
                    } 
                  />
                  <Route 
                    path="/support" 
                    element={<SupportContact showToast={showToast} />} 
                  />
                  {userRole === 'admin' && (
                    <>
                      <Route 
                        path="/admin" 
                        element={<AdminPanel showToast={showToast} />} 
                      />
                      <Route 
                        path="/admin/sitekeys" 
                        element={<SiteKeyManager showToast={showToast} />} 
                      />
                      <Route 
                        path="/admin/announcements" 
                        element={<AnnouncementManager user={user} showToast={showToast} />} 
                      />
                    </>
                  )}
                  <Route 
                    path="/announcements" 
                    element={<AnnouncementManager user={user} showToast={showToast} />} 
                  />
                  <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
                  <Route path="/payment/:paymentId" element={<PaymentInterface showToast={showToast} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>

      {/* Add Footer */}
      <Footer />
    </div>
  );
}

export default App;