import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Mail, MessageCircle, Shield, FileText, Users, Globe, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Wallet size={24} className="mr-2 text-blue-400" />
              <span className="text-xl font-bold">Auto-Claim</span>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              Service automatisé de réclamation de récompenses crypto. 
              Maximisez vos gains sans effort avec notre plateforme sécurisée.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Users size={14} className="mr-2" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <MessageCircle size={14} className="mr-2" />
                  Support
                </Link>
              </li>
              <li>
                <a href="https://t.me/AutoClaimSupport" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <MessageCircle size={14} className="mr-2" />
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://discord.com/invite/dJQvwnTJ" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <MessageCircle size={14} className="mr-2" />
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/terms" 
                  className="text-slate-300 hover:text-blue-400 transition-colors flex items-center"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <FileText size={14} className="mr-2" />
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-slate-300 hover:text-blue-400 transition-colors flex items-center"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <Shield size={14} className="mr-2" />
                    Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-slate-300">
                <Mail size={14} className="mr-2" />
                <a href={"mailto:support@"+ window.location.hostname} className="hover:text-blue-400 transition-colors">
                  support@{window.location.hostname}
                </a>
              </li>
              <li className="flex items-center text-slate-300">
                <Mail size={14} className="mr-2" />
                <a href={"mailto:privacy@" + window.location.hostname} className="hover:text-blue-400 transition-colors">
                  privacy@{window.location.hostname}
                </a>
              </li>
            </ul>

            <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Heures de support</h4>
              <p className="text-xs text-slate-400">
                Lun-Ven: 9h-18h (UTC)<br />
                Support d'urgence 24/7 via Telegram
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; { new Date().getFullYear() } Auto-Claim. Tous droits réservés.</p>
              <p className="text-xs mt-1">
                Service automatisé de réclamation crypto | Plateforme sécurisée et certifiée
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Uptime: 99.9%</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="bg-slate-700 p-4 rounded-lg text-xs text-slate-400">
            <p className="mb-2">
              <strong>Avertissement :</strong> Auto-Claim est un service d'automatisation qui interagit avec des plateformes tierces. 
              Nous ne sommes pas affiliés aux plateformes supportées. Les utilisateurs sont responsables du respect des conditions d'utilisation 
              de chaque plateforme.
            </p>
            <p>
              <strong>Risques :</strong> Les crypto-monnaies sont volatiles. Ne réclamez que ce que vous pouvez vous permettre de perdre. 
              Consultez un conseiller financier si nécessaire.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
