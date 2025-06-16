import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Edit, Gamepad2 } from 'lucide-react';
import { TronAccount, BaseUrlOption } from '../types';
import { addAccount as apiAddAccount, removeAccount as apiRemoveAccount, updateAccount as apiUpdateAccount } from '../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountManagerProps {
  accounts: TronAccount[];
  onAddAccount: (account: TronAccount) => void;
  onRemoveAccount: (accountId: string) => void;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  onAddAccount,
  onRemoveAccount,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState<string | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    privateKey: '',
    balance: 0,
    lastClaim: '',
    proxy: '',
    baseUrl: 'tronpick.io' as BaseUrlOption,
    canGame: 0,
    cookie: '',
    password: ''
  });
  const [addMethod, setAddMethod] = useState<'cookie' | 'login'>('cookie'); // Toggle between methods

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAccountId) {
        // Update existing account
        await handleUpdateAccount();
      } else {
        // Add new account
        // Validate address format (basic validation)
        if (addMethod != 'cookie' && (!formData.address.includes('@') || !formData.address.includes('.'))) {
          if (showToast) showToast('error', 'Email invalide. Veuillez entrer une adresse email valide.');
          return;
        }

        // Validate cookie if using cookie method
        if (addMethod === 'cookie' && (!formData.cookie.trim() || !validateCookie(formData.cookie))) {
          if (showToast) showToast('error', 'Cookie invalide. Veuillez entrer un cookie valide.');
          return;
        }

        // Check if address already exists
        if (accounts.some(acc => acc.address === formData.address && acc.baseUrl === formData.baseUrl)) {
          if (showToast) showToast('error', 'Cet email existe déjà dans vos comptes.');
          return;
        }

        const today = new Date();
        const [minutes, seconds] = formData.lastClaim.split(':').map(Number);
        // Ajouter les minutes et secondes à la date actuelle
        today.setMinutes(today.getMinutes() + minutes, today.getSeconds() + seconds);

        const newAccount = await apiAddAccount({
          address: formData.address,
          privateKey: formData.privateKey,
          balance: formData.balance,
          proxy: formData.proxy,
          baseUrl: formData.baseUrl,
          timeZoneOffset: today.getTimezoneOffset() / -60,
          status: 'active',
          nextClaim: today,
          cookies: addMethod === 'cookie' ? formData.cookie : '',
        });
        onAddAccount(newAccount);
        resetForm();
        if (showToast) showToast('success', 'Compte ajouté avec succès!');
      }
    } catch (error: any) {
      console.error('Failed to add account:', error);
      
      // Handle 400 errors with detailed error messages
      if (error.response?.status === 400 && error.response?.data?.detail) {
        if (showToast) showToast('error', error.response.data.detail);
      } else {
        if (showToast) showToast('error', 'L\'ajout du compte prend du temps que prevue. Rafraichir la page apres quelque minute.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const validateCookie = (cookie: string): boolean => {
    // Basic validation for cookie format
    const cookiePattern = /^[\w-]+=[^;]+(; [\w-]+=[^;]+)*$/;
    return cookiePattern.test(cookie.trim());
  }
  const handleUpdateAccount = async () => {
    if (!editingAccountId) return;

    try {
      const accountToUpdate = accounts.find(acc => acc.id === editingAccountId);
      if (!accountToUpdate) return;

      // Calculate next claim time if lastClaim was changed
      let nextClaim = undefined;
      if (formData.lastClaim) {
        const [minutes, seconds] = formData.lastClaim.split(':').map(Number);
        const newNextClaim = new Date();
        newNextClaim.setMinutes(newNextClaim.getMinutes() + minutes, newNextClaim.getSeconds() + seconds);
        nextClaim = newNextClaim;
      }

      const updatedAccount = await apiUpdateAccount(editingAccountId, {
        address: formData.address || accountToUpdate.address,
        privateKey: formData.privateKey || accountToUpdate.privateKey,
        proxy: formData.proxy,
        baseUrl: formData.baseUrl,
        nextClaim: nextClaim,
        canGame: formData.canGame
      });

      // Update local accounts list
      onAddAccount(updatedAccount); // This will trigger the parent component to update its state

      resetForm();
      if (showToast) showToast('success', 'Compte mis à jour avec succès!');
    } catch (error: any) {
      console.error('Failed to update account:', error);
      
      // Handle 400 errors with detailed error messages
      if (error.response?.status === 400 && error.response?.data?.detail) {
        if (showToast) showToast('error', error.response.data.detail);
      } else {
        if (showToast) showToast('error', 'Échec de la mise à jour du compte');
      }
    }
  };

  const handleEditAccount = (accountId: string) => {
    const accountToEdit = accounts.find(acc => acc.id === accountId);
    if (!accountToEdit) return;

    setFormData({
      address: accountToEdit.address,
      privateKey: accountToEdit.privateKey,
      balance: accountToEdit.balance,
      lastClaim: '', // We don't prefill this
      proxy: accountToEdit.proxy || '',
      baseUrl: accountToEdit.baseUrl as BaseUrlOption || 'tronpick.io',
      canGame: accountToEdit.canGame || 0,
      cookie: '',
      password: ''
    });

    setEditingAccountId(accountId);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      address: '',
      privateKey: '',
      balance: 0,
      lastClaim: '',
      proxy: '',
      baseUrl: 'tronpick.io',
      canGame: 0,
      cookie: '',
      password: ''
    });
    setShowAddForm(false);
    setEditingAccountId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle toggle switch change
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  const togglePrivateKeyVisibility = (accountId: string) => {
    setShowPrivateKey(showPrivateKey === accountId ? null : accountId);
  };

  const handleRemoveAccount = async (accountId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      return;
    }
    
    try {
      await apiRemoveAccount(accountId);
      onRemoveAccount(accountId);
      if (showToast) showToast('success', 'Compte supprimé avec succès');
    } catch (error) {
      if (showToast) showToast('error', 'Échec de la suppression du compte');
      console.error('Failed to remove account:', error);
    }
  };

  return (
    <div>
      {/* Add Account Button and Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des comptes</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          <Plus size={18} />
          Ajouter un compte
        </button>
      </div>

      {/* Add/Edit Account Form with Animation */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card mb-6 relative overflow-hidden"
          >
            <button
              onClick={() => resetForm()}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-slate-400 hover:text-slate-700 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-3 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                {editingAccountId ? 'Modifier le compte' : 'Nouveau compte'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div>
                    <label className="form-label">Méthode d'ajout</label>
                    <select
                      className="form-input"
                      value={addMethod}
                      onChange={(e) => setAddMethod(e.target.value as 'cookie' | 'login')}
                    >
                      <option value="cookie">Via Cookie</option>
                      <option value="login">Via Login</option>
                    </select>
                  </div>

                  {addMethod === 'cookie' && (
                    <div>
                      <label className="form-label">Cookie *</label>
                      <textarea
                        className="form-input"
                        name="cookie"
                        value={formData.cookie || ''}
                        onChange={handleInputChange}
                        placeholder="cookie1=value1; cookie2=value2; ..."
                        required
                      />
                    </div>
                  )}

                  {addMethod === 'login' && (
                    <>
                      <div>
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-input"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="exemple@domaine.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Clé privée *</label>
                        <input
                          type="password"
                          className="form-input"
                          name="privateKey"
                          value={formData.privateKey}
                          onChange={handleInputChange}
                          placeholder="••••••••••••••••••••••••••••••••"
                          required={!editingAccountId}
                        />
                        <small className="text-slate-500 text-xs mt-1 block">
                          {editingAccountId ? 'Laissez vide pour conserver l\'existant' : 'Clé privée pour l\'auto-claim'}
                        </small>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="form-label">
                      {editingAccountId ? 'Nouvelle attente avant réclamation (min:sec)' : 'Attente avant réclamation (min:sec) *'}
                    </label>
                    <input
                      type="text"
                      pattern="^([0-5]?[0-9]):([0-5]?[0-9])$"
                      className="form-input"
                      name="lastClaim"
                      value={formData.lastClaim}
                      onChange={handleInputChange}
                      placeholder="mm:ss"
                      required={!editingAccountId}
                    />
                    <small className="text-slate-500 text-xs mt-1 block">
                      {editingAccountId ? 'Laissez vide pour conserver l\'existant' : 'Heure d\'attente avant la prochaine réclamation'}
                    </small>
                  </div>

                  <div>
                    <label className="form-label">Base URL *</label>
                    <select
                      className="form-input"
                      name="baseUrl"
                      value={formData.baseUrl}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="tronpick.io">tronpick.io</option>
                      <option value="litepick.io">litepick.io</option>
                      <option value="dogepick.io">dogepick.io</option>
                      <option value="bnbpick.io">bnbpick.io</option>
                      <option value="solpick.io">solpick.io</option>
                      <option value="polpick.io">polpick.io</option>
                      <option value="tonpick.game">tonpick.game</option>
                      <option value="suipick.io">suipick.io</option>
                    </select>
                    <small className="text-slate-500 text-xs mt-1 block">Sélectionnez la plateforme pour ce compte</small>
                  </div>

                  <div>
                    <label className="form-label">Proxy</label>
                    <input
                      type="url"
                      className="form-input"
                      name="proxy"
                      value={formData.proxy}
                      onChange={handleInputChange}
                      placeholder="http://proxy:port"
                      required
                    />
                    <small className="text-slate-500 text-xs mt-1 block">Proxy pour les requêtes associées à ce compte</small>
                  </div>

                  {/* Add canGame toggle for account update */}
                  {editingAccountId && (
                    <div>
                      <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start flex-1">
                          <div className="mr-2 md:mr-3 flex-shrink-0">
                            <Gamepad2 size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <label className="form-label mb-0 block text-sm md:text-base">Activer le Game Auto</label>
                            <p className="text-slate-600 text-xs md:text-sm">
                              Jeu lancé toutes les heures si presence de STAMINA
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.canGame === 1}
                          onChange={(e) => handleToggleChange('canGame', e.target.checked)}
                          id="game-toggle"
                          />
                          <div className="w-9 md:w-11 h-5 md:h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-col md:flex-row">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        {editingAccountId ? 'Mise à jour...' : 'Ajout en cours...'}
                      </>
                    ) : editingAccountId ? (
                      <>
                        <Edit size={18} className="mr-1" />
                        Mettre à jour le compte
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="mr-1" />
                        Ajouter le compte
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-100"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accounts List with Animation */}
      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-10 text-center"
        >
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">Aucun compte ajouté</h4>
          <p className="text-slate-500">Ajoutez votre premier compte TronPick pour commencer</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {accounts
            .filter((account, index, self) => 
              index === self.findIndex(t => t.id === account.id)
            )
            .map((account, index) => (
              <motion.div key={`manager-${account.id}-${index}`}>
                <div className="glass-card overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-800 truncate max-w-[60%]" title={account.address}>
                        {account.address.slice(0, 12)}...
                      </h3>

                      <div className="flex space-x-1">
                        <button
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
                          onClick={() => handleEditAccount(account.id)}
                          title="Modifier le compte"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                          onClick={() => handleRemoveAccount(account.id)}
                          title="Supprimer le compte"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <small className="text-slate-500">Email complet:</small>
                      </div>
                      <div className="font-mono text-sm text-slate-700 break-all">
                        {account.address}
                      </div>
                    </div>

                    {/* Display Proxy Information */}
                    <div className="mb-4 bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <small className="text-slate-500">Proxy:</small>
                      </div>
                      <div className="font-mono text-sm text-slate-700 break-all">
                        {account.proxy ? account.proxy : 'Pas de proxy configuré'}
                      </div>
                    </div>

                    <div className="mb-4 bg-slate-50 rounded-lg p-3"></div>
                    <div className="flex justify-between items-center mb-1">
                      <small className="text-slate-500">Clé privée:</small>
                      <button
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        onClick={() => togglePrivateKeyVisibility(account.id)}
                        title={showPrivateKey === account.id ? "Masquer la clé" : "Afficher la clé"}
                      >
                        {showPrivateKey === account.id ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="font-mono text-sm text-slate-700 break-all">
                      {showPrivateKey === account.id
                        ? account.privateKey
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••'
                      }
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="font-bold text-green-600">{account.balance.toFixed(2)}</div>
                      <small className="text-slate-500 text-xs">TRX</small>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${account.status === 'active' ? 'bg-green-100 text-green-800' :
                          account.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {account.status === 'active' ? 'Actif' :
                          account.status === 'pending' ? 'En attente' : 'Erreur'}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 truncate" title={account.baseUrl || 'tronpick.io'}>
                        {account.baseUrl || 'tronpick.io'}
                      </div>
                      <small className="text-slate-500 text-xs">Plateforme</small>
                    </div>
                  </div>
                  
                  {/* Add Game status indicator */}
                  {account.canGame !== undefined && (
                    <div className="mt-3 flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center ${
                        account.canGame === 1 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <Gamepad2 size={12} className="mr-1" />
                        {account.canGame === 1 ? 'Auto-Game activé' : 'Auto-Game désactivé'}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default AccountManager;