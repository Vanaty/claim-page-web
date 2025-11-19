import { useState, useEffect } from 'react';

export const useChristmasMode = () => {
  const [isChristmasMode, setIsChristmasMode] = useState(false);

  useEffect(() => {
    const checkChristmasMode = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-based, December = 11
      const currentDay = currentDate.getDate();

      // Active en novembre (mois 10) et décembre (mois 11) et janvier (mois 0)
      setIsChristmasMode((currentMonth === 10 && currentDay >= 20) || currentMonth === 11 || (currentMonth === 0 && currentDay < 5));
      // setIsChristmasMode(true);
    };

    checkChristmasMode();
    
    // Vérifier chaque jour si on est passé en décembre ou sorti de décembre
    const interval = setInterval(checkChristmasMode, 24 * 60 * 60 * 1000); // Check every 24 hours
    
    return () => clearInterval(interval);
  }, []);

  const getChristmasAnnouncement = () => {
    return {
      id: 'christmas-special',
      title: '🎄 Offre Spéciale de Noël ! 🎄',
      description: 'Achat de jetons par crypto avec bonus de Noël ! Payez en USDT, TRX, DOGE et recevez jusqu\'à 50 % de bonus !',
      link: '/buy-tokens',
      linkText: '🎁 Voir les packs de Noël',
      type: 'success',
    };
  };

  const getChristmasStyles = () => {
    return {
      bannerGradient: 'from-red-600 to-green-600',
      backgroundColor: 'bg-gradient-to-br from-red-50 to-green-50',
      headerGradient: 'from-red-500 to-green-500',
      accentColor: 'text-red-600',
      buttonStyle: 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600',
    };
  };

  const getChristmasDecorations = () => {
    return {
      snowflakes: '❄️ ⭐ 🎄',
      lights: '🎄 ✨ 🎅 ⭐ ❄️ 🎁',
      emojis: ['🎄', '🎅', '⭐', '❄️', '🎁', '🔔', '✨'],
    };
  };

  return {
    isChristmasMode,
    getChristmasAnnouncement,
    getChristmasStyles,
    getChristmasDecorations,
  };
};
