import React, { useState } from 'react';
import { User, Lock, Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChristmasMode } from '../hooks/useChristmasMode';
import ChristmasDecorations from './ChristmasDecorations';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  
  const { isChristmasMode, getChristmasStyles } = useChristmasMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    onLogin(formData.username, formData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const christmasStyles = getChristmasStyles();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isChristmasMode ? christmasStyles.backgroundColor : 'bg-gradient-to-br from-blue-50 to-slate-100'}`}>
      {/* Christmas Decorations */}
      <ChristmasDecorations isActive={isChristmasMode} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className={`glass-card p-8 ${isChristmasMode ? 'christmas-card' : ''}`}>
          {/* Christmas Header */}
          {isChristmasMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-4"
            >
              <div className="text-4xl mb-2">🎄🎅🎁</div>
              <div className="text-lg font-semibold christmas-text mb-2">
                Joyeuses Fêtes !
              </div>
            </motion.div>
          )}
          
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <div className={`${isChristmasMode ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'} rounded-full w-16 h-16 flex items-center justify-center mx-auto ${isChristmasMode ? 'christmas-bounce' : ''}`}>
                <Wallet size={32} />
              </div>
            </Link>
            <h2 className={`text-2xl font-bold ${isChristmasMode ? 'christmas-text' : 'text-slate-800'}`}>
              {isChristmasMode ? '🎄 Connexion de Noël 🎄' : 'Connexion'}
            </h2>
            <p className="text-slate-500 mt-1">
              {isChristmasMode 
                ? '🎅 Connectez-vous pour profiter des offres de Noël ! 🎁' 
                : 'Connectez-vous à votre compte TronPick Auto-Claim'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label flex items-center">
                <User size={16} className="mr-2 text-slate-500" />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="form-input"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Votre nom d'utilisateur"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="form-label flex items-center">
                <Lock size={16} className="mr-2 text-slate-500" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* <div className="mt-4">
              <label className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-slate-600 leading-relaxed">
                  J'ai lu et j'accepte les <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Conditions d'utilisation</a> et la <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
                </span>
              </label>
            </div> */}

            <button
              type="submit"
              className={`btn w-full mt-6 ${isChristmasMode ? 'christmas-button text-white' : (acceptTerms ? 'btn-primary' : 'bg-slate-300 text-slate-500 cursor-not-allowed')}`}
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isChristmasMode ? '🎄 Connexion en cours... 🎄' : 'Connexion en cours...'}
                </div>
              ) : (
                isChristmasMode ? '🎅 Se connecter pour Noël 🎁' : 'Se connecter'
              )}
            </button>

            {!acceptTerms && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Vous devez accepter les conditions d'utilisation pour vous connecter
              </p>
            )}
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              to="/register"
              className={`${isChristmasMode ? 'christmas-text hover:opacity-80' : 'text-blue-600 hover:text-blue-800'} transition-colors text-sm block`}
            >
              {isChristmasMode ? '🎁 Pas de compte ? Rejoignez la fête ! 🎄' : 'Pas de compte ? Créez-en un'}
            </Link>

            <Link
              to="/forgot-password"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors block"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Christmas Footer Message */}
          {isChristmasMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <div className="text-xs text-slate-600 bg-gradient-to-r from-red-50 to-green-50 px-3 py-2 rounded-lg">
                ✨ Profitez de nos offres spéciales de fin d'année ! ✨
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;