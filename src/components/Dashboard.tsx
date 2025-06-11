import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet, Clock, Zap } from 'lucide-react';
import { User, TronAccount } from '../types';
import AccountCard from './AccountCard';
import { motion } from 'framer-motion';
import { fetchAccounts } from '../services/apiService';

interface DashboardProps {
  user: User;
  accounts: TronAccount[];
  onUpdateAccounts: (updatedAccounts: TronAccount[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, onUpdateAccounts }) => {
  const [isAutoClaiming, setIsAutoClaiming] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoClaiming) {
      interval = setInterval(async () => {
        try {
          const updatedAccounts = await fetchAccounts();
          onUpdateAccounts(updatedAccounts);
        } catch (error) {
          console.error('Failed to fetch accounts:', error);
        }
      }, 5000); // Fetch updated accounts every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoClaiming, onUpdateAccounts]);

  const activeAccounts = accounts.filter(acc => acc.status === 'active').length;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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
          {accounts.map(account => (
            <motion.div key={account.id} variants={item}>
              <AccountCard 
                account={account} 
                onClaim={() => {}} // No manual claim needed
                canClaim={false} // Disable manual claim
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;