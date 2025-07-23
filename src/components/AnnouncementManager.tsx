import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, AlertTriangle, Check, Info } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    linkText: '',
    type: 'info' as const,
    isActive: true
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }
    
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Le lien doit être une URL valide';
    }
    
    if (formData.linkText.length > 50) {
      newErrors.linkText = 'Le texte du lien ne peut pas dépasser 50 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Memoized form validation state
  const formValidation = useMemo(() => {
    const hasRequiredFields = formData.title.trim() && formData.description.trim();
    const hasValidLink = !formData.link || isValidUrl(formData.link);
    const isValid = hasRequiredFields && hasValidLink && 
                   formData.title.length <= 100 && 
                   formData.description.length <= 500 &&
                   formData.linkText.length <= 50;
    
    return { hasRequiredFields, hasValidLink, isValid };
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    if (!editingId && user.tokens < 300) {
      showToast('error', 'Vous avez besoin de 300 jetons pour créer une annonce');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const response = await updateAnnouncement(editingId, formData);
        if(response.success) {
            showToast('success', 'Annonce mise à jour avec succès');
        } else {
            showToast('error', response.message || 'Erreur lors de la mise à jour de l\'annonce');
            return;
        }
      } else {
        const response = await createAnnouncement(formData);
        if(response.success) {
            showToast('success', 'Annonce créée avec succès (-300 jetons)');
            if(user.role === 'user') {
                user.tokens -= 300;
            }
        } else {
            showToast('error', response.message || 'Erreur lors de la création de l\'annonce');
            return;
        }
      }
      
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      showToast('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
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
    setErrors({});
    setEditingId(null);
    setShowForm(false);
    setShowPreview(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const canSubmit = formValidation.isValid && (!editingId ? user.tokens >= 300 : true) && !submitting;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Annonces</h2>
          <p className="text-sm text-slate-600 mt-1">
            {announcements.length} annonce{announcements.length !== 1 ? 's' : ''} • 
            {announcements.filter(a => a.isActive).length} active{announcements.filter(a => a.isActive).length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={user.tokens < 300}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Nouvelle Annonce (300 jetons)
        </button>
      </div>

      <div className="glass-card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Coût: 300 jetons par annonce
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Votre solde actuel: <span className="font-semibold">{user.tokens} jetons</span>
              {user.tokens < 300 && (
                <span className="text-red-600 ml-2 font-medium">
                  (Solde insuffisant)
                </span>
              )}
            </p>
          </div>
        </div>
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {editingId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full ${
                      formValidation.isValid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {formValidation.isValid ? <Check size={12} /> : <AlertTriangle size={12} />}
                      {formValidation.isValid ? 'Formulaire valide' : 'Formulaire incomplet'}
                    </div>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800"
                    >
                      {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showPreview ? 'Masquer aperçu' : 'Afficher aperçu'}
                    </button>
                  </div>
                </div>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <h4 className="text-md font-medium mb-3 flex items-center gap-2 text-slate-700">
                      <Eye size={18} />
                      Aperçu de l'annonce
                    </h4>
                    
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4">
                      <div className={`bg-gradient-to-r ${getTypeColor(getPreviewData().type)} rounded-lg p-4 text-white relative overflow-hidden transition-all duration-300`}>
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          <div className="flex items-center mb-3 md:mb-0 flex-1">
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3 animate-pulse">
                              NOUVEAU
                            </div>
                            <span className={`font-semibold ${!formData.title.trim() ? 'italic opacity-75' : ''}`}>
                              {getPreviewData().title}
                            </span>
                          </div>
                          {(formData.link.trim() || !formData.title.trim()) && (
                            <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center text-sm hover:bg-gray-50 transition-colors">
                              {getPreviewData().linkText}
                            </div>
                          )}
                        </div>
                        <p className={`text-sm opacity-90 mt-2 ${!formData.description.trim() ? 'italic opacity-75' : ''}`}>
                          {getPreviewData().description}
                        </p>
                        
                        <div className="flex justify-center mt-3 space-x-1">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                          <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                          <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-500 flex flex-wrap items-center gap-2">
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
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Titre <span className="text-red-500">*</span>
                    <span className="text-xs text-slate-500 ml-1">({formData.title.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.title ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    maxLength={100}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description <span className="text-red-500">*</span>
                    <span className="text-xs text-slate-500 ml-1">({formData.description.length}/500)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.description ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    rows={3}
                    maxLength={500}
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Lien (optionnel)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.link ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                      }`}
                      placeholder="https://exemple.com"
                    />
                    {errors.link && (
                      <p className="text-red-500 text-xs mt-1">{errors.link}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Texte du lien
                      <span className="text-xs text-slate-500 ml-1">({formData.linkText.length}/50)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => handleInputChange('linkText', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.linkText ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                      }`}
                      maxLength={50}
                      placeholder="En savoir plus"
                    />
                    {errors.linkText && (
                      <p className="text-red-500 text-xs mt-1">{errors.linkText}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type d'annonce
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">ℹ️ Info (Bleu)</option>
                      <option value="success">✅ Succès (Vert)</option>
                      <option value="warning">⚠️ Attention (Orange)</option>
                      <option value="error">❌ Erreur (Rouge)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Annonce active
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors min-w-[140px] justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingId ? 'Mettre à jour' : 'Créer (300 jetons)'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Vos annonces</h3>
          {announcements.length > 0 && (
            <div className="text-sm text-slate-500">
              {announcements.filter(a => a.isActive).length} sur {announcements.length} active{announcements.filter(a => a.isActive).length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Plus className="text-slate-400" size={24} />
            </div>
            <p className="text-slate-500 mb-2">Aucune annonce trouvée</p>
            <p className="text-sm text-slate-400">Créez votre première annonce pour commencer</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-4 transition-all hover:shadow-md ${!announcement.isActive ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                        announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        announcement.type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {announcement.type === 'success' ? '✅' : 
                         announcement.type === 'warning' ? '⚠️' : 
                         announcement.type === 'error' ? '❌' : 'ℹ️'} {announcement.type.toUpperCase()}
                      </span>
                      {!announcement.isActive && (
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                          INACTIVE
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 truncate">{announcement.title}</h3>
                    <p className="text-slate-600 text-sm mb-2 line-clamp-2">{announcement.description}</p>
                    {announcement.link && (
                      <a
                        href={announcement.link}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {announcement.linkText || 'En savoir plus'}
                        <span className="text-xs">↗</span>
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;
