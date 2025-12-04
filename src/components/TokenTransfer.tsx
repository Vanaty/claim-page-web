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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
          <Send className="mr-3 text-blue-600" size={32} />
          Transfert de jetons
        </h2>
        <p className="text-slate-600">Envoyez vos jetons à d'autres utilisateurs de manière instantanée</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Card: Jetons Transférables */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-600 rounded-xl p-3 shadow-lg">
              <Send size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
              Transférable
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Jetons Disponibles</h3>
          <div className="text-4xl font-bold text-blue-700">
            {user.tokens - (user.tokensBonus || 0)}
          </div>
          <p className="text-xs text-slate-500 mt-2">Prêts à être transférés</p>
        </motion.div>

        {/* Card: Bonus de jetons */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-amber-500 rounded-xl p-3 shadow-lg">
              <ArrowDownLeft size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-200 px-2 py-1 rounded-full">
              Bonus
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Bonus de Jetons</h3>
          <div className="text-4xl font-bold text-amber-700">
            {user.tokensBonus || 0}
          </div>
          <p className="text-xs text-slate-500 mt-2">Non transférables</p>
        </motion.div>

        {/* Card: Total */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-emerald-600 rounded-xl p-3 shadow-lg">
              <ArrowUpRight size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Solde Total</h3>
          <div className="text-4xl font-bold text-emerald-700">
            {user.tokens}
          </div>
          <p className="text-xs text-slate-500 mt-2">Tous vos jetons</p>
        </motion.div>
      </div>

      <div className="glass-card p-8 mb-6 shadow-xl">
        <AnimatePresence>
          {alert && !showToast && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`mb-6 p-4 rounded-xl ${
                alert.type === 'success' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 shadow-lg'
                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300 shadow-lg'
              } flex items-start`}
            >
              <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={22} />
              <div className="flex-grow font-medium">{alert.message}</div>
              <button 
                onClick={closeAlert} 
                className="ml-2 text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            Nouveau Transfert
          </h3>
          <p className="text-sm text-slate-500 ml-7">Remplissez les détails ci-dessous pour effectuer un transfert</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ID du destinataire (UUID v4)
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-12 pr-4 py-3 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
                  required
                  pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
                  title="UUID version 4 valide requis"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Send size={18} />
                </div>
              </div>
              <small className="text-slate-500 text-xs mt-2 block flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Entrez l'identifiant unique de l'utilisateur destinataire
              </small>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Montant à transférer
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="form-input pl-4 pr-24 py-3 text-lg font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  min="1"
                  max={user.tokens - (user.tokensBonus || 0)}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold text-sm">
                  jetons
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <small className="text-slate-500 text-xs flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  Maximum: {user.tokens - (user.tokensBonus || 0)} jetons
                </small>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor((user.tokens - (user.tokensBonus || 0)) * 0.25))}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor((user.tokens - (user.tokensBonus || 0)) * 0.50))}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor((user.tokens - (user.tokensBonus || 0)) * 0.75))}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(user.tokens - (user.tokensBonus || 0))}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary w-full py-4 text-base font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isLoading || amount <= 0 || amount > (user.tokens - (user.tokensBonus || 0))}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Transfert en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send size={20} className="mr-2" />
                    Transférer {amount > 0 ? `${amount} jetons` : 'les jetons'}
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </form>
        
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-600 rounded-lg p-2 mr-4">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                💡 Comment ça marche ?
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Les transferts de jetons sont <strong>instantanés et irréversibles</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Vérifiez bien l'UUID du destinataire avant de confirmer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">⚠️</span>
                  <span className="text-orange-700 font-medium">Les jetons bonus ne peuvent pas être transférés</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer History Section */}
      <div className="glass-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 mr-3 shadow-lg">
              <History size={20} className="text-white" />
            </div>
            Historique des transferts
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={loadTransferHistory}
              disabled={loadingHistory}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw 
                size={16} 
                className={`mr-2 ${loadingHistory ? 'animate-spin' : ''}`} 
              />
              Actualiser
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md transition-all"
            >
              {showHistory ? 'Masquer' : 'Afficher'}
            </button>
          </div>
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
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <RefreshCw size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                  </div>
                  <span className="text-slate-600 mt-4 font-medium">Chargement de l'historique...</span>
                </div>
              ) : transferHistory.length > 0 ? (
                <div>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">Date</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">Type</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">Expéditeur</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">Destinataire</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">Montant</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-700">ID Transaction</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {currentTransfers.map((transfer, index) => {
                          const isOutgoing = transfer.sender.toLowerCase() === user.email?.toLowerCase() || 
                                            transfer.sender.toLowerCase() === user.username?.toLowerCase();
                          
                          return (
                            <motion.tr 
                              key={transfer.id} 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center text-slate-600">
                                  <Calendar size={16} className="mr-2 text-slate-400" />
                                  <span className="font-medium">
                                    {new Date(transfer.date+'Z').toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className={`flex items-center font-semibold ${
                                  isOutgoing ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {isOutgoing ? (
                                    <>
                                      <div className="bg-red-100 rounded-lg p-1.5 mr-2">
                                        <ArrowUpRight size={16} />
                                      </div>
                                      <span>Envoyé</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="bg-green-100 rounded-lg p-1.5 mr-2">
                                        <ArrowDownLeft size={16} />
                                      </div>
                                      <span>Reçu</span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`font-medium ${isOutgoing ? 'text-blue-600' : 'text-slate-700'}`}>
                                  {transfer.sender}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`font-medium ${!isOutgoing ? 'text-blue-600' : 'text-slate-700'}`}>
                                  {transfer.recipient}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`font-bold text-base ${
                                  isOutgoing ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {isOutgoing ? '-' : '+'}{transfer.amount}
                                  <span className="text-xs font-medium ml-1 opacity-70">jetons</span>
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                  #{transfer.id}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600 font-medium">
                        Affichage <span className="text-blue-600">{startIndex + 1}-{Math.min(endIndex, transferHistory.length)}</span> sur <span className="text-blue-600">{transferHistory.length}</span> résultats
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border-2 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-400 transition-all"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                  : 'border-2 border-slate-300 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border-2 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-400 transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <History size={48} className="text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-semibold text-lg">Aucun transfert dans l'historique</p>
                  <p className="text-slate-500 text-sm mt-2">Vos transferts de jetons apparaîtront ici</p>
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
