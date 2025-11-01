// Example integration of WheelOfFortune in Dashboard component

import React, { useState } from 'react';
import WheelOfFortune from './WheelOfFortune';
import Toast from './Toast';

interface DashboardWithWheelProps {
  user: User;
}

const DashboardWithWheel: React.FC<DashboardWithWheelProps> = ({ user }) => {
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message });
    // Auto-hide toast after 5 seconds
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleRewardClaimed = (reward: string) => {
    console.log('Récompense reçue:', reward);
    
    // Update user tokens in state if needed
    // You might want to refetch user data or update local state
    
    // Example: Parse token amount from reward string
    const tokenMatch = reward.match(/\+(\d+)\s+jetons/);
    if (tokenMatch) {
      const tokens = parseInt(tokenMatch[1]);
      console.log(`Utilisateur a gagné ${tokens} jetons`);
      
      // Update user tokens (example)
      // setUser(prev => ({ ...prev, tokens: prev.tokens + tokens }));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bonjour, {user.username}!</p>
        <p>Jetons: {user.tokens}</p>
      </div>

      <div className="wheel-section">
        <h2>Roue de la Fortune</h2>
        <p>Tentez votre chance pour gagner des jetons supplémentaires !</p>
        
        <WheelOfFortune
          userId={user.id}
          showToast={showToast}
          onRewardClaimed={handleRewardClaimed}
          disabled={false}
        />
      </div>

      {/* Toast notifications */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Rest of dashboard content */}
      <div className="dashboard-content">
        {/* Other dashboard components */}
      </div>
    </div>
  );
};

export default DashboardWithWheel;
