import React, { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Key, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { changePassword } from '../services/apiService';

interface SettingsProps {
  user: User;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const Setting: React.FC<SettingsProps> = ({ user, showToast }) => {
  // Password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Format the registration date
  const formattedDate = new Date(user.registeredAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // First 8 and last 4 characters of the user ID
  const truncatedUserId = `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 4)}`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    if (showToast) {
      showToast('success', message);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      if (showToast) showToast('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      if (showToast) showToast('error', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
      if (showToast) showToast('error', 'Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (response.success) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        if (showToast) showToast('success', 'Mot de passe modifié avec succès !');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess(false);
          setShowPasswordSection(false);
        }, 3000);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      setPasswordError(errorMessage);
      if (showToast) showToast('error', errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <motion.div 
          className="md:col-span-2 glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Profil Utilisateur</h3>
            
            <div className="flex flex-col md:flex-row">
              {/* User Avatar */}
              <div className="mb-4 md:mb-0 md:mr-6 flex flex-col items-center">
                <div className="bg-blue-100 text-blue-700 rounded-full w-24 h-24 flex items-center justify-center mb-2">
                  <UserIcon size={48} />
                </div>
                <span className="text-sm text-slate-500">@{user.username}</span>
              </div>
              
              {/* User Details */}
              <div className="flex-grow">
                <div className="space-y-4">
                  <div className="glass-card bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <UserIcon size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-slate-500">Nom d'utilisateur</span>
                    </div>
                    <div className="font-medium text-slate-800">{user.username}</div>
                  </div>
                  
                  <div className="glass-card bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Mail size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-slate-500">Email</span>
                    </div>
                    <div className="font-medium text-slate-800">{user.email}</div>
                  </div>
                  
                  <div className="glass-card bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Calendar size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-slate-500">Date d'inscription</span>
                    </div>
                    <div className="font-medium text-slate-800">{formattedDate}</div>
                  </div>
                  
                  <div className="glass-card bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Key size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-slate-500">Identifiant utilisateur</span>
                    </div>
                    <div className="font-mono text-sm text-slate-800" title={user.id}>{truncatedUserId}</div>
                    <small className="text-slate-500 text-xs mt-1 block">
                      Cet identifiant est unique et nécessaire pour les transferts de jetons
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Account Statistics */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Jetons & Statistiques</h3>
            
            <div className="mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl mb-2">
                <span className="block text-white text-sm font-medium mb-1">Solde actuel</span>
                <span className="text-3xl font-bold text-white">{user.tokens}</span>
              </div>
              <p className="text-xs text-center text-slate-500">
                Les jetons sont nécessaires pour effectuer des réclamations automatiques
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-sm text-slate-600">ID Complet</span>
                <button 
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200"
                  onClick={() => copyToClipboard(user.id, 'ID copié dans le presse-papier')}
                >
                  Copier
                </button>
              </div>
              
              <div className="p-3 bg-white/50 rounded-lg">
                <div className="text-xs font-mono break-all select-all text-slate-600">
                  {user.id}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Settings Options - Password Change */}
        <motion.div 
          className="md:col-span-3 glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <Lock size={24} className="mr-2 text-blue-600" />
                Sécurité & Mot de passe
              </h3>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showPasswordSection 
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showPasswordSection ? 'Annuler' : 'Changer le mot de passe'}
              </button>
            </div>

            <AnimatePresence>
              {!showPasswordSection ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
                >
                  <p className="text-sm text-blue-700 flex items-start">
                    <Key size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Protégez votre compte en utilisant un mot de passe fort. 
                      Cliquez sur "Changer le mot de passe" pour le modifier.
                    </span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    {/* Success Message */}
                    <AnimatePresence>
                      {passwordSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                        >
                          <div className="flex items-center text-green-700">
                            <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                            <span className="font-medium">Mot de passe modifié avec succès !</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                      {passwordError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                        >
                          <div className="flex items-center text-red-700">
                            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                            <span className="font-medium">{passwordError}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          className="form-input w-full pr-10"
                          placeholder="••••••••"
                          required
                          disabled={isChangingPassword}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={isChangingPassword}
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          className="form-input w-full pr-10"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isChangingPassword}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={isChangingPassword}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <small className="text-slate-500 text-xs mt-1 block">
                        Minimum 6 caractères requis
                      </small>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className={`form-input w-full pr-10 ${
                            passwordData.confirmPassword && 
                            passwordData.newPassword !== passwordData.confirmPassword
                              ? 'border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          placeholder="••••••••"
                          required
                          disabled={isChangingPassword}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isChangingPassword}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordData.confirmPassword && 
                       passwordData.newPassword !== passwordData.confirmPassword && (
                        <small className="text-red-500 block mt-1">
                          Les mots de passe ne correspondent pas
                        </small>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={
                          isChangingPassword || 
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !== passwordData.confirmPassword
                        }
                        className="flex-1 btn btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isChangingPassword ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Modification en cours...
                          </div>
                        ) : (
                          'Modifier le mot de passe'
                        )}
                      </button>
                    </div>

                    {/* Security Tips */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Conseils de sécurité
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1 ml-6 list-disc">
                        <li>Utilisez au moins 8 caractères</li>
                        <li>Mélangez lettres majuscules, minuscules, chiffres et symboles</li>
                        <li>Évitez les informations personnelles évidentes</li>
                        <li>Ne réutilisez pas vos mots de passe sur d'autres sites</li>
                      </ul>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Setting;
