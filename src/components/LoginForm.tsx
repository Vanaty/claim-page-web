import React, { useState } from 'react';
import { User, Mail, Lock, Wallet, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.username, formData.password);
    } else {
      onRegister(formData.username, formData.email, formData.password);
    }
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

          {!isLogin && (
            <div className="mt-6 bg-blue-50 text-blue-800 rounded-lg p-3 text-sm">
              🎁 Bonus d'inscription: <strong>50 jetons gratuits</strong>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;