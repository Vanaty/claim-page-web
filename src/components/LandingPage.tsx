import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Zap, Clock, Shield, ArrowRight, Users, ChevronDown, Menu, X } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const faqs = [
    {
      question: "Qu'est-ce qu'Auto-Claim ?",
      answer: "Auto-Claim est un service automatisé qui vous permet de réclamer vos récompenses sur les plateformes de crypto-monnaies sans avoir à le faire manuellement."
    },
    {
      question: "Comment fonctionne l'auto-claim ?",
      answer: "Notre système se connecte automatiquement à votre compte à intervalles réguliers pour réclamer vos récompenses. Il suffit d'ajouter vos informations de compte et notre système s'occupe du reste."
    },
    {
      question: "Est-ce que mes informations sont sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout pour protéger vos données. Vos clés privées ne sont jamais accessibles par notre équipe et sont stockées de manière sécurisée."
    },
    {
      question: "Combien de jetons sont nécessaires pour utiliser le service ?",
      answer: "Le service consomme 1 jeton par réclamation automatique. Vous pouvez acheter des packs de jetons ou bénéficier de 24 jetons gratuits à l'inscription."
    },
    {
      question: "Comment acheter des jetons ?",
      answer: "Vous pouvez acheter des jetons directement depuis notre plateforme en utilisant des crypto-monnaies populaires comme TRX, USDT ou BTC. Nous proposons différents packs adaptés à vos besoins."
    }
  ];

  const features = [
    {
      icon: <Clock size={24} className="text-blue-600" />,
      title: "Réclamation Automatique",
      description: "Notre système réclame automatiquement vos récompenses à intervalles réguliers sans aucune intervention de votre part."
    },
    {
      icon: <Shield size={24} className="text-blue-600" />,
      title: "Sécurité Maximale",
      description: "Vos informations sont chiffrées et sécurisées, garantissant la protection totale de vos comptes et de vos actifs."
    },
    {
      icon: <Wallet size={24} className="text-blue-600" />,
      title: "Multi-Plateformes",
      description: "Compatible avec toute la famille des plateformes Pick, incluant TronPick, LitePick, DogePick et plus encore."
    }
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
              <span className="text-xl font-bold text-slate-800">TronPick Auto-Claim</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                À propos
              </Link>
              <Link to="/support" className="text-slate-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link to="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
                Conditions
              </Link>
              <Link to="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
                Confidentialité
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
                  href="#fonctionnement" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Comment ça marche
                </a>
                <a 
                  href="#features" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Fonctionnalités
                </a>
                <a 
                  href="#faq" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  FAQ
                </a>
                <Link 
                  to="/support" 
                  className="text-slate-600 hover:text-blue-700 transition-colors px-2 py-1"
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Automatisez vos gains avec <span className="text-blue-700">Auto-Claim</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-6 md:mb-8">
                Réclamez automatiquement vos récompenses sur vos plateformes préférées sans effort. Plus besoin de connexions manuelles.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register"
                  className="btn btn-primary text-base px-6 py-3 flex items-center justify-center"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a 
                  href="#fonctionnement" 
                  className="btn bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-base px-6 py-3 flex items-center justify-center"
                >
                  Comment ça marche ?
                </a>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 w-full"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card p-4 md:p-6 rounded-xl shadow-xl transform rotate-1 max-w-md mx-auto md:max-w-none">
                <div className="bg-blue-700 rounded-lg p-4 text-white text-center mb-4">
                  <Wallet size={32} className="mx-auto mb-2 md:w-10 md:h-10" />
                  <h3 className="text-lg md:text-xl font-semibold">Système Auto-Claim</h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <Zap size={18} className="text-green-600" />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <span className="font-medium text-slate-800 text-sm md:text-base">Claim automatique</span>
                      <div className="h-2 w-full bg-slate-200 rounded-full mt-1">
                        <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm md:text-base">Prochain claim:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-blue-700 text-sm">00:05:37</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm md:text-base">Comptes actifs:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-green-700 text-sm">3</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm md:text-base">Total réclamé:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-blue-700 text-sm">357.25 TRX</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* New Feature Announcement */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-4">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">NOUVEAU</span>
              <span className="font-semibold">Achat de jetons par crypto maintenant disponible !</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Payez en crypto et recevez des bonus exclusifs
            </h2>
            <p className="text-lg md:text-xl mb-6 opacity-90 max-w-3xl mx-auto">
              Achetez vos jetons avec USDT, TRX, DOGE et autres cryptos. 
              Profitez de <span className="font-bold text-yellow-300">bonus jusqu'à +150 jetons</span> selon votre pack !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
              >
                Découvrir les packs
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <div className="text-sm opacity-80">
                ✓ Paiement sécurisé ✓ Confirmation rapide ✓ Support multi-réseaux
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Pourquoi choisir Auto-Claim</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Notre plateforme vous fait économiser du temps et maximiser vos gains sans effort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="fonctionnement" className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Comment ça marche</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              En seulement trois étapes simples, commencez à automatiser vos réclamations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              className="glass-card p-6 rounded-xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-2">Créez un compte</h3>
              <p className="text-slate-600">
                Inscrivez-vous et obtenez 50 jetons gratuits pour commencer à utiliser notre service. Chaque jeton vous permet une réclamation automatique.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-6 rounded-xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-2">Ajoutez vos comptes</h3>
              <p className="text-slate-600">
                Entrez vos informations de compte (email et clé privée) pour chacune des plateformes Pick que vous souhaitez automatiser.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-6 rounded-xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-2">Relaxez-vous</h3>
              <p className="text-slate-600">
                Notre système s'occupe de tout. Vous pouvez suivre les résultats en temps réel dans votre tableau de bord et voir vos gains s'accumuler.
              </p>
            </motion.div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <Link 
              to="/register"
              className="btn btn-primary text-base px-6 py-3 inline-flex items-center"
            >
              Démarrer mon Auto-Claim
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Questions fréquentes</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur notre service d'auto-claim
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-4 rounded-lg flex justify-between items-start ${
                    activeFaq === index 
                      ? 'bg-blue-50 text-blue-700 shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  } transition-all duration-200`}
                >
                  <span className="font-medium text-base md:text-lg pr-4">{faq.question}</span>
                  <ChevronDown 
                    size={20}
                    className={`transform transition-transform duration-200 flex-shrink-0 mt-1 ${activeFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 bg-white border border-slate-100 rounded-b-lg">
                    <p className="text-sm md:text-base text-slate-700">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Sécurité & Conformité</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Votre sécurité est notre priorité. Nous respectons les plus hauts standards de l'industrie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Shield size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Conforme RGPD</h3>
              <p className="text-slate-600 text-sm">
                Protection complète de vos données personnelles selon les réglementations européennes
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Shield size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chiffrement AES-256</h3>
              <p className="text-slate-600 text-sm">
                Vos données sont protégées par un chiffrement de niveau bancaire
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Users size={48} className="mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">10,000+ Utilisateurs</h3>
              <p className="text-slate-600 text-sm">
                Une communauté de confiance qui nous fait confiance quotidiennement
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Clock size={48} className="mx-auto text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Support 24/7</h3>
              <p className="text-slate-600 text-sm">
                Assistance disponible en permanence via Telegram et Discord
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-blue-50 px-6 py-3 rounded-full">
              <span className="text-blue-800 font-medium mr-2">🏆 Certifié par :</span>
              <span className="text-blue-600">RGPD • ISO 27001 (en cours)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;