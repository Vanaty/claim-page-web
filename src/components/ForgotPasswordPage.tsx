import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset } from '../services/apiService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetRequestStatus, setResetRequestStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(email);
      setResetRequestStatus({
        success: response.success,
        message: response.message
      });
      if (response.success) {
        setEmail('');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="mb-6">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour à la connexion
            </Link>

            <h2 className="text-2xl font-bold text-slate-800">Mot de passe oublié</h2>
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label flex items-center">
                <Mail size={16} className="mr-2 text-slate-500" />
                Email
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={isSubmitting}
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

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              Pas encore de compte ? Inscrivez-vous
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;