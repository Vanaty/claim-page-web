import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import { User, TronAccount } from '../types';
import AccountCard from './AccountCard';
import { motion } from 'framer-motion';
import { fetchAccounts, fetchWheelData } from '../services/apiService';
import { useUniqueData } from '../hooks/useUniqueData';
import { parseTronAccount } from '../services/utils';
import { useChristmasMode } from '../hooks/useChristmasMode';
import { useWeekendCountdown } from '../hooks/useWeekendCountdown';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
  accounts: TronAccount[];
  onUpdateAccounts: (updatedAccounts: TronAccount[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, onUpdateAccounts }) => {
  const [isAutoClaiming, setIsAutoClaiming] = useState(true);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [wheelLoading, setWheelLoading] = useState(true);
  const [wheelCanSpin, setWheelCanSpin] = useState(false);
  const uniqueAccounts = useUniqueData(accounts);
  const { isChristmasMode } = useChristmasMode();
  const { formatCountdown, getCountdownMessage, isRefillTime } = useWeekendCountdown();
  
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

  // Fetch wheel data
  useEffect(() => {
    const loadWheelData = async () => {
      try {
        setWheelLoading(true);
        setSpinsRemaining(user.spinsRemaining || 0);
        setWheelCanSpin((user.spinsRemaining || 0) > 0);
      } catch (error) {
        console.error('Failed to load wheel data:', error);
        setSpinsRemaining(0);
        setWheelCanSpin(false);
      } finally {
        setWheelLoading(false);
      }
    };

    loadWheelData();
  }, []);

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
      {/* Christmas Banner */}
      {isChristmasMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-red-500 to-green-500 rounded-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white bg-opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-2">🎄🎅🎁</div>
            <h3 className="text-xl font-bold mb-2">Joyeux Noël et Bonne Année ! 🎉</h3>
            <p className="text-sm opacity-90">
              Profitez de nos offres spéciales de Noël avec des bonus exceptionnels !
            </p>
          </div>
          {/* Floating snowflakes */}
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-opacity-30 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ❄️
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Weekend Countdown Banner */}
      {!isRefillTime && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-6 rounded-xl text-white relative overflow-hidden ${
            isChristmasMode 
              ? 'bg-gradient-to-r from-red-600 via-green-600 to-red-600' 
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600'
          }`}
        >
          <div className="absolute inset-0 bg-white bg-opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl mb-3">
              {isChristmasMode ? '🎄✨🎅' : '🎯⚡🎉'}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {isChristmasMode ? 'Réapprovisionnement Magique de Noël !' : 'Réapprovisionnement de Tours !'}
            </h3>
            <p className="text-sm opacity-90 mb-3">
              {getCountdownMessage()}
            </p>
            <div className={`text-2xl font-bold ${
              isChristmasMode 
                ? 'bg-white bg-opacity-20 text-yellow-300' 
                : 'bg-white bg-opacity-20 text-yellow-400'
            } rounded-lg px-4 py-2 inline-block`}>
              {formatCountdown()}
            </div>
          </div>
          {/* Animated decorations */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-opacity-20 pointer-events-none text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {isChristmasMode ? '🎁' : '⭐'}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Weekend Success Banner */}
      {isRefillTime && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-6 rounded-xl text-white relative overflow-hidden ${
            isChristmasMode 
              ? 'bg-gradient-to-r from-green-500 via-red-500 to-green-500' 
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500'
          }`}
        >
          <div className="absolute inset-0 bg-white bg-opacity-10"></div>
          <div className="relative z-10 text-center">
            <motion.div 
              className="text-4xl mb-3"
              animate={{ 
                scale: [1, 1.1, 1], 
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              {isChristmasMode ? '🎄🎅🎁✨' : '🎉🎯⚡🏆'}
            </motion.div>
            <h3 className="text-xl font-bold mb-2">
              {isChristmasMode ? 'Ho Ho Ho ! Réapprovisionnement Magique !' : 'Réapprovisionnement Activé !'}
            </h3>
            <p className="text-sm opacity-90">
              {isChristmasMode 
                ? 'Vos tours magiques de Noël ont été réapprovisionnés ! (Samedi 00h00 UTC)'
                : 'Vos tours ont été réapprovisionnés ! (Samedi 00h00 UTC)'
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Auto-claim toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${isChristmasMode ? 'text-green-800' : 'text-slate-800'}`}>
          {isChristmasMode ? '🎄 Tableau de bord 🎄' : 'Tableau de bord'}
        </h2>
        
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

        <motion.div variants={item} className="glass-card p-5 flex items-center">
          <div className={`${isChristmasMode ? 'bg-red-100' : 'bg-purple-100'} rounded-full p-3 mr-4`}>
            <RotateCcw className={`${isChristmasMode ? 'text-red-600' : 'text-purple-600'}`} size={24} />
          </div>
          <div>
            {wheelLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-8 mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <h3 className={`text-2xl font-bold ${isChristmasMode ? 'text-red-600' : 'text-purple-600'}`}>
                  {spinsRemaining}
                </h3>
                <p className="text-slate-500 text-sm">
                  {isChristmasMode ? '🎄 Tours magiques' : 'Tours de roue'}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Wheel of Fortune Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`glass-card p-6 mb-6 ${isChristmasMode ? 'bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200' : ''}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center mb-3">
              <div className={`${isChristmasMode ? 'bg-red-100' : 'bg-purple-100'} rounded-full p-3 mr-4`}>
                <RotateCcw className={`${isChristmasMode ? 'text-red-600' : 'text-purple-600'}`} size={28} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isChristmasMode ? 'text-green-800' : 'text-slate-800'}`}>
                  {isChristmasMode ? '🎄 Roue de Fortune Magique 🎅' : '🎯 Roue de Fortune'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {isChristmasMode 
                    ? 'Tentez votre chance pour des cadeaux de Noël !' 
                    : 'Tournez la roue et gagnez des récompenses !'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              {wheelLoading ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className={`${isChristmasMode ? 'text-red-500' : 'text-purple-500'}`} size={20} />
                    <span className="font-semibold text-slate-700">
                      Tours restants: 
                      <span className={`ml-1 ${isChristmasMode ? 'text-red-600' : 'text-purple-600'} font-bold`}>
                        {spinsRemaining}
                      </span>
                    </span>
                  </div>
                  
                  {wheelCanSpin ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 text-sm font-medium">
                        {isChristmasMode ? '✨ Prêt à tourner !' : 'Disponible'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-600 text-sm font-medium">
                        {isChristmasMode ? '🎅 Revenez plus tard' : 'Cooldown'}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {spinsRemaining > 0 && (
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isChristmasMode 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                <span>💡</span>
                <span>
                  {isChristmasMode 
                    ? 'Des cadeaux magiques vous attendent !' 
                    : 'Utilisez vos tours pour gagner des récompenses'
                  }
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Link 
              to="/wheel"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                spinsRemaining > 0 
                  ? (isChristmasMode 
                      ? 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    )
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw size={20} />
              <span>
                {isChristmasMode ? '🎁 Tourner la Magie' : 'Jouer maintenant'}
              </span>
              <ArrowRight size={16} />
            </Link>
            
            {spinsRemaining === 0 && (
              <div className="text-center text-sm text-slate-500">
                {isChristmasMode 
                  ? '🎅 Revenez demain pour plus de magie !' 
                  : 'Tours épuisés - Revenez plus tard'
                }
              </div>
            )}
          </div>
        </div>
      </motion.div>

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
          {uniqueAccounts.map((account) => (
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