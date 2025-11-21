import { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useWeekendCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRefillTime, setIsRefillTime] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Calculer le prochain samedi 00h00 UTC
      const nextSaturday = new Date();
      const currentDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Calculer les jours jusqu'au prochain samedi
      let daysUntilSaturday = 6 - currentDay; // Jours restants jusqu'à samedi
      
      // Si on est samedi, vérifier si c'est avant ou après 00h00 UTC
      if (currentDay === 6) {
        const saturdayMidnight = new Date(now);
        saturdayMidnight.setUTCHours(0, 0, 0, 0);
        
        // Si on est samedi mais après 00h00 UTC, aller au samedi suivant
        if (now.getTime() >= saturdayMidnight.getTime()) {
          daysUntilSaturday = 7; // Prochain samedi dans 7 jours
        } else {
          daysUntilSaturday = 0; // Aujourd'hui à 00h00 UTC
        }
      }
      
      // Si on est dimanche, aller au samedi suivant (dans 6 jours)
      if (currentDay === 0) {
        daysUntilSaturday = 6;
      }
      
      // Créer la date du prochain réapprovisionnement
      nextSaturday.setUTCDate(now.getUTCDate() + daysUntilSaturday);
      nextSaturday.setUTCHours(0, 0, 0, 0); // Samedi 00h00 UTC
      
      const difference = nextSaturday.getTime() - now.getTime();
      
      // Vérifier si on est dans la période de réapprovisionnement (samedi 00h00-01h00 UTC)
      const isSaturday = currentDay === 6;
      const currentHour = now.getUTCHours();
      setIsRefillTime(isSaturday && currentHour === 0);
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (): string => {
    if (isRefillTime) {
      return "🎉 Réapprovisionnement en cours ! Tours magiques disponibles !";
    }
    
    const { days, hours, minutes, seconds } = timeLeft;
    
    if (days > 0) {
      return `${days}j ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getCountdownMessage = (): string => {
    if (isRefillTime) {
      return "Tours magiques réapprovisionnés ! Profitez-en maintenant !";
    }
    
    const { days } = timeLeft;
    
    if (days > 1) {
      return "Prochain réapprovisionnement dans";
    } else if (days === 1) {
      return "Réapprovisionnement demain (samedi 00h00 UTC) !";
    } else {
      return "Réapprovisionnement aujourd'hui (00h00 UTC) !";
    }
  };

  return {
    timeLeft,
    isRefillTime,
    formatCountdown,
    getCountdownMessage
  };
};
