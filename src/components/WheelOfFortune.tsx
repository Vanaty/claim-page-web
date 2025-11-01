import React, { useState, useCallback, useEffect } from 'react';
import WheelComponent from './WheelComponent';
import './WheelOfFortune.css';
import { fetchWheelData, spinWheel } from '../services/apiService';
import { WheelData, WheelPrize, WheelSpinResult } from '../types';

interface WheelOfFortuneProps {
    showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
    onRewardClaimed?: (reward: string) => void;
    disabled?: boolean;
    userId?: string;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ 
    showToast, 
    onRewardClaimed, 
    disabled = false, 
    userId 
}) => {
    const [wheelData, setWheelData] = useState<WheelData | null>(null);
    const [spinsRemaining, setSpinsRemaining] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load wheel data from backend
    useEffect(() => {
        const loadWheelData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchWheelData();
                setWheelData(data);
                setSpinsRemaining(data.spinsRemaining);
                setError(null);
            } catch (err) {
                console.error('Failed to load wheel data:', err);
                setError('Impossible de charger les données de la roue');
            } finally {
                setIsLoading(false);
            }
        };

        loadWheelData();
    }, []);

    // Extract segments and colors from wheel data
    const segments = wheelData?.prizes.map(prize => prize.name) || [];
    const segColors = wheelData?.prizes.map(prize => 
        prize.color || (prize.type === 'bad_luck' ? '#815CD1' : '#34A24F')
    ) || [];

    const onFinished = useCallback(async (winner: string) => {
        if (!userId) {
            setIsSpinning(false);
            return;
        }

        try {
            // Call backend to record the spin and get updated data
            const result: WheelSpinResult = await spinWheel(userId);
            
            // Update spins remaining from server response
            setSpinsRemaining(result.spinsRemaining);
            
            // Use the server result instead of the wheel animation result
            const actualWinner = result.result;
            
            if (showToast) {
                if (actualWinner.type === 'bad_luck') {
                    showToast('info', 'Plus de chance la prochaine fois !');
                } else {
                    showToast('success', `🎉 Félicitations ! Vous avez gagné : ${actualWinner.name}`);
                }
            }
            
            if (onRewardClaimed && actualWinner.type !== 'bad_luck') {
                onRewardClaimed(actualWinner.name);
            }
            
        } catch (err) {
            console.error('Failed to process spin result:', err);
            if (showToast) {
                showToast('error', 'Erreur lors du traitement du résultat');
            }
        } finally {
            setIsSpinning(false);
        }
    }, [userId, showToast, onRewardClaimed]);

    const canSpin = spinsRemaining > 0 && !isSpinning && !disabled && wheelData?.canSpin;

    // Loading state
    if (isLoading) {
        return (
            <div className="wheel-of-fortune-container">
                <div className="loading-message">
                    <p>Chargement de la roue...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="wheel-of-fortune-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Réessayer</button>
                </div>
            </div>
        );
    }

    // No wheel data
    if (!wheelData) {
        return (
            <div className="wheel-of-fortune-container">
                <div className="error-message">
                    <p>Aucune donnée de roue disponible</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wheel-of-fortune-container">
            <div className="spins-info">
                <p>Tours restants: {spinsRemaining}</p>
            </div>
            <WheelComponent
                segments={segments}
                segColors={segColors}
                winningSegment="" // Let the wheel choose randomly, backend will determine actual result
                onFinished={onFinished}
                primaryColor='#e5e7eb'
                contrastColor='white'
                buttonText={isSpinning ? 'En cours...' : canSpin ? 'Tourner' : 'Non disponible'}
                isOnlyOnce={!canSpin}
                size={150}
                upDuration={100}
                fontFamily='Arial'
                fontSize='0.8em'
                downDuration={100}
            />
            {spinsRemaining === 0 && (
                <div className="no-spins-message">
                    <p>Vous avez utilisé tous vos tours !</p>
                </div>
            )}
        </div>
    );

}

export default WheelOfFortune;