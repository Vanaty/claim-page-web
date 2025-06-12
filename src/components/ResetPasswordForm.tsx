import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPassword } from '../services/apiService';

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
  }>({ score: 0, message: '' });

  useEffect(() => {
    // Simple password strength check
    const checkPasswordStrength = (password: string) => {
      if (!password) return { score: 0, message: '' };
      
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      let message = '';
      switch (score) {
        case 0:
        case 1:
          message = 'Très faible';
          break;
        case 2:
          message = 'Faible';
          break;
        case 3:
          message = 'Moyen';
          break;
        case 4:
          message = 'Fort';
          break;
        case 5:
          message = 'Très fort';
          break;
      }

      return { score, message };
    };

    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetStatus({
        success: false,
        message: 'Les mots de passe ne correspondent pas.'
      });
      return;
    }

    if (passwordStrength.score < 3) {
      setResetStatus({
        success: false,
        message: 'Le mot de passe est trop faible. Il doit contenir au moins 8 caractères, des majuscules, des minuscules et des chiffres.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, newPassword);
      setResetStatus({
        success: response.success,
        message: response.message
      });
      if (response.success) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      setResetStatus({
        success: false,
        message: "Une erreur s'est produite. Le lien est peut-être expiré ou invalide."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-lime-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-slate-200';
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
            <h2 className="text-2xl font-bold text-slate-800">Réinitialisation du mot de passe</h2>
            <p className="text-slate-500 mt-1">
              Créer un nouveau mot de passe
            </p>
          </div>

          {resetStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              resetStatus.success
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                : 'bg-red-100 text-red-800 border-l-4 border-red-500'
            }`}>
              {resetStatus.success 
                ? <CheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                : <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              }
              <span>{resetStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label flex items-center">
                <Lock size={16} className="mr-2 text-slate-500" />
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password strength bar */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${passwordStrength.score * 20}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Force :</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' : 
                      passwordStrength.score === 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>{passwordStrength.message}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="form-label flex items-center">
                <Lock size={16} className="mr-2 text-slate-500" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <small className="text-red-500 block mt-1">
                  Les mots de passe ne correspondent pas
                </small>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Réinitialisation en cours...
                </div>
              ) : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="font-medium">Conseils pour un mot de passe fort :</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Au moins 8 caractères</li>
                  <li>Lettres majuscules et minuscules</li>
                  <li>Nombres et caractères spéciaux</li>
                  <li>Évitez les informations personnelles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;
