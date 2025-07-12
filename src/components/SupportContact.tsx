import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Phone, Clock, ExternalLink, Copy, Check, Wallet, Menu, X, Search, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Users, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportContactProps {
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const SupportContact: React.FC<SupportContactProps> = ({ showToast }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supportStatus, setSupportStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const navigate = useNavigate();

  // Simulate support status
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 18) {
      setSupportStatus('online');
    } else if (hour >= 18 && hour < 22) {
      setSupportStatus('busy');
    } else {
      setSupportStatus('offline');
    }
  }, []);

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
      description: 'Support rapide et communauté active',
      contact: '@AutoClaimSupport',
      icon: <MessageCircle size={24} className="text-blue-600" />,
      action: () => window.open('https://t.me/AutoClaimSupport', '_blank'),
      copyable: true,
      responseTime: '< 30 min',
      availability: supportStatus
    },
    {
      id: 'discord',
      title: 'Discord',
      description: 'Communauté et support technique',
      contact: 'Auto-Claim Community',
      icon: <MessageCircle size={24} className="text-indigo-600" />,
      action: () => window.open('https://discord.com/invite/dJQvwnTJ', '_blank'),
      copyable: false,
      responseTime: '< 1 heure',
      availability: supportStatus
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Support détaillé pour problèmes complexes',
      contact: 'support@'+ window.location.hostname,
      icon: <Mail size={24} className="text-green-600" />,
      action: () => window.open('mailto:support@'+window.location.hostname, '_blank'),
      copyable: true,
      responseTime: '< 24 heures',
      availability: 'online' as const
    }
  ];

  const businessHours = [
    { day: 'Lundi - Vendredi', hours: '9:00 - 18:00 (UTC+1)', status: 'primary' },
    { day: 'Samedi', hours: '10:00 - 16:00 (UTC+1)', status: 'secondary' },
    { day: 'Dimanche', hours: 'Support d\'urgence uniquement', status: 'emergency' }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment ajouter un compte ?',
      answer: 'Allez dans "Gestion des comptes" et cliquez sur "Ajouter un compte". Vous pouvez utiliser soit des cookies exportés depuis votre navigateur, soit vos identifiants de connexion. Pour les cookies, assurez-vous qu\'ils sont au format JSON valide.',
      category: 'comptes'
    },
    {
      id: '2',
      question: 'Pourquoi mon compte est en erreur ?',
      answer: 'Les erreurs de compte peuvent avoir plusieurs causes : identifiants expirés, cookies invalides, problème de proxy, ou restrictions IP. Vérifiez d\'abord vos identifiants, puis testez sans proxy. Si le problème persiste, contactez notre support.',
      category: 'problemes'
    },
    {
      id: '3',
      question: 'Comment acheter des jetons ?',
      answer: 'Rendez-vous dans "Acheter des jetons" et choisissez le forfait qui vous convient. Les paiements sont sécurisés via le réseau TRON (TRC-20). Vous recevrez vos jetons dans les 5-10 minutes après confirmation de la transaction.',
      category: 'jetons'
    },
    {
      id: '4',
      question: 'Qu\'est-ce qu\'un proxy et en ai-je besoin ?',
      answer: 'Un proxy masque votre adresse IP réelle. Il est recommandé d\'utiliser des proxies résidentiels pour éviter les détections. Chaque compte peut avoir son propre proxy pour une meilleure sécurité.',
      category: 'securite'
    },
    {
      id: '5',
      question: 'Combien de comptes puis-je gérer ?',
      answer: 'Le nombre de comptes dépend de votre forfait : Starter (5 comptes), Pro (25 comptes), Premium (100 comptes). Vous pouvez upgrader à tout moment.',
      category: 'comptes'
    },
    {
      id: '6',
      question: 'Mes jetons ne se rechargent pas, que faire ?',
      answer: 'Vérifiez d\'abord que vos comptes sont actifs et connectés. Assurez-vous que les sites supportent encore le système de jetons. Contactez le support si le problème persiste après 24h.',
      category: 'problemes'
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'busy':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'offline':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'busy':
        return 'Occupé';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'En ligne';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Support Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
            <Link
            to="/"
            className="flex items-center text-slate-600 hover:text-blue-700 transition-colors group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour</span>
            </Link>
        </motion.div>

        {/* Header with Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Users className="text-blue-600 mr-3" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Centre de Support
            </h1>
          </div>
          <p className="text-lg text-slate-600 mb-4">
            Notre équipe est là pour vous accompagner dans l'utilisation d'Auto-Claim
          </p>
          <div className="flex items-center justify-center space-x-2">
            {getStatusIcon(supportStatus)}
            <span className="text-sm font-medium text-slate-700">
              Support {getStatusText(supportStatus)}
            </span>
          </div>
        </motion.div>

        {/* Support Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {supportMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {method.icon}
                  <h3 className="text-xl font-semibold text-slate-800 ml-3">
                    {method.title}
                  </h3>
                </div>
                {getStatusIcon(method.availability)}
              </div>
              
              <p className="text-slate-600 mb-4">
                {method.description}
              </p>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
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
                <div className="flex items-center text-xs text-slate-500">
                  <Clock size={12} className="mr-1" />
                  Réponse: {method.responseTime}
                </div>
              </div>
              
              <button
                onClick={method.action}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center font-medium"
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 mb-12"
        >
          <div className="flex items-center mb-6">
            <Clock size={24} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">
              Horaires de Support
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessHours.map((schedule, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg">
                <div className="font-medium text-slate-800 mb-1">{schedule.day}</div>
                <div className="text-slate-600 text-sm">{schedule.hours}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 mb-12"
        >
          <div className="flex items-center mb-6">
            <HelpCircle size={24} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">
              Questions Fréquentes
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFAQ.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                    className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800">{item.question}</span>
                    {expandedFAQ === item.id ? (
                      <ChevronUp size={20} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === item.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-slate-600 bg-slate-50">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredFAQ.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucune question trouvée pour "{searchTerm}"
            </div>
          )}
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="text-red-600 mr-3" size={24} />
              <h4 className="text-red-800 font-semibold text-lg">Support d'Urgence</h4>
            </div>
            <p className="text-red-700 mb-4">
              Pour les problèmes critiques affectant vos comptes ou des urgences techniques
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => copyToClipboard('@AutoClaimEmergency', 'emergency')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
              >
                {copiedField === 'emergency' ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                @AutoClaimSupport
              </button>
              <button
                onClick={() => window.open('https://t.me/AutoClaimSupport', '_blank')}
                className="bg-white text-red-600 border border-red-300 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Contacter
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportContact;
