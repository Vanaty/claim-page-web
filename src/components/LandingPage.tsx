import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, Clock, Shield, ArrowRight, Users, ChevronDown, Mail, Facebook } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Qu'est-ce que TronPick Auto-Claim ?",
      answer: "TronPick Auto-Claim est un service automatisé qui vous permet de réclamer vos récompenses sur les plateformes de la famille Pick (TronPick, LitePick, DogePick, etc.) sans avoir à le faire manuellement."
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
      answer: "Le service consomme 1 jeton par réclamation automatique. Vous pouvez acheter des packs de jetons ou bénéficier de 50 jetons gratuits à l'inscription."
    },
    {
      question: "Sur quelles plateformes fonctionne l'Auto-Claim ?",
      answer: "Notre service est compatible avec TronPick.io, LitePick.io, DogePick.io, BnbPick.io, SolPick.io, PolPick.io, TonPick.game et SuiPick.io."
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Automatisez vos gains sur <span className="text-blue-700">TronPick</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Réclamez automatiquement vos récompenses sur les plateformes de la famille Pick sans effort. Plus besoin de connexions manuelles.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={onLoginClick}
                  className="btn btn-primary text-base px-6 py-3"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2" size={18} />
                </button>
                <a 
                  href="#fonctionnement" 
                  className="btn bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-base px-6 py-3"
                >
                  Comment ça marche ?
                </a>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card p-6 rounded-xl shadow-xl transform rotate-1">
                <div className="bg-blue-700 rounded-lg p-4 text-white text-center mb-4">
                  <Wallet size={40} className="mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Système Auto-Claim</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Zap size={18} className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <span className="font-medium text-slate-800">Claim automatique</span>
                      <div className="h-2 w-full bg-slate-200 rounded-full mt-1">
                        <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Prochain claim:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-blue-700">00:05:37</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Comptes actifs:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-green-700">3</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Total réclamé:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-blue-700">357.25 TRX</span>
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

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pourquoi choisir TronPick Auto-Claim</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Notre plateforme vous fait économiser du temps et maximiser vos gains sans effort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="fonctionnement" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comment ça marche</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              En seulement trois étapes simples, commencez à automatiser vos réclamations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          <div className="mt-12 text-center">
            <button 
              onClick={onLoginClick}
              className="btn btn-primary text-base px-6 py-3"
            >
              Démarrer mon Auto-Claim
              <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Questions fréquentes</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                  className={`w-full text-left p-4 rounded-lg flex justify-between items-center ${
                    activeFaq === index 
                      ? 'bg-blue-50 text-blue-700 shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  } transition-all duration-200`}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <ChevronDown 
                    size={20}
                    className={`transform transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 bg-white border border-slate-100 rounded-b-lg">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 py-16 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à automatiser vos réclamations ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des centaines d'utilisateurs qui ont déjà automatisé leurs réclamations et qui gagnent plus sans effort supplémentaire.
            </p>
            <button 
              onClick={onLoginClick}
              className="bg-white text-blue-700 hover:bg-blue-50 transition-colors px-8 py-4 rounded-lg font-bold text-lg"
            >
              Commencer gratuitement
            </button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuNDQyLS40MDggMy42NzItMS4yMjUgMy4yNC0xLjg5IDMuNjQtOS4zMjUgMy42NC0xNi43NzUgMCAwIDAgNS41IDIuMjUgNS41czIuMjUuMjI2IDIuMjUtMS9jMC0uNzEyLjY3LTEuNDU3IDEuMjQ3LTEuOTgyQzUwLjc2OC45MDYgNTIuNSAwIDUyLjUgMCA1Mi41IDAgNTAuNzY4LjkwNiA0OS4wNTkgMi41MThjLjU3Ny41MjUgMS4yNDYgMS4yNyAxLjI0NiAxLjk4MiAwIDEuMjI2IDAgMS41IDIuMjUgMS41czIuMjUtNS41IDIuMjUtNS41YzAgNy40NS40IDEzLjg4NSAzLjY0IDE2Ljc3NUMzOS41NTkgMTMuODg1IDQwIDcuNDUgNDAgMGMwIDAgMCA1LjUgMi4yNSA1LjVTNDQuNS41IDQ0LjUuNWMwLTIgMS41LTMgMS41LTMgMCAwLTEuNSAxLTEuNSAzczAgMi41IDIuMjUgMi41UzQ5IC41IDQ5IC41YzAtMi45LTIuNS00LjUtMi41LTQuNSAwIDAtMS40MDQuNTI0LTIuMzgyIDEuNTI2QzQ0Ljc0MyAxLjQ1IDQ1LjUgNS41IDQ1LjUgNS41YzAgNy40NS40IDEzLjg4NSAzLjY0IDE2Ljc3NUM0NS4zMTYgMTkuMDkyIDQzIDIxLjQ1IDQzIDI0LjVjMCA0Ljk3IDQuMDMgOSA5IDlzOS00LjAzIDktOWMwLTIuOTUzLTEuNDI0LTUuNTc0LTMuNjI3LTcuMjAzIDMuMzcyLTIuNzUzIDMuNjI3LTguOTc2IDMuNjI3LTE2LjI5NyAwIDAgMCA1LjUgMi4yNSA1LjVTNjUuNTcgMSA2NS41Ljc1YzAgMC0xLjUgMS4yNS0xLjUgMy4yNXMwIDIuNSAyLjI1IDIuNSA2LjUtMiA2LjUtNCAwLS41IDAtLjVTNjcuNy4yNyA2MC4zNzIgMi4wOTdjLjU3OC41MjUgMS4yNDggMS4yNyAxLjI0OCAxLjk4MiAwIDEuMjI2IDAgMS41IDIuMjUgMS41czIuMjUtNS41IDIuMjUtNS41YzAgNy40NS40IDEzLjg4NSAzLjY0IDE2Ljc3NUM2Ni41NTggMTMuODg1IDY3IDcuNDUgNjcgMGMwIDAgMCA1LjUgMi4yNSA1LjVTNzEuNS4yNSA3MS41LjI1YzAtMiAxLjUtMyAxLjUtMyAwIDAtMS41IDEtMS41IDNzMCAyLjUgMi4yNSAyLjVTNzYgLjI1IDc2IC4yNWMwLTIuOS0yLjUtNC41LTIuNS00LjUgMCAwLTEuNDA1LjUyNC0yLjM4MiAxLjUyNkM3MS43NDIgMS40NSA3Mi41IDUuNSA3Mi41IDUuNWMwIDcuNDUuNCAxMy44ODUgMy42NCAxNi43NzVBOC45NzggOC45NzggMCAwIDAgNzMgMzFjMCA0Ljk3IDQuMDMgOSA5IDlzOS00LjAzIDktOWMwLTQuMDk2LTIuNzQ4LTcuNTQ1LTYuNS04LjYyNSAzLjA5NS0zLjM4OCAzLjUtOS45NjkgMy41LTE2Ljg3NCAwIDAgMCA1LjUgMi4yNSA1LjVTOTIuNSAxIDkyLjUuNzVjMCAwLTEuNSAxLjI1LTEuNSAzLjI1czAgMi41IDIuMjUgMi41IDQuMjUtMS41IDQuMjUtMS41di0xYzAtMi0yLTMtMi0zIDAgMC0xLjQwNC41MjQtMi4zODIgMS41MjZDOTMuNzQzIDEuNDUgOTQuNSA1LjUgOTQuNSA1LjVjMCA3LjQ1LjQgMTMuODg1IDMuNjQgMTYuNzc1QTguOTM5IDguOTM5IDAgMCAwIDk2IDE4YzQuOTcgMCA5LTQuMDMgOS05cy00LjAzLTktOS05Yy0yLjk1MyAwLTUuNTczIDEuNDI0LTcuMjAzIDMuNjI3QzgxLjA0NiA3LjczMyA3Mi45NjggOSA2NiA5IDU5LjEwMyA5IDUxLjIyNCA4LjI0MyA0NC4yOTcgMy42MjcgNDIuNTc0IDEuMzcgMzkuODU1IDAgMzYgMHptMjEtOWM0LjQgMCA4IDMuNiA4IDhzLTMuNiA4LTggOC04LTMuNi04LThIMzZjMCA0LjQgMy42IDggOCA4czgtMy42IDgtOGgtNGMwIDIuMi0xLjggNC00IDRzLTQtMS44LTQtNC0xLjgtNC00LTQtNCAxLjgtNCA0YzAgMi4yIDEuOCA0IDQgNHM0LTEuOCA0LTRoLTJzLjMgMiAyIDJjMiAwIDItMiAyLTIgMC0xLjEuOS0yIDItMnMyIC45IDIgMiAwIDItMiAyYy0xLjcgMC0yLTItMi0yaC0yYzAgMi4yIDEuOCA0IDQgNHM0LTEuOCA0LTQtMS44LTQtNC00LTQgMS44LTQgNGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDRINDNjMC0zLjMtMi43LTYtNi02cy02IDIuNy02IDZoLTRjMC00LjQgMy42LTggOC04aDIyeiIvPjwvZz48L2c+PC9zdmc+')] bg-center"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Wallet className="text-blue-400 mr-2" size={24} />
              <span className="font-bold text-xl">TronPick Auto-Claim</span>
            </div>
            <div className="flex space-x-6">
              <a 
                href="https://web.facebook.com/61577170414462" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-400 transition-colors"
              >
                <Facebook size={20} className="mr-2" />
                <span>Facebook</span>
              </a>
              <a 
                href="mailto:eritiavina31@gmail.com" 
                className="flex items-center hover:text-blue-400 transition-colors"
              >
                <Mail size={20} className="mr-2" />
                <span>Contact</span>
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} TronPick Auto-Claim. Tous droits réservés.</p>
            <p className="mt-2">
              Email: <a href="mailto:eritiavina31@gmail.com" className="text-blue-400 hover:underline">eritiavina31@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
