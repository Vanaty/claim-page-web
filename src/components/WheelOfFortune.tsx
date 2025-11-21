import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, Star, Trophy, Coins, RotateCcw, AlertCircle } from 'lucide-react';
import WheelComponent from './WheelComponent';
import './WheelOfFortune.css';
import { fetchWheelData, spinWheel } from '../services/apiService';
import { WheelData, WheelPrize, WheelSpinResult } from '../types';
import { useChristmasMode } from '../hooks/useChristmasMode';

interface WheelOfFortuneProps {
    showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
    onRewardClaimed?: (reward: WheelPrize) => void;
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
    const actualWinner = useRef<WheelPrize | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastWin, setLastWin] = useState<WheelPrize | null>(null);
    const [showWinAnimation, setShowWinAnimation] = useState(false);
    
    const { isChristmasMode, getChristmasStyles } = useChristmasMode();

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

    const beforeSpingGetWinner = async (): Promise<string> => {
        if (spinsRemaining <= 0) {
            if (showToast) showToast('error', 'Aucun tour restant');
            throw new Error('No spins remaining');
        }
        const response: WheelSpinResult = await spinWheel(userId!);
        setSpinsRemaining(response.spinsRemaining);
        actualWinner.current = response.result;
        return response.result.name;
    };

    // Extract segments and colors from wheel data
    const segments = wheelData?.prizes.map(prize => prize.name) || [];
    const segColors = wheelData?.prizes.map(prize => 
        prize.color || (prize.type === 'bad_luck' ? '#815CD1' : '#34A24F')
    ) || [];

    const onFinished = async () => {
        try {
            if (actualWinner.current) {
                setLastWin(actualWinner.current);
                setShowWinAnimation(true);
                
                // Hide animation after 3 seconds
                setTimeout(() => setShowWinAnimation(false), 3000);
            }

            if (showToast) {
                if (actualWinner.current!.type === 'bad_luck') {
                    showToast('info', isChristmasMode ? '🎄 Plus de chance la prochaine fois ! 🎅' : 'Plus de chance la prochaine fois !');
                } else {
                    const christmasMessage = isChristmasMode 
                        ? `🎅 Ho ho ho ! Vous avez gagné : ${actualWinner.current!.name} 🎁` 
                        : `🎉 Félicitations ! Vous avez gagné : ${actualWinner.current!.name}`;
                    showToast('success', christmasMessage);
                }
            }

            if (onRewardClaimed && actualWinner.current!.type !== 'bad_luck') {
                onRewardClaimed(actualWinner.current!);
            }
            
        } catch (err) {
            console.error('Failed to process spin result:', err);
            if (showToast) {
                showToast('error', 'Erreur lors du traitement du résultat');
            }
        } finally {
            setIsSpinning(false);
        }
    };

    const canSpin = spinsRemaining > 0 && !isSpinning && !disabled && wheelData?.canSpin;

    const christmasStyles = getChristmasStyles();

    // Get appropriate icons based on prize type
    const getPrizeIcon = (prize: WheelPrize) => {
        if (isChristmasMode) {
            switch (prize.type) {
                case 'bad_luck': return '❄️';
                case 'tokens': return '🎁';
                case 'bonus': return '🎄';
                default: return '✨';
            }
        } else {
            switch (prize.type) {
                case 'bad_luck': return '💔';
                case 'tokens': return '🪙';
                case 'bonus': return '⭐';
                default: return '🎯';
            }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <motion.div 
                className={`wheel-of-fortune-container ${isChristmasMode ? 'christmas-wheel' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="loading-message">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="loading-spinner"
                    >
                        <RotateCcw size={24} />
                    </motion.div>
                    <p>{isChristmasMode ? '🎄 Chargement de la roue magique... 🎅' : 'Chargement de la roue...'}</p>
                </div>
            </motion.div>
        );
    }

    // Error state
    if (error) {
        return (
            <motion.div 
                className={`wheel-of-fortune-container ${isChristmasMode ? 'christmas-wheel' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="error-message">
                    <AlertCircle size={48} className="error-icon" />
                    <p>{error}</p>
                    <motion.button 
                        className={`retry-btn ${isChristmasMode ? 'christmas-button' : ''}`}
                        onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RotateCcw size={16} />
                        {isChristmasMode ? '🎄 Réessayer 🎅' : 'Réessayer'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    // No wheel data
    if (!wheelData) {
        return (
            <motion.div 
                className={`wheel-of-fortune-container ${isChristmasMode ? 'christmas-wheel' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="error-message">
                    <AlertCircle size={48} className="error-icon" />
                    <p>{isChristmasMode ? '🎄 Aucune roue magique disponible 🎅' : 'Aucune donnée de roue disponible'}</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className={`wheel-of-fortune-container ${isChristmasMode ? 'christmas-wheel' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Christmas Header */}
            {isChristmasMode && (
                <motion.div 
                    className="christmas-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="christmas-title">
                        🎄 Roue de Noël Magique 🎅
                    </div>
                    <div className="christmas-subtitle">
                        ✨ Tentez votre chance pour des cadeaux festifs ! ✨
                    </div>
                </motion.div>
            )}

            {/* Spins Info */}
            <motion.div 
                className="spins-info"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="spins-counter">
                    <Coins size={20} className="spins-icon" />
                    <span>Tours restants: </span>
                    <span className="spins-number">{spinsRemaining}</span>
                </div>
                {wheelData.canSpin === false && (
                    <div className="spin-cooldown">
                        <Star size={16} />
                        <span>Revenez plus tard !</span>
                    </div>
                )}
            </motion.div>

            {/* Win Animation Overlay */}
            <AnimatePresence>
                {showWinAnimation && lastWin && (
                    <motion.div
                        className="win-animation-overlay"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="win-content">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Trophy size={64} className="win-trophy" />
                            </motion.div>
                            <h3>{isChristmasMode ? '🎅 Ho Ho Ho !' : '🎉 Félicitations !'}</h3>
                            <p>Vous avez gagné :</p>
                            <div className="win-prize">
                                {getPrizeIcon(lastWin)} {lastWin.name}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wheel Component */}
            <motion.div 
                className="wheel-wrapper"
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <WheelComponent
                    segments={segments}
                    segColors={segColors}
                    winningSegment={actualWinner.current?.name || ''}
                    beforeSpingGetWinner={beforeSpingGetWinner}
                    onFinished={onFinished}
                    primaryColor={isChristmasMode ? '#dc2626' : '#e5e7eb'}
                    contrastColor='white'
                    buttonText={
                        isSpinning 
                            ? (isChristmasMode ? '🎄 Magie en cours... 🎅' : 'En cours...') 
                            : canSpin 
                                ? (isChristmasMode ? '🎁 Tourner la magie ! 🎄' : 'Tourner') 
                                : 'Non disponible'
                    }
                    size={180}
                    upDuration={100}
                    fontFamily={isChristmasMode ? 'serif' : 'Arial'}
                    fontSize='0.7em'
                    downDuration={600}
                />
            </motion.div>

            {/* No Spins Message */}
            <AnimatePresence>
                {spinsRemaining === 0 && (
                    <motion.div 
                        className="no-spins-message"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Gift size={24} className="no-spins-icon" />
                        <p>
                            {isChristmasMode 
                                ? '🎅 Vous avez utilisé tous vos tours magiques ! Revenez demain pour plus de cadeaux ! 🎄'
                                : 'Vous avez utilisé tous vos tours !'
                            }
                        </p>
                        {isChristmasMode && (
                            <div className="christmas-encouragement">
                                ✨ La magie de Noël vous attend ! ✨
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sparkle Effects for Christmas */}
            {isChristmasMode && (
                <div className="sparkle-effects">
                    {Array.from({ length: 8 }, (_, i) => (
                        <motion.div
                            key={i}
                            className="sparkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        >
                            ✨
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );

}

export default WheelOfFortune;