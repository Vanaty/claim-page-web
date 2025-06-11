import React, { useState, useEffect } from 'react';
import { Wallet, Clock, TrendingUp, Zap } from 'lucide-react';
import { TronAccount } from '../types';
import { motion } from 'framer-motion';

interface AccountCardProps {
  account: TronAccount;
  onClaim: () => void;
  canClaim: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClaim, canClaim }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaimNow, setCanClaimNow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-1">
              {getStatusIndicator()}
              <h3 className="font-semibold text-slate-800 ml-2">
                {account.address.slice(0, 8)}...{account.address.slice(-6)}
              </h3>
            </div>
            {getStatusBadge()}
          </div>
          
          <button 
            className="text-slate-400 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-blue-50"
            onClick={() => alert(`Adresse complète : ${account.address}`)}
          >
            <Wallet size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <TrendingUp size={18} className="text-green-600 mx-auto mb-1" />
            <div className="font-bold text-green-600">{account.balance.toFixed(2)}</div>
            <small className="text-slate-500 text-xs">TRX</small>
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
      </div>
    </motion.div>
  );
};

export default AccountCard;