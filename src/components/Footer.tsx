import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Mail, MessageCircle, Shield, FileText, Users, Globe, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Wallet size={24} className="mr-2 text-blue-400" />
              <span className="text-xl font-bold">TronPick Auto-Claim</span>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              Service automatisé de réclamation de récompenses crypto. 
              Maximisez vos gains sans effort avec notre plateforme sécurisée.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>TronPick Auto-Claim SAS</p>
              <p>SIRET: 12345678901234</p>
              <p>123 Rue de la Innovation</p>
              <p>75001 Paris, France</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <Users size={14} className="mr-2" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
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
                <Link to="/terms" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <FileText size={14} className="mr-2" />
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <Shield size={14} className="mr-2" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <Globe size={14} className="mr-2" />
                  Politique cookies
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center">
                  <FileText size={14} className="mr-2" />
                  Politique de remboursement
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
                <a href="mailto:support@tronpick-autoclaim.com" className="hover:text-blue-400 transition-colors">
                  support@tronpick-autoclaim.com
                </a>
              </li>
              <li className="flex items-center text-slate-300">
                <Mail size={14} className="mr-2" />
                <a href="mailto:privacy@tronpick-autoclaim.com" className="hover:text-blue-400 transition-colors">
                  privacy@tronpick-autoclaim.com
                </a>
              </li>
            </ul>

            <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Heures de support</h4>
              <p className="text-xs text-slate-400">
                Lun-Ven: 9h-18h (UTC+1)<br />
                Support d'urgence 24/7 via Telegram
              </p>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <Shield size={24} className="mx-auto text-green-400 mb-2" />
              <p className="text-xs font-medium">Conforme RGPD</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <Shield size={24} className="mx-auto text-blue-400 mb-2" />
              <p className="text-xs font-medium">Chiffrement AES-256</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <Globe size={24} className="mx-auto text-purple-400 mb-2" />
              <p className="text-xs font-medium">Serveurs EU</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <Heart size={24} className="mx-auto text-red-400 mb-2" />
              <p className="text-xs font-medium">Support 24/7</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 TronPick Auto-Claim SAS. Tous droits réservés.</p>
              <p className="text-xs mt-1">
                Service automatisé de réclamation crypto | Plateforme sécurisée et certifiée
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Uptime: 99.9%</span>
              <span>•</span>
              <span>10,000+ utilisateurs</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="bg-slate-700 p-4 rounded-lg text-xs text-slate-400">
            <p className="mb-2">
              <strong>Avertissement :</strong> TronPick Auto-Claim est un service d'automatisation qui interagit avec des plateformes tierces. 
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
