import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key, Globe, Search, RefreshCw, AlertCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteKey } from '../types';
import { fetchSiteKeys, createSiteKey, updateSiteKey, deleteSiteKey } from '../services/apiService';

interface SiteKeyManagerProps {
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const SiteKeyManager: React.FC<SiteKeyManagerProps> = ({ showToast }) => {
  const [siteKeys, setSiteKeys] = useState<SiteKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    site_name: string;
    site_key: string;
  }>({
    site_name: '',
    site_key: ''
  });

  useEffect(() => {
    loadSiteKeys();
  }, []);

  const loadSiteKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSiteKeys();
      setSiteKeys(data);
    } catch (err) {
      console.error('Failed to load site keys:', err);
      setError('Impossible de charger les clés de site. Vérifiez vos droits d\'accès.');
      if (showToast) {
        showToast('error', 'Erreur lors du chargement des clés de site');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.site_name.trim() || !formData.site_key.trim()) {
      if (showToast) {
        showToast('error', 'Veuillez remplir tous les champs');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update existing site key
        const updated = await updateSiteKey(editingId, formData);
        setSiteKeys(prev => prev.map(sk => sk.id === editingId ? updated : sk));
        if (showToast) {
          showToast('success', 'Clé de site mise à jour avec succès');
        }
      } else {
        // Create new site key
        const created = await createSiteKey(formData);
        setSiteKeys(prev => [created, ...prev]);
        if (showToast) {
          showToast('success', 'Clé de site créée avec succès');
        }
      }
      resetForm();
    } catch (error: any) {
      console.error('Failed to save site key:', error);
      const message = error.response?.data?.detail || 'Erreur lors de la sauvegarde';
      if (showToast) {
        showToast('error', message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (siteKey: SiteKey) => {
    setFormData({
      site_name: siteKey.site_name,
      site_key: siteKey.site_key
    });
    setEditingId(siteKey.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string, siteName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la clé pour "${siteName}" ?`)) {
      return;
    }

    try {
      await deleteSiteKey(id);
      setSiteKeys(prev => prev.filter(sk => sk.id !== id));
      if (showToast) {
        showToast('success', 'Clé de site supprimée avec succès');
      }
    } catch (error: any) {
      console.error('Failed to delete site key:', error);
      const message = error.response?.data?.detail || 'Erreur lors de la suppression';
      if (showToast) {
        showToast('error', message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ site_name: '', site_key: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredSiteKeys = siteKeys.filter(sk =>
    sk.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sk.site_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-md">
        <div className="flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={loadSiteKeys} 
              className="mt-3 flex items-center text-sm font-medium text-red-700 hover:text-red-900"
            >
              <RefreshCw size={14} className="mr-1" /> Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Clés de Site</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus size={18} />
          Ajouter une clé
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de site ou clé..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={loadSiteKeys} 
          className="btn bg-slate-100 hover:bg-slate-200 text-slate-700"
          title="Rafraîchir les données"
        >
          <RefreshCw size={18} />
          Rafraîchir
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card mb-6 relative overflow-hidden"
          >
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingId ? 'Modifier la clé de site' : 'Nouvelle clé de site'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">
                      <Globe size={16} className="mr-2 inline" />
                      Nom du site *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="site_name"
                      value={formData.site_name}
                      onChange={handleInputChange}
                      placeholder="ex: tronpick.io"
                      required
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="form-label">
                      <Key size={16} className="mr-2 inline" />
                      Clé du site *
                    </label>
                    <textarea
                      className="form-input min-h-[80px]"
                      name="site_key"
                      value={formData.site_key}
                      onChange={handleInputChange}
                      placeholder="Coller la clé de site ici..."
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {editingId ? 'Mise à jour...' : 'Création...'}
                      </>
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        {editingId ? 'Mettre à jour' : 'Créer'}
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site Keys List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500">Chargement des clés de site...</p>
          </div>
        </div>
      ) : filteredSiteKeys.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-10 text-center"
        >
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Key size={32} className="text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold mb-2">Aucune clé de site</h4>
          <p className="text-slate-500">
            {searchTerm ? 'Aucun résultat trouvé pour votre recherche' : 'Ajoutez votre première clé de site'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSiteKeys.map((siteKey, index) => (
            <motion.div
              key={siteKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <Globe size={20} className="text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        {siteKey.site_name}
                      </h3>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-1">
                        <Key size={16} className="text-slate-500 mr-2" />
                        <span className="text-sm text-slate-500">Clé de site</span>
                      </div>
                      <div className="font-mono text-sm text-slate-700 break-all">
                        {siteKey.site_key.length > 100 
                          ? `${siteKey.site_key.substring(0, 100)}...` 
                          : siteKey.site_key
                        }
                      </div>
                    </div>

                    {siteKey.created_at && (
                      <div className="text-xs text-slate-500">
                        Créée le {new Date(siteKey.created_at).toLocaleString('fr-FR')}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors"
                      onClick={() => handleEdit(siteKey)}
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                      onClick={() => siteKey.id && handleDelete(siteKey.id, siteKey.site_name)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Total des clés</h3>
          <div className="text-2xl font-bold text-slate-800">{siteKeys.length}</div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Résultats filtrés</h3>
          <div className="text-2xl font-bold text-blue-600">{filteredSiteKeys.length}</div>
        </div>
      </div>
    </div>
  );
};

export default SiteKeyManager;