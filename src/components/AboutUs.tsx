import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Shield, Zap, Globe, Award, Heart, Mail, MessageCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: "Alexandre Martin",
      role: "CEO & Fondateur",
      description: "Expert en blockchain avec 8 ans d'expérience dans les crypto-monnaies",
      avatar: "👨‍💼"
    },
    {
      name: "Sophie Laurent",
      role: "CTO",
      description: "Ingénieure logiciel spécialisée en sécurité et systèmes distribués",
      avatar: "👩‍💻"
    },
    {
      name: "Thomas Bernard",
      role: "Lead Developer",
      description: "Développeur full-stack passionné par l'automatisation et l'UX",
      avatar: "👨‍💻"
    },
    {
      name: "Marie Dubois",
      role: "Customer Success",
      description: "Responsable de l'expérience client et du support utilisateur",
      avatar: "👩‍💼"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Lancement de TronPick Auto-Claim",
      description: "Première version publique avec support TronPick.io"
    },
    {
      year: "2023",
      title: "Expansion multi-plateformes",
      description: "Ajout du support pour LitePick, DogePick et autres plateformes"
    },
    {
      year: "2024",
      title: "Plus de 10,000 utilisateurs",
      description: "Croissance rapide et amélioration continue du service"
    },
    {
      year: "2024",
      title: "Certification sécurité",
      description: "Obtention des certifications de sécurité et conformité RGPD"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center">
              <Users size={28} className="text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-slate-800">À propos de nous</h1>
            </div>
          </div>

          {/* Mission Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Simplifier et automatiser l'expérience crypto pour permettre à chacun de maximiser 
                ses récompenses sans effort, tout en maintenant les plus hauts standards de sécurité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Target size={48} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Efficacité</h3>
                <p className="text-slate-600">
                  Automatiser les tâches répétitives pour que vous puissiez vous concentrer sur l'essentiel
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Shield size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
                <p className="text-slate-600">
                  Protection maximale de vos données avec un chiffrement de niveau bancaire
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Zap size={48} className="mx-auto text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-slate-600">
                  Développement continu de nouvelles fonctionnalités basées sur vos besoins
                </p>
              </div>
            </div>
          </section>

          {/* Company Info Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Informations de l'entreprise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">TronPick Auto-Claim SAS</h3>
                <div className="space-y-2 text-slate-600">
                  <p><strong>Siret :</strong> 12345678901234</p>
                  <p><strong>TVA :</strong> FR12345678901</p>
                  <p><strong>Adresse :</strong> 123 Rue de la Innovation, 75001 Paris, France</p>
                  <p><strong>Capital social :</strong> 100,000 €</p>
                  <p><strong>RCS :</strong> Paris B 123 456 789</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Certifications & Conformité</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-green-600" />
                    <span>Conforme RGPD</span>
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-green-600" />
                    <span>Certification ISO 27001 (en cours)</span>
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-green-600" />
                    <span>Audit de sécurité annuel</span>
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-green-600" />
                    <span>Assurance responsabilité civile professionnelle</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">TronPick Auto-Claim en chiffres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Utilisateurs actifs</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-green-100">Réclamations automatiques</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-purple-100">Plateformes supportées</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-orange-100">Temps de disponibilité</div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Notre histoire</h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    {milestone.year}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex-grow">
                    <h3 className="font-semibold text-slate-800 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Notre équipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold text-slate-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-slate-600">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <Heart size={24} className="text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Transparence</h3>
                </div>
                <p className="text-slate-600">
                  Nous communiquons ouvertement sur nos processus, notre sécurité et nos mises à jour. 
                  Pas de frais cachés, pas de surprises.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <Globe size={24} className="text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold">Accessibilité</h3>
                </div>
                <p className="text-slate-600">
                  Notre service est conçu pour être simple d'utilisation, que vous soyez débutant 
                  ou expert en crypto-monnaies.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <Shield size={24} className="text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold">Confiance</h3>
                </div>
                <p className="text-slate-600">
                  La sécurité de vos données et de vos actifs est notre priorité absolue. 
                  Nous utilisons les meilleures pratiques de l'industrie.
                </p>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <Users size={24} className="text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold">Communauté</h3>
                </div>
                <p className="text-slate-600">
                  Nous écoutons nos utilisateurs et développons notre service en fonction 
                  de vos retours et suggestions.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Contactez-nous</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Mail size={20} className="mr-2 text-blue-600" />
                  Support & Questions
                </h3>
                <div className="space-y-2 text-slate-600">
                  <p><strong>Email général :</strong> contact@tronpick-autoclaim.com</p>
                  <p><strong>Support technique :</strong> support@tronpick-autoclaim.com</p>
                  <p><strong>Partenariats :</strong> business@tronpick-autoclaim.com</p>
                  <p><strong>Presse :</strong> media@tronpick-autoclaim.com</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageCircle size={20} className="mr-2 text-blue-600" />
                  Réseaux sociaux
                </h3>
                <div className="space-y-2 text-slate-600">
                  <p><strong>Telegram :</strong> @AutoClaimSupport</p>
                  <p><strong>Discord :</strong> Auto-Claim Community</p>
                  <p><strong>Twitter :</strong> @TronPickAutoClaim</p>
                  <p><strong>LinkedIn :</strong> TronPick Auto-Claim</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                🕒 Heures d'ouverture du support : Lundi-Vendredi 9h-18h (UTC+1)
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Support d'urgence disponible 24/7 via Telegram
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
