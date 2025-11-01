import React, { useState } from 'react';
import { User, Lock, Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Wallet size={32} />
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-slate-800">Connexion</h2>
            <p className="text-slate-500 mt-1">
              Connectez-vous à votre compte TronPick Auto-Claim
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
              className={`btn w-full mt-6 ${acceptTerms ? 'btn-primary' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
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
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm block"
            >
              Pas de compte ? Créez-en un
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
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;