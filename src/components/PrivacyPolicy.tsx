import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Calendar, Mail, UserCheck, Database, Cookie, Scale, Clock, Download } from 'lucide-react';

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
            <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800 transition-colors">
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
                Auto-Claim s'engage à protéger et respecter votre vie privée. 
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
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Scale size={24} className="mr-2 text-blue-600" />
                3. Base légale du traitement
              </h2>
              <p className="mb-4">
                Conformément au RGPD, nous traitons vos données personnelles sur la base de :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Exécution du contrat :</h4>
                  <ul className="list-disc pl-6 text-purple-700 text-sm">
                    <li>Création et gestion de votre compte</li>
                    <li>Fourniture du service d'auto-claim</li>
                    <li>Traitement des paiements</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Intérêt légitime :</h4>
                  <ul className="list-disc pl-6 text-indigo-700 text-sm">
                    <li>Sécurité et prévention des fraudes</li>
                    <li>Amélioration de nos services</li>
                    <li>Support technique</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Comment nous utilisons vos informations</h2>
              
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
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clock size={24} className="mr-2 text-blue-600" />
                5. Conservation des données
              </h2>
              <p className="mb-4">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour les finalités décrites :
              </p>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <Database size={20} className="text-orange-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Périodes de conservation :</h4>
                    <ul className="list-disc pl-6 text-orange-700 text-sm space-y-1">
                      <li><strong>Données de compte :</strong> Tant que votre compte est actif + 3 ans après suppression</li>
                      <li><strong>Logs de transaction :</strong> 5 ans pour des raisons comptables et fiscales</li>
                      <li><strong>Données de support :</strong> 2 ans après résolution du problème</li>
                      <li><strong>Données techniques :</strong> 12 mois maximum</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cookie size={24} className="mr-2 text-blue-600" />
                6. Cookies et technologies similaires
              </h2>
              <p className="mb-4">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Essentiels :</h4>
                  <ul className="list-disc pl-6 text-gray-700 text-sm">
                    <li>Authentification</li>
                    <li>Sécurité CSRF</li>
                    <li>Préférences</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Fonctionnels :</h4>
                  <ul className="list-disc pl-6 text-blue-700 text-sm">
                    <li>Session utilisateur</li>
                    <li>Configuration UI</li>
                    <li>Langue</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Analytiques :</h4>
                  <ul className="list-disc pl-6 text-green-700 text-sm">
                    <li>Statistiques d'usage</li>
                    <li>Performance</li>
                    <li>Erreurs</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Sécurité des données</h2>
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
                      <li>Surveillance continue des intrusions</li>
                      <li>Sauvegardes chiffrées régulières</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Partage des informations</h2>
              <p className="mb-4">
                Nous ne partageons vos informations personnelles que dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement</li>
                <li><strong>Obligations légales :</strong> Si requis par la loi ou pour protéger nos droits</li>
                <li><strong>Urgences :</strong> Pour protéger la sécurité des utilisateurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <UserCheck size={24} className="mr-2 text-blue-600" />
                9. Vos droits (RGPD)
              </h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">Droits d'accès et contrôle :</h4>
                  <ul className="list-disc pl-6 text-teal-700 text-sm space-y-1">
                    <li><strong>Accès :</strong> Obtenir une copie de vos données</li>
                    <li><strong>Rectification :</strong> Corriger les données inexactes</li>
                    <li><strong>Effacement :</strong> Supprimer vos données ("droit à l'oubli")</li>
                    <li><strong>Limitation :</strong> Restreindre le traitement</li>
                  </ul>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-cyan-800 mb-2">Droits de portabilité :</h4>
                  <ul className="list-disc pl-6 text-cyan-700 text-sm space-y-1">
                    <li><strong>Portabilité :</strong> Récupérer vos données dans un format structuré</li>
                    <li><strong>Opposition :</strong> Vous opposer au traitement</li>
                    <li><strong>Réclamation :</strong> Contacter l'autorité de protection des données</li>
                    <li><strong>Retrait :</strong> Retirer votre consentement à tout moment</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Download size={20} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Exercer vos droits :</h4>
                    <p className="text-blue-700 text-sm">
                      Pour exercer ces droits, contactez-nous via l'adresse email ci-dessous. 
                      Nous répondrons dans un délai maximum de 30 jours. Une vérification d'identité pourra être demandée.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Transferts internationaux</h2>
              <p className="mb-4">
                Nos serveurs sont localisés dans l'Union Européenne. Si des transferts internationaux sont nécessaires, 
                nous nous assurons qu'ils respectent les réglementations en vigueur avec des garanties appropriées.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Modifications de cette politique</h2>
              <p className="mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité occasionnellement. 
                Nous vous notifierons de tout changement important par email ou via notre plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail size={24} className="mr-2 text-blue-600" />
                12. Contact et délégué à la protection des données
              </h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Contact principal :</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Mail size={16} className="mr-2 text-slate-600" />
                      <span><strong>Email :</strong> privacy@{window.location.hostname}</span>
                    </li>
                    <li className="flex items-center">
                      <Mail size={16} className="mr-2 text-slate-600" />
                      <span><strong>Support :</strong> support@{window.location.hostname}</span>
                    </li>
                    <li><strong>Telegram :</strong> @AutoClaimSupport</li>
                    <li><strong>Délai de réponse :</strong> 48-72h maximum</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Délégué à la protection des données (DPO) :</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Mail size={16} className="mr-2 text-blue-600" />
                      <span><strong>Email DPO :</strong> dpo@{window.location.hostname}</span>
                    </li>
                    <li><strong>Adresse :</strong> Auto-Claim DPO<br />Protection des données personnelles<br />Union Européenne</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <p className="text-amber-800 text-sm">
                  <strong>Autorité de contrôle :</strong> Si vous n'êtes pas satisfait de notre réponse, 
                  vous pouvez également déposer une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) 
                  ou de l'autorité de protection des données de votre pays de résidence.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
