import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AnnouncementBannerProps {
  announcements: Announcement[];
  currentAnnouncementIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSetIndex: (index: number) => void;
}

const getAnnouncementColor = (type: string) => {
  switch (type) {
    case 'success': return 'from-emerald-500 to-teal-600';
    case 'warning': return 'from-amber-500 to-orange-600';
    case 'error': return 'from-rose-500 to-red-600';
    default: return 'from-sky-500 to-indigo-600';
  }
};

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  announcements,
  currentAnnouncementIndex,
  onNext,
  onPrev,
  onSetIndex,
}) => {
  const currentAnnouncement = announcements[currentAnnouncementIndex];

  if (!announcements.length || !currentAnnouncement) {
    return null;
  }

  return (
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
            onClick={onPrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-3 space-x-1">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => onSetIndex(index)}
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
  );
};

export default AnnouncementBanner;
