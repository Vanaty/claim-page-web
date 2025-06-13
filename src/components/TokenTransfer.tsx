import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { transferTokens } from '../services/apiService';
import { User } from '../types';

interface TokenTransferProps {
  user: User;
  onTokensTransferred: (amount: number) => void;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

interface TransferAlert {
  type: 'success' | 'error';
  message: string;
}

const TokenTransfer: React.FC<TokenTransferProps> = ({ user, onTokensTransferred, showToast }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [alert, setAlert] = useState<TransferAlert | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setAlert({ type: 'error', message: 'Le montant doit être supérieur à 0' });
      if (showToast) showToast('error', 'Le montant doit être supérieur à 0');
      return;
    }

    if (amount > user.tokens) {
      setAlert({ type: 'error', message: 'Solde insuffisant' });
      if (showToast) showToast('error', 'Solde insuffisant');
      return;
    }

    try {
      setIsLoading(true);
      const data = await transferTokens(recipientId, amount);
      if (data.success) {
        setAlert({ type: 'success', message: `${amount} jetons transférés avec succès` });
        if (showToast) showToast('success', `${amount} jetons transférés avec succès`);
        onTokensTransferred(amount);
        setRecipientId('');
        setAmount(0);
      } else {
        setAlert({ type: 'error', message: data.message || 'Échec du transfert' });
        if (showToast) showToast('error', data.message || 'Échec du transfert');
      }
    } catch (error: any) {
      console.error('Échec du transfert:', error);
      const errorMessage = error.response?.data?.message || 'Échec du transfert. Veuillez vérifier l\'ID du destinataire.';
      setAlert({ type: 'error', message: errorMessage });
      if (showToast) showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Transfert de jetons</h2>
      
      <div className="glass-card p-6">
        <AnimatePresence>
          {alert && !showToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-4 rounded-lg ${
                alert.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                  : 'bg-red-100 text-red-800 border-l-4 border-red-500'
              } flex items-start`}
            >
              <AlertCircle className="mr-2 flex-shrink-0" size={20} />
              <div className="flex-grow">{alert.message}</div>
              <button onClick={closeAlert} className="ml-2 text-slate-500 hover:text-slate-700">
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Solde disponible</h3>
            <div className="token-balance text-3xl">{user.tokens}</div>
          </div>
          <div className="bg-blue-600 rounded-full p-4">
            <Send size={24} className="text-white" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="form-label">ID du destinataire (UUID v4)</label>
              <input
                type="text"
                className="form-input"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
                required
                pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
                title="UUID version 4 valide requis"
              />
              <small className="text-slate-500 text-xs mt-1 block">
                Entrez l'identifiant unique de l'utilisateur destinataire
              </small>
            </div>
            
            <div>
              <label className="form-label">Montant à transférer</label>
              <input
                type="number"
                className="form-input"
                value={amount || ''}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                min="1"
                max={user.tokens}
                required
              />
              <small className="text-slate-500 text-xs mt-1 block">
                Nombre de jetons à transférer (maximum: {user.tokens})
              </small>
            </div>
            
            <div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading || amount <= 0 || amount > user.tokens}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Transfert en cours...
                  </div>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Transférer les jetons
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-2">Comment ça marche ?</h4>
          <p className="text-sm text-slate-600">
            Les transferts de jetons sont instantanés et irréversibles. Assurez-vous que l'ID du destinataire est correct avant de confirmer le transfert.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenTransfer;
