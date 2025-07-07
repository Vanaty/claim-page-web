import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Clock, ExternalLink, Copy, Check, Wallet, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SupportContactProps {
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const SupportContact: React.FC<SupportContactProps> = ({ showToast }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      if (showToast) {
        showToast('success', 'Copié dans le presse-papiers');
      }
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const supportMethods = [
    {
      id: 'telegram',
      title: 'Telegram',
      description: 'Support rapide',
      contact: '@AutoClaimSupport',
      icon: <MessageCircle size={24} className="text-blue-600" />,
      action: () => window.open('https://t.me/AutoClaimSupport', '_blank'),
      copyable: true
    },
    {
      id: 'discord',
      title: 'Discord',
      description: 'Communauté et support technique',
      contact: 'Auto-Claim Community',
      icon: <MessageCircle size={24} className="text-blue-600" />,
      action: () => window.open('https://discord.com/invite/dJQvwnTJ', '_blank'),
      copyable: false
    }
  ];

  const businessHours = [
    { day: 'Lundi - Vendredi', hours: '9:00 - 18:00 (UTC+1)' },
    { day: 'Samedi', hours: '10:00 - 16:00 (UTC+1)' },
    { day: 'Dimanche', hours: 'Support d\'urgence uniquement' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="text-blue-700" size={28} />
              <span className="font-bold text-xl text-slate-900">Auto-Claim</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#fonctionnement" className="text-slate-600 hover:text-blue-700 transition-colors">
                Comment ça marche
              </a>
              <a href="/#features" className="text-slate-600 hover:text-blue-700 transition-colors">
                Fonctionnalités
              </a>
              <a href="/#faq" className="text-slate-600 hover:text-blue-700 transition-colors">
                FAQ
              </a>
              <Link to="/support" className="text-blue-700 font-medium">
                Support
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-blue-700 transition-colors font-medium"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
              >
                S'inscrire
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-slate-700" />
              ) : (
                <Menu size={24} className="text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            className={`md:hidden overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isMobileMenuOpen ? 'auto' : 0, 
              opacity: isMobileMenuOpen ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 border-t border-slate-200">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="/#fonctionnement" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Comment ça marche
                </a>
                <a 
                  href="/#features" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Fonctionnalités
                </a>
                <a 
                  href="/#faq" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  FAQ
                </a>
                <Link 
                  to="/support" 
                  className="text-blue-700 font-medium px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Support
                </Link>
                <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                  <Link 
                    to="/login" 
                    className="text-slate-600 hover:text-blue-700 transition-colors font-medium px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    S'inscrire
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Support Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Support Technique
          </h1>
          <p className="text-lg text-slate-600">
            Nous sommes là pour vous aider avec vos questions techniques et problèmes
          </p>
        </motion.div>

        {/* Support Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {supportMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {method.icon}
                <h3 className="text-xl font-semibold text-slate-800 ml-3">
                  {method.title}
                </h3>
              </div>
              
              <p className="text-slate-600 mb-4">
                {method.description}
              </p>
              
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg mb-4">
                <span className="font-mono text-sm text-slate-700">
                  {method.contact}
                </span>
                {method.copyable && (
                  <button
                    onClick={() => copyToClipboard(method.contact, method.id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {copiedField === method.id ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
              </div>
              
              <button
                onClick={method.action}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Contacter
              </button>
            </motion.div>
          ))}
        </div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 rounded-xl mb-8"
        >
          <div className="flex items-center mb-4">
            <Clock size={24} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">
              Horaires de Support
            </h3>
          </div>
          
          <div className="space-y-3">
            {businessHours.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">{schedule.day}</span>
                <span className="text-slate-600">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Questions Fréquentes
          </h3>
          
          <div className="space-y-3">
            <div className="text-slate-600">
              <strong>Comment ajouter un compte ?</strong><br />
              Allez dans "Gestion des comptes" et cliquez sur "Ajouter un compte". Vous pouvez utiliser soit des cookies, soit vos identifiants de connexion.
            </div>
            
            <div className="text-slate-600">
              <strong>Pourquoi mon compte est en erreur ?</strong><br />
              Vérifiez vos identifiants et assurez-vous que votre proxy (si configuré) fonctionne correctement. Contactez-nous si le problème persiste.
            </div>
            
            <div className="text-slate-600">
              <strong>Comment acheter des jetons ?</strong><br />
              Rendez-vous dans "Acheter des jetons" et choisissez le forfait qui vous convient. Les paiements sont sécurisés via Cryptomus.
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-semibold mb-2">Support d'Urgence</h4>
            <p className="text-red-700 text-sm">
              Pour les problèmes critiques affectant vos comptes, contactez-nous immédiatement via Telegram : 
              <button
                onClick={() => copyToClipboard('@AutoClaimEmergency', 'emergency')}
                className="ml-2 text-red-800 hover:text-red-900 underline"
              >
                @AutoClaimEmergency
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportContact;
