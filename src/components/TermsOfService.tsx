import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Calendar } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
              <FileText size={28} className="text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-slate-800">Conditions d'utilisation</h1>
            </div>
          </div>

          <div className="flex items-center text-sm text-slate-500 mb-8">
            <Calendar size={16} className="mr-2" />
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
              <p className="mb-4">
                En accédant et en utilisant TronPick Auto-Claim ("le Service"), vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
              <p className="mb-4">
                TronPick Auto-Claim est un service automatisé qui permet aux utilisateurs de réclamer automatiquement leurs récompenses 
                sur diverses plateformes de crypto-monnaies compatibles. Notre service utilise un système de jetons pour fonctionner.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Service d'auto-réclamation automatisé</li>
                <li>Support multi-plateformes (TronPick, LitePick, DogePick, etc.)</li>
                <li>Système de jetons pour les opérations</li>
                <li>Interface utilisateur sécurisée</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Inscription et comptes utilisateur</h2>
              <p className="mb-4">
                Pour utiliser notre service, vous devez créer un compte en fournissant des informations exactes et complètes. 
                Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Responsabilités de l'utilisateur :</h4>
                <ul className="list-disc pl-6 text-blue-700">
                  <li>Fournir des informations exactes lors de l'inscription</li>
                  <li>Maintenir la sécurité de votre compte</li>
                  <li>Notifier immédiatement tout accès non autorisé</li>
                  <li>Respecter les conditions d'utilisation des plateformes tierces</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Système de jetons et paiements</h2>
              <p className="mb-4">
                Notre service fonctionne avec un système de jetons. Chaque réclamation automatique consomme 1 jeton. 
                Les paiements sont traités via Cryptomus, un processeur de paiement crypto sécurisé.
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">Politique de remboursement :</h4>
                <ul className="list-disc pl-6 text-green-700">
                  <li>Les jetons achetés ne sont pas remboursables une fois la transaction confirmée</li>
                  <li>En cas de problème technique de notre côté, nous créditerons votre compte</li>
                  <li>Les remboursements exceptionnels sont étudiés au cas par cas</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Sécurité et confidentialité</h2>
              <p className="mb-4">
                Nous prenons la sécurité de vos données très au sérieux. Toutes les informations sensibles sont chiffrées 
                et stockées de manière sécurisée. Nous ne partageons jamais vos données personnelles avec des tiers.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <Shield size={20} className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Mesures de sécurité :</h4>
                    <ul className="list-disc pl-6 text-yellow-700">
                      <li>Chiffrement bout en bout des données sensibles</li>
                      <li>Authentification sécurisée</li>
                      <li>Surveillance continue des activités suspectes</li>
                      <li>Conformité aux standards de sécurité internationaux</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Utilisation acceptable</h2>
              <p className="mb-4">Vous vous engagez à utiliser notre service de manière légale et éthique. Les activités suivantes sont interdites :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Utilisation du service à des fins frauduleuses ou illégales</li>
                <li>Tentative de contournement des systèmes de sécurité</li>
                <li>Partage non autorisé de comptes</li>
                <li>Utilisation excessive qui pourrait affecter les performances du service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
              <p className="mb-4">
                TronPick Auto-Claim fournit le service "en l'état" sans garantie expresse ou implicite. 
                Nous ne sommes pas responsables des pertes financières résultant de l'utilisation du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modifications des conditions</h2>
              <p className="mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout moment. 
                Les utilisateurs seront notifiés des changements importants par email ou via l'interface du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter :
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li><strong>Email :</strong> support@tronpick-autoclaim.com</li>
                  <li><strong>Telegram :</strong> @AutoClaimSupport</li>
                  <li><strong>Discord :</strong> Auto-Claim Community</li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
