import React, { useState, useEffect } from 'react';
import { Wallet, Clock, TrendingUp, Zap, Globe, BarChart3, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { TronAccount } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import AccountHistoryChart from './AccountHistoryChart';

interface AccountCardProps {
  account: TronAccount;
  onClaim: () => void;
  canClaim: boolean;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClaim, canClaim, showToast }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaimNow, setCanClaimNow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hasAutoClaimIssue, setHasAutoClaimIssue] = useState(false);

  // Vérifier si l'autoclaim rencontre un problème
  useEffect(() => {
    if (account.lastClaim) {
      const now = new Date();
      const lastClaimDate = new Date(account.lastClaim);
      const diffMs = now.getTime() - lastClaimDate.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      
      // Si la différence est supérieure à 1h02min (62 minutes)
      setHasAutoClaimIssue(diffMinutes > 62);
    } else {
      setHasAutoClaimIssue(false);
    }
  }, [account.lastClaim]);

  useEffect(() => {
    const updateTimer = () => {
      if (!account.nextClaim) {
        setTimeLeft('Prêt');
        setCanClaimNow(true);
        return;
      }

      const now = new Date();
      const diff = account.nextClaim.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Prêt');
        setCanClaimNow(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setCanClaimNow(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [account.nextClaim]);

  const handleClaim = () => {
    if (canClaimNow && canClaim) {
      onClaim();
    }
  };

  const showAddressDetails = () => {
    if (showToast) {
      showToast('info', `Adresse complète : ${account.address}`);
    } else {
      alert(`Adresse complète : ${account.address}`);
    }
  };

  const getStatusBadge = () => {
    switch (account.status) {
      case 'active':
        return <span className="badge badge-success">Actif</span>;
      case 'pending':
        return <span className="badge badge-warning">En attente</span>;
      case 'error':
        return <span className="badge badge-danger">Erreur</span>;
      default:
        return <span className="badge bg-slate-200 text-slate-700">Inconnu</span>;
    }
  };

  const getStatusIndicator = () => {
    return (
      <span 
        className={`status-indicator ${
          account.status === 'active' ? 'status-active' : 
          account.status === 'pending' ? 'status-pending' : 'status-error'
        } ${canClaimNow ? 'animate-pulse-slow' : ''}`}
      />
    );
  };

  return (
    <motion.div 
      className="glass-card h-full overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-1">
              {getStatusIndicator()}
              <h3 className="font-semibold text-slate-800 ml-2">
                {account.address.slice(0, 8)}...{account.address.slice(-6)}
              </h3>
            </div>
            <div className="flex items-center">
              {getStatusBadge()}
              {account.baseUrl && (
                <span className="ml-2 text-xs text-slate-500 flex items-center">
                  <Globe size={12} className="mr-1" />
                  {account.baseUrl}
                </span>
              )}
            </div>
          </div>
          
          <button 
            className="text-slate-400 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-blue-50"
            onClick={showAddressDetails}
          >
            <Wallet size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <TrendingUp size={18} className="text-green-600 mx-auto mb-1" />
            <div className="font-bold text-green-600">{account.balance.toFixed(6)}</div>
            <small className="text-slate-500 text-xs">{account.baseUrl?.split('pick')[0].toLocaleUpperCase()}</small>
          </div>
          
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <Clock size={18} className={`${canClaimNow ? 'text-green-600' : 'text-blue-600'} mx-auto mb-1`} />
            <div className={`font-bold ${canClaimNow ? 'text-green-600' : 'text-blue-600'}`}>
              {timeLeft}
            </div>
            <small className="text-slate-500 text-xs">Prochain claim</small>
          </div>
        </div>

        {canClaimNow && (
          <div className="w-full h-1 bg-slate-100 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ width: '100%' }}
            />
          </div>
        )}

        <button 
          className={`w-full py-2 rounded-lg flex items-center justify-center ${
            canClaimNow && canClaim 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-slate-100 text-slate-500'
          } transition-colors`}
          onClick={handleClaim}
          disabled={!canClaimNow || !canClaim}
        >
          <Zap size={16} className="mr-2" />
          {canClaimNow 
            ? (canClaim ? 'Claim Maintenant' : 'En cours de réclamation...')
            : 'En attente...'
          }
        </button>

        {account.lastClaim && (
          <div className="mt-3 text-xs text-center text-slate-500">
            Dernier claim: {new Date(account.lastClaim).toLocaleString('fr-FR')}
          </div>
        )}

        {/* Avertissement si l'autoclaim rencontre un problème */}
        {hasAutoClaimIssue && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-center">
            <AlertTriangle size={16} className="text-orange-600 mr-2 flex-shrink-0" />
            <span className="text-xs text-orange-700">
              L'autoclaim sur {account.baseUrl ? account.baseUrl : 'ce compte'} est momentanément mise en pause en raison de problèmes techniques. Nous travaillons activement à la résolution de ce problème. Merci de votre compréhension.
            </span>
          </div>
        )}
        
        {/* History Toggle Button */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full mt-3 py-2 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-colors"
        >
          <BarChart3 size={14} className="mr-2" />
          {showHistory ? 'Masquer l\'historique' : 'Voir l\'historique'}
          {showHistory ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
      </div>

      {/* History Chart Section */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100 overflow-hidden"
          >
            <div className="p-4">
              <AccountHistoryChart 
                accountId={account.id}
                accountAddress={account.address}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountCard;