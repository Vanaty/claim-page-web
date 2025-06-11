import React, { useState, useEffect } from 'react';
import { User, Wallet, Clock, TrendingUp, Settings, Plus, LogOut, Menu, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import TokenTransfer from './components/TokenTransfer';
import Setting from './components/Setting';
import { User as UserType, TronAccount, ClaimResult } from './types';
import { loginUser, fetchAccounts, updateAccountTokens as apiUpdateAccountTokens, registerUser, fetchUser } from './services/apiService';
import { parseTronAccount } from './services/utils';

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [accounts, setAccounts] = useState<TronAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'settings' | 'transfer'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedUser = localStorage.getItem('tronpick_user');
        const token = localStorage.getItem('tronpick_token');
        if (savedUser && token) {
          setUser(await fetchUser());
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
      const accounts = await fetchAccounts();
      const parsedAccounts = accounts.map(parseTronAccount);
      setAccounts(parsedAccounts);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
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
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tronpick_user');
    localStorage.removeItem('tronpick_token');
    setAccounts([]);
    setActiveTab('dashboard');
  };

  const addAccount = async (account: TronAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const removeAccount = async (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const updateAccountTokens = async (accountId: string, tokensUsed: number) => {
    try {
      const response: ClaimResult = await apiUpdateAccountTokens(accountId);
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId
            ? { 
                ...acc, 
                balance: acc.balance + (response.amount || 0), 
                lastClaim: new Date(), 
                nextClaim: response.nextClaimTime || new Date(Date.now() + 60 * 60 * 1000) 
              }
            : acc
        )
      );
      if (user) {
        setUser({ ...user, tokens: user.tokens - tokensUsed });
      }
    } catch (error) {
      alert('Échec de la mise à jour des jetons du compte. Veuillez réessayer.');
      console.error('Failed to update account tokens:', error);
    }
  };

  const updateAccounts = (updatedAccounts: TronAccount[]) => {
    setAccounts(updatedAccounts.map(parseTronAccount));
  };

  const handleTokenTransfer = (amount: number) => {
    if (user) {
      setUser({ ...user, tokens: user.tokens - amount });
    }
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

  if (!user) {
    return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Wallet className="text-blue-700 mr-2" size={24} />
              <span className="font-bold text-xl text-blue-800">TronPick Auto-Claim</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <span className="token-balance mr-1">{user.tokens}</span>
                <span className="text-slate-600 text-sm">Jetons</span>
              </div>
              
              <div className="relative group">
                <button className="btn btn-outline-primary">
                  <User size={16} className="mr-1" />
                  <span>{user.username}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-slate-700 hover:text-blue-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="container mx-auto px-4 py-3 space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-600">Jetons disponibles:</span>
                <span className="token-balance">{user.tokens}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex w-full items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto md:overflow-visible space-x-2 md:space-x-4 pb-2 md:pb-0 mb-6">
          <button 
            className={`nav-link flex items-center flex-shrink-0 ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={18} className="mr-2" />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-link flex items-center flex-shrink-0 ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            <Plus size={18} className="mr-2" />
            <span>Comptes ({accounts.length})</span>
          </button>
          <button 
            className={`nav-link flex items-center flex-shrink-0 ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            <Send size={18} className="mr-2" />
            <span>Transfert</span>
          </button>
          <button 
            className={`nav-link flex items-center flex-shrink-0 ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} className="mr-2" />
            <span>Paramètres</span>
          </button>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                user={user} 
                accounts={accounts} 
                onUpdateAccounts={updateAccounts}
              />
            )}
            {activeTab === 'accounts' && (
              <AccountManager 
                accounts={accounts}
                onAddAccount={addAccount}
                onRemoveAccount={removeAccount}
              />
            )}
            {activeTab === 'transfer' && (
              <TokenTransfer
                user={user}
                onTokensTransferred={handleTokenTransfer}
              />
            )}
            {activeTab === 'settings' && (
              <Setting user={user} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;