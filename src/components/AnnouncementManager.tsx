import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/apiService';

interface AnnouncementManagerProps {
  user: any;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isActive: boolean;
  createdAt: Date;
}

const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ user, showToast }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    linkText: '',
    type: 'info' as const,
    isActive: true
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      showToast('error', 'Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user.tokens < 300) {
      showToast('error', 'Vous avez besoin de 300 jetons pour créer une annonce');
      return;
    }

    try {
      if (editingId) {
        const response = await updateAnnouncement(editingId, formData);
        if(response.success) {
            showToast('success', 'Annonce mise à jour avec succès');
        } else {
            showToast('error', 'Erreur lors de la mise à jour de l\'annonce');
            return;
        }
      } else {
        const response = await createAnnouncement(formData);
        if(response.success) {
            showToast('success', 'Annonce créée avec succès');
            if(user.role === 'user') {
                user.tokens -= 300;
            }
        } else {
            showToast('error', 'Erreur lors de la création de l\'annonce');
            return;
        }
        showToast('success', 'Annonce créée avec succès (-300 jetons)');
      }
      
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      showToast('error', 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      link: announcement.link || '',
      linkText: announcement.linkText || '',
      type: announcement.type,
      isActive: announcement.isActive
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    
    try {
      const response = await deleteAnnouncement(id);
      showToast((response.status) ? 'success': 'error', 'Annonce supprimée');
      loadAnnouncements();
    } catch (error) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      linkText: '',
      type: 'info',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
        case 'success': return 'from-emerald-500 to-teal-600';
        case 'warning': return 'from-amber-500 to-orange-600';
        case 'error': return 'from-rose-500 to-red-600';
        default: return 'from-sky-500 to-indigo-600';
    }
  };

  // Get preview data with fallbacks
  const getPreviewData = () => ({
    title: formData.title.trim() || 'Titre de votre annonce',
    description: formData.description.trim() || 'Description de votre annonce apparaîtra ici...',
    link: formData.link.trim(),
    linkText: formData.linkText.trim() || 'En savoir plus',
    type: formData.type,
    isActive: formData.isActive
  });

  const isPreviewReady = formData.title.trim() && formData.description.trim();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Annonces</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nouvelle Annonce (300 jetons)
        </button>
      </div>

      <div className="glass-card p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-800">
          <strong>Coût:</strong> Chaque annonce coûte 300 jetons. Votre solde actuel: {user.tokens} jetons
        </p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Preview Section - Moved to top */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="text-md font-medium mb-3 flex items-center gap-2 text-slate-700">
                  <Eye size={18} />
                  Aperçu de l'annonce
                </h4>
                
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4">
                  <div className={`bg-gradient-to-r ${getTypeColor(getPreviewData().type)} rounded-lg p-4 text-white relative overflow-hidden`}>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex items-center mb-3 md:mb-0 flex-1">
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                          NOUVEAU
                        </div>
                        <span className={`font-semibold ${!formData.title.trim() ? 'italic opacity-75' : ''}`}>
                          {getPreviewData().title}
                        </span>
                      </div>
                      {(formData.link.trim() || !formData.title.trim()) && (
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center text-sm">
                          {getPreviewData().linkText}
                        </div>
                      )}
                    </div>
                    <p className={`text-sm opacity-90 mt-2 ${!formData.description.trim() ? 'italic opacity-75' : ''}`}>
                      {getPreviewData().description}
                    </p>
                    
                    {/* Preview indicators */}
                    <div className="flex justify-center mt-3 space-x-1">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                      <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.type === 'success' ? 'bg-emerald-500' :
                    formData.type === 'warning' ? 'bg-amber-500' :
                    formData.type === 'error' ? 'bg-rose-500' :
                    'bg-sky-500'
                  }`}></div>
                  Type: {formData.type} • État: {formData.isActive ? 'Actif' : 'Inactif'}
                  {(!formData.title.trim() || !formData.description.trim()) && (
                    <span className="text-amber-600 font-medium">• Aperçu avec valeurs par défaut</span>
                  )}
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Lien (optionnel)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Texte du lien
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Info (Bleu)</option>
                      <option value="success">Succès (Vert)</option>
                      <option value="warning">Attention (Orange)</option>
                      <option value="error">Erreur (Rouge)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-slate-700">Annonce active</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={user.tokens < 300 && !editingId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingId ? 'Mettre à jour' : 'Créer (300 jetons)'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucune annonce trouvée
          </div>
        ) : (
          announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-4 ${!announcement.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                      announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      announcement.type === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.type.toUpperCase()}
                    </span>
                    {!announcement.isActive && (
                      <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{announcement.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{announcement.description}</p>
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {announcement.linkText || 'En savoir plus'}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;
