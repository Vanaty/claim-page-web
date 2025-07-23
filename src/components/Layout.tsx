import React, { useState, useEffect } from 'react';
import { User, Wallet, LogOut, Menu, X, TrendingUp, Plus, Send, Settings, ShieldAlert, Key, CreditCard, Newspaper, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types';
import { getAnnouncements } from '../services/apiService';

interface LayoutProps {
  user: UserType;
  userRole: string;
  onLogout: () => void;
  children: React.ReactNode;
  accountsCount: number;
}

const Layout: React.FC<LayoutProps> = ({ user, userRole, onLogout, children, accountsCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const location = useLocation();

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncementsData = async () => {
      try {
        const data = await getAnnouncements();
        const activeAnnouncements = data.filter((ann: any) => ann.isActive);
        setAnnouncements(activeAnnouncements);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        // Fallback to default announcement if API fails
        setAnnouncements([{
          id: 'default',
          title: 'Achat de jetons par crypto avec bonus !',
          description: 'Payez en USDT, TRX, DOGE et recevez jusqu\'à +150 jetons bonus selon votre pack !',
          link: '/buy-tokens',
          linkText: 'Voir les packs',
          type: 'info',
        }, {
          id: 'default-2',
          title: 'Nouveau système de paiement',
          description: 'Payez en crypto et recevez des bonus exclusifs',
          link: '/buy-tokens',
          linkText: 'En savoir plus',
          type: 'success',
        }]);
      }
    };

    fetchAnnouncementsData();
  }, []);

  // Auto-scroll announcements
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => 
        prev >= announcements.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-emerald-500 to-teal-600';
      case 'warning': return 'from-amber-500 to-orange-600';
      case 'error': return 'from-rose-500 to-red-600';
      default: return 'from-sky-500 to-indigo-600';
    }
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev >= announcements.length - 1 ? 0 : prev + 1
    );
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev <= 0 ? announcements.length - 1 : prev - 1
    );
  };

  const navItems = [
    { path: '/dashboard', icon: TrendingUp, label: 'Dashboard' },
    { path: '/accounts', icon: Plus, label: `Comptes (${accountsCount})` },
    { path: '/transfer', icon: Send, label: 'Transfert' },
    { path: '/buy-tokens', icon: CreditCard, label: 'Acheter des jetons' },
    { path: '/announcements', icon: Newspaper, label: 'Annonces' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: ShieldAlert, label: 'Comptes' },
    { path: '/admin/sitekeys', icon: Key, label: 'Clés de Site' },
  ];

  // Combine nav items based on user role
  const allNavItems = userRole === 'admin' ? [...navItems, ...adminNavItems] : navItems;

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <Wallet className="text-blue-700 mr-2" size={24} />
              <span className="font-bold text-xl text-blue-800">Auto-Claim</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <span className="token-balance mr-1">{user.tokens}</span>
                <span className="text-slate-600 text-sm">Jetons</span>
              </div>
              
              <div className="relative group">
                <button className="btn btn-outline-primary">
                  <User size={16} className="mr-1" />
                  <span>{user.username}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <button onClick={onLogout} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-slate-700 hover:text-blue-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="container mx-auto px-4 py-3 space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-600">Jetons disponibles:</span>
                <span className="token-balance">{user.tokens}</span>
              </div>
              <button 
                onClick={onLogout} 
                className="flex w-full items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Announcements Banner */}
        {announcements.length > 0 && currentAnnouncement && (
          <motion.div 
            className={`bg-gradient-to-r ${getAnnouncementColor(currentAnnouncement.type)} rounded-lg p-4 mb-6 text-white relative overflow-hidden`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={currentAnnouncementIndex}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0 flex-1">
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                  NOUVEAU
                </div>
                <Gift size={20} className="mr-2" />
                <span className="font-semibold">{currentAnnouncement.title}</span>
              </div>
              {currentAnnouncement.link && (
                <Link 
                  to={currentAnnouncement.link}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center text-sm"
                >
                  <CreditCard size={16} className="mr-2" />
                  {currentAnnouncement.linkText || 'En savoir plus'}
                </Link>
              )}
            </div>
            <p className="text-sm opacity-90 mt-2">
              {currentAnnouncement.description}
            </p>

            {/* Navigation controls */}
            {announcements.length > 1 && (
              <>
                <button
                  onClick={prevAnnouncement}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextAnnouncement}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-3 space-x-1">
                  {announcements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAnnouncementIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAnnouncementIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto md:overflow-visible space-x-2 md:space-x-4 pb-2 md:pb-0 mb-6">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex items-center flex-shrink-0 ${
                  isActiveRoute(item.path) ? 'active' : ''
                }`}
              >
                <Icon size={18} className="mr-2" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Page Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;