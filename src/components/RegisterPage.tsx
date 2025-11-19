import React, { useState } from 'react';
import { User, Mail, Lock, Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChristmasMode } from '../hooks/useChristmasMode';
import ChristmasDecorations from './ChristmasDecorations';

interface RegisterPageProps {
  onRegister: (username: string, email: string, password: string) => void;
  isLoading?: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, isLoading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { isChristmasMode, getChristmasStyles } = useChristmasMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    setPasswordMatch(true);
    onRegister(formData.username, formData.email, formData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password match in real time
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword') {
        setPasswordMatch(value === formData.password);
      } else {
        setPasswordMatch(formData.confirmPassword === value);
      }
    }
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
              <div className="text-4xl mb-2">🎁🎄🎅</div>
              <div className="text-lg font-semibold christmas-text mb-2">
                Rejoignez la magie de Noël !
              </div>
            </motion.div>
          )}
          
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <div className={`${isChristmasMode ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-700'} rounded-full w-16 h-16 flex items-center justify-center mx-auto ${isChristmasMode ? 'christmas-bounce' : ''}`}>
                <Wallet size={32} />
              </div>
            </Link>
            <h2 className={`text-2xl font-bold ${isChristmasMode ? 'christmas-text' : 'text-slate-800'}`}>
              {isChristmasMode ? '🎄 Inscription de Noël 🎁' : 'Inscription'}
            </h2>
            <p className="text-slate-500 mt-1">
              {isChristmasMode 
                ? '🎅 Créez votre compte et profitez des bonus de Noël ! ✨' 
                : 'Créez votre compte TronPick Auto-Claim'
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
                minLength={3}
              />
            </div>
            
            <div>
              <label className="form-label flex items-center">
                <Mail size={16} className="mr-2 text-slate-500" />
                Email
              </label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre@email.com"
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
                  minLength={6}
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

            <div>
              <label className="form-label flex items-center">
                <Lock size={16} className="mr-2 text-slate-500" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input pr-10 ${
                    !passwordMatch && formData.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!passwordMatch && formData.confirmPassword && (
                <small className="text-red-500 block mt-1">
                  Les mots de passe ne correspondent pas
                </small>
              )}
            </div>

            <div className="mt-4">
              <label className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  required
                />
                <span className="text-slate-600 leading-relaxed">
                  J'ai lu et j'accepte les <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Conditions d'utilisation</a> et la <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn w-full mt-6 ${isChristmasMode ? 'christmas-button text-white' : 'btn-primary'}`}
              disabled={isLoading || !passwordMatch || !acceptTerms}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isChristmasMode ? '🎄 Inscription en cours... 🎁' : 'Inscription en cours...'}
                </div>
              ) : (
                isChristmasMode ? '🎅 Rejoindre la magie de Noël ! 🎄' : 'Créer un compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`${isChristmasMode ? 'christmas-text hover:opacity-80' : 'text-blue-600 hover:text-blue-800'} transition-colors text-sm`}
            >
              {isChristmasMode ? '🎄 Déjà un compte ? Connectez-vous pour Noël ! 🎅' : 'Déjà un compte ? Connectez-vous'}
            </Link>
          </div>

          <div className={`mt-6 ${isChristmasMode ? 'bg-gradient-to-r from-red-50 to-green-50 border border-red-200' : 'bg-blue-50'} rounded-lg p-3 text-sm`}>
            {isChristmasMode ? (
              <div className="christmas-text text-center">
                🎁 <strong>Bonus de Noël:</strong> 24 jetons gratuits + bonus spéciaux ! 🎄
              </div>
            ) : (
              <div className="text-blue-800">
                🎁 Bonus d'inscription: <strong>24 jetons gratuits</strong>
              </div>
            )}
          </div>

          {/* Christmas Special Message */}
          {isChristmasMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center"
            >
              <div className="text-xs text-slate-600 bg-gradient-to-r from-green-50 to-red-50 px-3 py-2 rounded-lg border border-green-200">
                ✨ Inscrivez-vous maintenant et découvrez nos offres exclusives de fin d'année ! ✨
              </div>
            </motion.div>
          )}

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;