import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Calendar, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center">
              <Shield size={28} className="text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-slate-800">Politique de confidentialité</h1>
            </div>
          </div>

          <div className="flex items-center text-sm text-slate-500 mb-8">
            <Calendar size={16} className="mr-2" />
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                TronPick Auto-Claim ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. 
                Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <Eye size={20} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Notre engagement :</h4>
                    <p className="text-blue-700">
                      Nous ne vendons, ne louons, ni ne partageons vos informations personnelles avec des tiers 
                      à des fins commerciales sans votre consentement explicite.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informations que nous collectons</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Informations d'inscription</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom d'utilisateur</li>
                <li>Adresse email</li>
                <li>Mot de passe (haché et sécurisé)</li>
                <li>Date d'inscription</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Informations de compte</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Adresses de portefeuilles crypto</li>
                <li>Informations de configuration des comptes</li>
                <li>Historique des transactions de jetons</li>
                <li>Logs d'activité du service</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Informations techniques</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Horodatage des connexions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Comment nous utilisons vos informations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Utilisation principale :</h4>
                  <ul className="list-disc pl-6 text-green-700 text-sm">
                    <li>Fournir le service d'auto-réclamation</li>
                    <li>Gérer votre compte utilisateur</li>
                    <li>Traiter les paiements et transactions</li>
                    <li>Assurer la sécurité du service</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Communication :</h4>
                  <ul className="list-disc pl-6 text-blue-700 text-sm">
                    <li>Notifications de service importantes</li>
                    <li>Support technique</li>
                    <li>Mises à jour de sécurité</li>
                    <li>Réponses à vos demandes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Sécurité des données</h2>
              <p className="mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos informations personnelles contre tout accès, modification, divulgation ou destruction non autorisés.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <Lock size={20} className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Mesures de sécurité :</h4>
                    <ul className="list-disc pl-6 text-yellow-700 text-sm">
                      <li>Chiffrement AES-256 pour les données sensibles</li>
                      <li>Hachage sécurisé des mots de passe avec bcrypt</li>
                      <li>Connexions HTTPS/TLS uniquement</li>
                      <li>Authentification à deux facteurs disponible</li>
                      <li>Surveillance continue des intrusions</li>
                      <li>Sauvegardes chiffrées régulières</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Partage des informations</h2>
              <p className="mb-4">
                Nous ne partageons vos informations personnelles qu'dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement</li>
                <li><strong>Prestataires de services :</strong> Cryptomus pour le traitement des paiements (données limitées)</li>
                <li><strong>Obligations légales :</strong> Si requis par la loi ou pour protéger nos droits</li>
                <li><strong>Urgences :</strong> Pour protéger la sécurité des utilisateurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
              <p className="mb-4">
                Conformément au RGPD et autres réglementations applicables, vous disposez des droits suivants :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droits d'accès et de contrôle :</h4>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Accès à vos données personnelles</li>
                    <li>Rectification des données inexactes</li>
                    <li>Suppression de vos données</li>
                    <li>Limitation du traitement</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droits de portabilité :</h4>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Portabilité des données</li>
                    <li>Opposition au traitement</li>
                    <li>Retrait du consentement</li>
                    <li>Dépôt de plainte auprès de la CNIL</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Conservation des données</h2>
              <p className="mb-4">
                Nous conservons vos informations personnelles uniquement pendant la durée nécessaire aux fins 
                pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Données de compte :</strong> Tant que votre compte est actif</li>
                <li><strong>Logs de transaction :</strong> 3 ans pour des raisons comptables</li>
                <li><strong>Données de support :</strong> 2 ans après la résolution</li>
                <li><strong>Données de sécurité :</strong> 1 an pour l'analyse des incidents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies et technologies similaires</h2>
              <p className="mb-4">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience utilisateur :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookies essentiels :</strong> Pour le fonctionnement du service</li>
                <li><strong>Cookies de préférence :</strong> Pour mémoriser vos paramètres</li>
                <li><strong>Cookies de sécurité :</strong> Pour protéger votre compte</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Transferts internationaux</h2>
              <p className="mb-4">
                Nos serveurs sont localisés dans l'Union Européenne. Si des transferts internationaux sont nécessaires, 
                nous nous assurons qu'ils respectent les réglementations en vigueur avec des garanties appropriées.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modifications de cette politique</h2>
              <p className="mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité occasionnellement. 
                Nous vous notifierons de tout changement important par email ou via notre plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Mail size={20} className="text-slate-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <ul className="space-y-2">
                      <li><strong>Email :</strong> privacy@tronpick-autoclaim.com</li>
                      <li><strong>Support :</strong> support@tronpick-autoclaim.com</li>
                      <li><strong>Telegram :</strong> @AutoClaimSupport</li>
                      <li><strong>Adresse :</strong> TronPick Auto-Claim, Protection des données personnelles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
