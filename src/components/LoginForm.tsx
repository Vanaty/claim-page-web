import React, { useState } from 'react';
import { User, Mail, Lock, Wallet, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset } from '../services/apiService';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetRequestStatus, setResetRequestStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.username, formData.password);
    } else {
      onRegister(formData.username, formData.email, formData.password);
      setIsLogin(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(resetEmail);
      setResetRequestStatus({
        success: response.success,
        message: response.message
      });
      if (response.success) {
        // Vider l'email après une demande réussie
        setResetEmail('');
      }
    } catch (error) {
      console.error('Failed to request password reset:', error);
      setResetRequestStatus({
        success: false,
        message: "Une erreur s'est produite. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const goBackToLogin = () => {
    setIsForgotPassword(false);
    setResetRequestStatus(null);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {!isForgotPassword ? (
            <motion.div
              key="login-register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-8"
            >
              <div className="text-center mb-6">
                <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Wallet size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">TronPick Auto-Claim</h2>
                <p className="text-slate-500 mt-1">
                  {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
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
                  />
                </div>
                
                {!isLogin && (
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
                    />
                  </div>
                )}

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
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-full mt-6"
                >
                  {isLogin ? 'Se connecter' : 'Créer un compte'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin 
                    ? "Pas de compte ? Créez-en un" 
                    : "Déjà un compte ? Connectez-vous"
                  }
                </button>
              </div>

              {isLogin && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {!isLogin && (
                <div className="mt-6 bg-blue-50 text-blue-800 rounded-lg p-3 text-sm">
                  🎁 Bonus d'inscription: <strong>50 jetons gratuits</strong>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <div className="mb-6">
                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm mb-4"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Retour à la connexion
                </button>

                <h2 className="text-2xl font-bold text-slate-800">Réinitialisation du mot de passe</h2>
                <p className="text-slate-500 mt-1">
                  Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation
                </p>
              </div>

              <AnimatePresence>
                {resetRequestStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-lg flex items-start ${
                      resetRequestStatus.success
                        ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                        : 'bg-red-100 text-red-800 border-l-4 border-red-500'
                    }`}
                  >
                    <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                    <span>{resetRequestStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleResetRequest}>
                <div className="mb-4">
                  <label className="form-label flex items-center">
                    <Mail size={16} className="mr-2 text-slate-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                  <small className="text-slate-500 text-xs mt-1 block">
                    Entrez l'adresse email associée à votre compte
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </button>
              </form>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <p>Un email contenant un lien de réinitialisation vous sera envoyé si l'adresse est associée à un compte.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginForm;