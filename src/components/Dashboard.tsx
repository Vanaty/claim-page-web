import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet } from 'lucide-react';
import { User, TronAccount } from '../types';
import AccountCard from './AccountCard';
import { motion } from 'framer-motion';
import { fetchAccounts } from '../services/apiService';
import { useUniqueData } from '../hooks/useUniqueData';
import { parseTronAccount } from '../services/utils';

interface DashboardProps {
  user: User;
  accounts: TronAccount[];
  onUpdateAccounts: (updatedAccounts: TronAccount[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, onUpdateAccounts }) => {
  const [isAutoClaiming, setIsAutoClaiming] = useState(true);
  const uniqueAccounts = useUniqueData(accounts);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isMounted = true; // Track component mount status
    
    // Fetch initial data only once
    const fetchInitialData = async () => {
      try {
        const accounts = await fetchAccounts();
        const parsedAccounts = accounts.map(parseTronAccount);
        onUpdateAccounts(parsedAccounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    // Only fetch initial data if we don't have accounts yet
    if (accounts.length === 0) {
      fetchInitialData();
    }

    // Set up interval only if auto-claiming is enabled
    if (isAutoClaiming) {
      interval = setInterval(async () => {
        if (!isMounted) return; // Don't update if component unmounted
        
        try {
          const accounts = await fetchAccounts();
          const parsedAccounts = accounts.map(parseTronAccount);
          // Remove duplicates based on ID
          const uniqueAccounts = parsedAccounts.filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id)
          );
          onUpdateAccounts(uniqueAccounts);
        } catch (error) {
          console.error('Failed to fetch accounts:', error);
        }
      }, 10000);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [isAutoClaiming]); // Remove onUpdateAccounts from dependencies

  const activeAccounts = uniqueAccounts.filter(acc => acc.status === 'active').length;
  const totalBalance = uniqueAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      {/* Auto-claim toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Tableau de bord</h2>
        
        <div className="flex items-center">
          <div className="relative inline-flex items-center cursor-pointer mr-4">
            <input 
              type="checkbox" 
              value="" 
              className="sr-only peer" 
              checked={isAutoClaiming}
              onChange={() => setIsAutoClaiming(!isAutoClaiming)}
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-slate-700">Auto-Claim</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div variants={item} className="glass-card p-5 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Wallet className="text-blue-700" size={24} />
          </div>
          <div>
            <h3 className="token-balance text-2xl">{user.tokens}</h3>
            <p className="text-slate-500 text-sm">Jetons disponibles</p>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="glass-card p-5 flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">{activeAccounts}</h3>
            <p className="text-slate-500 text-sm">Comptes actifs</p>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="glass-card p-5 flex items-center">
          <div className="bg-indigo-100 rounded-full p-3 mr-4">
            <TrendingUp className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">{totalBalance.toFixed(2)}</h3>
            <p className="text-slate-500 text-sm">TRX Total</p>
          </div>
        </motion.div>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 text-center"
        >
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">Aucun compte TronPick</h4>
          <p className="text-slate-500">Ajoutez vos comptes TronPick pour commencer l'auto-claim</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {uniqueAccounts.map((account, index) => (
            <motion.div key={`unique-${account.id}`} variants={item}>
              <AccountCard 
                account={account} 
                onClaim={() => {}}
                canClaim={false}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;