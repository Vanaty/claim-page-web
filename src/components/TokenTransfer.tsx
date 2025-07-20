import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, History, RefreshCw, Calendar, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrasactionHistory, transferTokens } from '../services/apiService';
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

interface TransferHistory {
  id: number;
  sender: string;
  recipient: string;
  amount: number;
  date: string;
}

const TokenTransfer: React.FC<TokenTransferProps> = ({ user, onTokensTransferred, showToast }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [alert, setAlert] = useState<TransferAlert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (showHistory) {
      loadTransferHistory();
    }
  }, [showHistory]);

  const loadTransferHistory = async () => {
    try {
      setLoadingHistory(true);
      // TODO: Replace with actual API call when endpoint is available
      // const history = await getTransferHistory();
      const history = await getTrasactionHistory();
      setTransferHistory(history); 
    } catch (error) {
      console.error('Failed to load transfer history:', error);
      if (showToast) {
        showToast('error', 'Erreur lors du chargement de l\'historique');
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(transferHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransfers = transferHistory.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
        // Reload history after successful transfer
        loadTransferHistory();
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
      
      <div className="glass-card p-6 mb-6">
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
          <p className="text-sm text-slate-600 mb-2">
            Les transferts de jetons sont instantanés et irréversibles. Assurez-vous que l'ID du destinataire est correct avant de confirmer le transfert.
          </p>
          <p className="text-sm text-slate-600 font-medium text-orange-600">
            ⚠️ Note : Les bonus ne peuvent pas être transférés
          </p>
        </div>
      </div>

      {/* Transfer History Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <History size={20} className="mr-2" />
            Historique des transferts
          </h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            {showHistory ? 'Masquer' : 'Afficher'}
            <RefreshCw 
              size={16} 
              className={`ml-1 ${loadingHistory ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw size={24} className="animate-spin text-blue-600 mr-2" />
                  <span className="text-slate-600">Chargement de l'historique...</span>
                </div>
              ) : transferHistory.length > 0 ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Type</th>
                          <th className="text-left py-3 px-2">Utilisateur</th>
                          <th className="text-left py-3 px-2">Montant</th>
                          <th className="text-left py-3 px-2">ID Transaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransfers.map((transfer) => {
                          const isOutgoing = transfer.sender.toLowerCase() === user.email?.toLowerCase() || 
                                            transfer.sender.toLowerCase() === user.username?.toLowerCase();
                          
                          return (
                            <tr key={transfer.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-2">
                                <div className="flex items-center text-slate-600">
                                  <Calendar size={14} className="mr-2" />
                                  {new Date(transfer.date+'Z').toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <div className={`flex items-center ${
                                  isOutgoing ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {isOutgoing ? (
                                    <>
                                      <ArrowUpRight size={14} className="mr-1" />
                                      <span>Envoyé</span>
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownLeft size={14} className="mr-1" />
                                      <span>Reçu</span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <span className="font-medium">
                                  {isOutgoing ? transfer.recipient : transfer.sender}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className={`font-semibold ${
                                  isOutgoing ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {isOutgoing ? '-' : '+'}{transfer.amount} jetons
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className="text-slate-500 font-mono text-xs">
                                  #{transfer.id}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Affichage {startIndex + 1}-{Math.min(endIndex, transferHistory.length)} sur {transferHistory.length} résultats
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <History size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Aucun transfert dans l'historique</p>
                  <p className="text-xs mt-1">Vos transferts de jetons apparaîtront ici</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenTransfer;
