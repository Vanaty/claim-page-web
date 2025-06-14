import React, { useState, useEffect } from 'react';
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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<TronAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  
  // Toast state
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Toast functions
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, onClose: removeToast }]);

    // Auto-remove toast after 5 seconds
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
        // Check if there's a password reset token in the URL
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
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await loginUser(username, password);
      setUser(userData.user);
      localStorage.setItem('tronpick_user', JSON.stringify(userData.user));
      localStorage.setItem('tronpick_token', userData.token.access_token);
      
      // Get user role from JWT token
      const role = getRoleUser(userData.token.access_token);
      setUserRole(role);
      
      const accounts = await fetchAccounts();
      const parsedAccounts = accounts.map(parseTronAccount);
      setAccounts(parsedAccounts);
      showToast('success', 'Connexion réussie');
    } catch (error) {
      console.error('Login failed:', error);
      showToast('error', 'Échec de la connexion. Veuillez vérifier vos identifiants.');
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
      const accounts = await fetchAccounts();
      const parsedAccounts = accounts.map(parseTronAccount);
      setAccounts(parsedAccounts);
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

  const updateAccounts = (updatedAccounts: TronAccount[]) => {
    setAccounts(updatedAccounts.map(parseTronAccount));
  };

  const handleTokenTransfer = (amount: number) => {
    if (user) {
      setUser({ ...user, tokens: user.tokens - amount });
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
    <>
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
                    path="/settings" 
                    element={
                      <Setting user={user} showToast={showToast} />
                    } 
                  />
                  {userRole === 'admin' && (
                    <Route 
                      path="/admin" 
                      element={<AdminPanel showToast={showToast} />} 
                    />
                  )}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </>
  );
}

export default App;