import React, { useState } from 'react';
import { User, Mail, Lock, Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            <h2 className="text-2xl font-bold text-slate-800">Inscription</h2>
            <p className="text-slate-500 mt-1">
              Créez votre compte TronPick Auto-Claim
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

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={isLoading || !passwordMatch}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Inscription en cours...
                </div>
              ) : (
                'Créer un compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              Déjà un compte ? Connectez-vous
            </Link>
          </div>

          <div className="mt-6 bg-blue-50 text-blue-800 rounded-lg p-3 text-sm">
            🎁 Bonus d'inscription: <strong>50 jetons gratuits</strong>
          </div>

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