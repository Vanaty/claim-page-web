import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Users, Filter, X, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TronAccount } from '../types';
import { fetchAllAccounts } from '../services/apiService';

interface AdminPanelProps {
  // No specific props needed for now
}

interface AccountFilter {
  proxy: string;
  domain: string;
  user_id: string;
}

const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [accounts, setAccounts] = useState<TronAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AccountFilter>({
    proxy: '',
    domain: '',
    user_id: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TronAccount | 'user_id';
    direction: 'ascending' | 'descending';
  } | null>({ key: 'addedAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllAccounts();
      setAccounts(data);
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError("Impossible de charger les données. Vérifiez vos droits d'accès ou réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setFilters({
      proxy: '',
      domain: '',
      user_id: '',
    });
    setCurrentPage(1);
  };

  const handleSort = (key: keyof TronAccount | 'user_id') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesProxy = !filters.proxy || 
      (account.proxy && account.proxy.toLowerCase().includes(filters.proxy.toLowerCase()));
    
    const matchesDomain = !filters.domain || 
      (account.baseUrl && account.baseUrl.toLowerCase().includes(filters.domain.toLowerCase()));
    
    const matchesUserId = !filters.user_id || 
      (account.user_id && account.user_id.toLowerCase().includes(filters.user_id.toLowerCase()));
    
    return matchesProxy && matchesDomain && matchesUserId;
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key;
    const direction = sortConfig.direction === 'ascending' ? 1 : -1;

    if (key === 'user_id') {
      const valueA = a.user_id || '';
      const valueB = b.user_id || '';
      return valueA.localeCompare(valueB) * direction;
    }

    if (key === 'addedAt') {
      const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
      const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
      return (dateA - dateB) * direction;
    }

    const valueA = String(a[key] || '');
    const valueB = String(b[key] || '');
    return valueA.localeCompare(valueB) * direction;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);

  const exportToCSV = () => {
    // Create CSV content
    const csvRows = [];
    // Add header
    csvRows.push(['ID', 'Utilisateur ID', 'Adresse', 'Status', 'Date Ajout', 'Proxy', 'Domaine'].join(','));

    // Add data rows
    filteredAccounts.forEach(account => {
      const row = [
        account.id,
        account.user_id || 'N/A',
        account.address,
        account.status,
        account.addedAt ? new Date(account.addedAt).toISOString() : 'N/A',
        account.proxy || 'N/A',
        account.baseUrl || 'N/A'
      ];
      csvRows.push(row.map(value => `"${value}"`).join(','));
    });

    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tronpick_accounts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ column }: { column: keyof TronAccount | 'user_id' }) => {
    if (sortConfig?.key !== column) {
      return <span className="ml-1 opacity-30">↕</span>;
    }
    return sortConfig.direction === 'ascending' ? (
      <span className="ml-1 text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-blue-600">↓</span>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-md">
        <div className="flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={loadAccounts} 
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Panneau d'administration</h2>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex items-center gap-2 flex-grow">
          <div className="relative flex-grow max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un compte..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setFilters({
                  ...filters,
                  user_id: value,
                });
                setCurrentPage(1);
              }}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
          >
            <Filter size={18} />
            {!showFilters && "Filtres"}
          </button>

          <button 
            onClick={loadAccounts} 
            className="btn bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Rafraîchir les données"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-500">
            {filteredAccounts.length} comptes sur {accounts.length}
          </span>
          
          <button 
            onClick={exportToCSV}
            className="btn btn-outline-primary"
            disabled={filteredAccounts.length === 0}
          >
            <Download size={18} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Filter size={16} className="mr-2" />
                  Filtres avancés
                </h3>
                <button 
                  onClick={resetFilters} 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Proxy</label>
                  <input
                    type="text"
                    className="form-input"
                    name="proxy"
                    value={filters.proxy}
                    onChange={handleFilterChange}
                    placeholder="Filtrer par proxy"
                  />
                </div>
                
                <div>
                  <label className="form-label">Domaine</label>
                  <input
                    type="text"
                    className="form-input"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    placeholder="Filtrer par domaine"
                  />
                </div>
                
                <div>
                  <label className="form-label">ID Utilisateur</label>
                  <input
                    type="text"
                    className="form-input"
                    name="user_id"
                    value={filters.user_id}
                    onChange={handleFilterChange}
                    placeholder="Filtrer par ID utilisateur"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-3"></div>
                <p className="text-slate-500">Chargement des données...</p>
              </div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FileText size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-1">Aucun compte trouvé</h3>
              <p className="text-slate-500">Ajustez vos filtres pour voir plus de résultats</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID <SortIcon column="id" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('user_id')}
                  >
                    <div className="flex items-center">
                      Utilisateur ID <SortIcon column="user_id" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center">
                      Adresse <SortIcon column="address" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status <SortIcon column="status" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('proxy')}
                  >
                    <div className="flex items-center">
                      Proxy <SortIcon column="proxy" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('baseUrl')}
                  >
                    <div className="flex items-center">
                      Domaine <SortIcon column="baseUrl" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('addedAt')}
                  >
                    <div className="flex items-center">
                      Date Ajout <SortIcon column="addedAt" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentItems.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-slate-600">{account.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-slate-600">
                        {account.user_id ? `${account.user_id.slice(0, 8)}...` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{account.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${account.status === 'active' ? 'bg-green-100 text-green-800' :
                          account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{account.proxy || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{account.baseUrl || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">
                        {account.addedAt 
                          ? new Date(account.addedAt).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredAccounts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`btn ${currentPage === 1 ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`btn ${currentPage === totalPages ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredAccounts.length)}
                  </span>{' '}
                  sur <span className="font-medium">{filteredAccounts.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    &laquo; Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Suivant &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Comptes</h3>
          <div className="text-3xl font-bold text-slate-800">{accounts.length}</div>
        </div>
        
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Comptes Actifs</h3>
          <div className="text-3xl font-bold text-green-600">
            {accounts.filter(acc => acc.status === 'active').length}
          </div>
        </div>
        
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Utilisateurs Uniques</h3>
          <div className="text-3xl font-bold text-blue-600">
            {new Set(accounts.map(acc => acc.user_id)).size}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
