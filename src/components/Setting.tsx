import React from 'react';
import { User as UserIcon, Mail, Calendar, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface SettingsProps {
  user: User;
}

const Setting: React.FC<SettingsProps> = ({ user }) => {
  // Format the registration date
  const formattedDate = new Date(user.registeredAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // First 8 and last 4 characters of the user ID
  const truncatedUserId = `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 4)}`;

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
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    alert('ID copié dans le presse-papier');
                  }}
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
        
        {/* Settings Options - For Future Use */}
        <motion.div 
          className="md:col-span-3 glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Options avancées</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-700">
                Les paramètres avancés seront disponibles dans une future mise à jour. 
                Ils permettront de configurer les notifications, modifier le mot de passe et personnaliser votre expérience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Setting;
