import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, Copy, Check, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { checkPaymentStatusById } from '../services/apiService';

interface PaymentData {
    amount: number;
    currency: string;
    deposit_address?: string;
    memo?: string;
    tokens: number;
    expires_at: string;
}

const PaymentInterface: React.FC = () => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const paymentData = location.state?.paymentData as PaymentData;
    const selectedCurrency = location.state?.selectedCurrency;
    
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'expired'>('pending');

    useEffect(() => {
        if (!paymentData) {
            navigate('/dashboard');
            return;
        }

        // Calculate initial time left
        const expiresAt = new Date(paymentData.expires_at+"Z").getTime();
        const now = Date.now();
        const initialTimeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeLeft(initialTimeLeft);

        // Start countdown
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setPaymentStatus('expired');
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-check payment status every 30 seconds
        const statusCheckInterval = setInterval(() => {
            if (paymentStatus === 'pending') {
                checkPayment();
            }
        }, 30000);

        return () => {
            clearInterval(interval);
            clearInterval(statusCheckInterval);
        };
    }, [paymentData, navigate, paymentStatus]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    const checkPayment = async () => {
        if (!paymentData?.memo) return;

        try {
            setCheckingPayment(true);
            const result = await checkPaymentStatusById(paymentData.memo);

            if (result.status === 'paid' || result.status === 'confirmed' || result.status === 'completed') {
                setPaymentStatus('completed');
                setTimeout(() => {
                    navigate('/payment-success/' + paymentData.memo);
                }, 2000);
            } else if (result.status === 'failed' || result.status === 'cancelled') {
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment status check failed:', error);
        } finally {
            setCheckingPayment(false);
        }
    };

    if (!paymentData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-bold mb-2">Données de paiement manquantes</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-slate-600 hover:text-slate-800"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Retour
                    </button>
                </div>

                {/* Payment Status */}
                <div className="glass-card p-6 mb-6">
                    <div className="text-center">
                        {paymentStatus === 'pending' && (
                            <div className="text-blue-600">
                                <Clock size={48} className="mx-auto mb-4" />
                                <h1 className="text-2xl font-bold mb-2">Paiement en attente</h1>
                                <p className="text-slate-600 mb-4">
                                    Suivez les instructions ci-dessous pour finaliser votre paiement
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'completed' && (
                            <div className="text-green-600">
                                <Check size={48} className="mx-auto mb-4" />
                                <h1 className="text-2xl font-bold mb-2">Paiement confirmé !</h1>
                                <p className="text-slate-600">Redirection en cours...</p>
                            </div>
                        )}

                        {paymentStatus === 'failed' && (
                            <div className="text-red-600">
                                <AlertCircle size={48} className="mx-auto mb-4" />
                                <h1 className="text-2xl font-bold mb-2">Paiement échoué</h1>
                                <p className="text-slate-600 mb-4">Une erreur s'est produite lors du traitement</p>
                                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                                    Retour au tableau de bord
                                </button>
                            </div>
                        )}

                        {paymentStatus === 'expired' && (
                            <div className="text-orange-600">
                                <Clock size={48} className="mx-auto mb-4" />
                                <h1 className="text-2xl font-bold mb-2">Paiement expiré</h1>
                                <p className="text-slate-600 mb-4">Le délai de paiement a expiré</p>
                                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                                    Créer un nouveau paiement
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {paymentStatus === 'pending' && (
                    <>
                        {/* Countdown Timer */}
                        <div className="glass-card p-6 mb-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Temps restant pour payer</h3>
                                <div className={`text-4xl font-mono font-bold ${
                                    timeLeft < 300 ? 'text-red-500' : 'text-blue-600'
                                }`}>
                                    {formatTime(timeLeft)}
                                </div>
                                {timeLeft < 300 && (
                                    <p className="text-red-500 text-sm mt-2">
                                        ⚠️ Attention: Le paiement expire bientôt !
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="glass-card p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">Détails du paiement</h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {/* Amount */}
                                <div>
                                    <label className="font-semibold text-slate-700">Montant à envoyer:</label>
                                    <div className="text-lg font-mono bg-white p-3 rounded border mt-1 flex items-center justify-between">
                                        <div className="flex items-center">
                                            {selectedCurrency && (
                                                <img 
                                                    className="w-6 h-6 mr-2" 
                                                    src={`/assets/icons/${selectedCurrency.code.toLowerCase()}.png`} 
                                                    alt={`Icon ${selectedCurrency.code}`}
                                                />
                                            )}
                                            <span>{paymentData.amount} {paymentData.currency}</span>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.amount.toString())}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    {selectedCurrency && (
                                        <div className="text-xs text-slate-500 mt-1">
                                            Réseau: {selectedCurrency.network}
                                        </div>
                                    )}
                                </div>

                                {/* Deposit Address */}
                                {paymentData.deposit_address && (
                                    <div>
                                        <label className="font-semibold text-slate-700">Adresse de dépôt:</label>
                                        <div className="text-sm font-mono bg-white p-3 rounded border mt-1 flex items-center justify-between break-all">
                                            <span>{paymentData.deposit_address}</span>
                                            <button
                                                onClick={() => copyToClipboard(paymentData.deposit_address!)}
                                                className="text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Memo */}
                                {paymentData.memo && (
                                    <div>
                                        <label className="font-semibold text-slate-700">Memo (OBLIGATOIRE):</label>
                                        <div className="text-sm font-mono bg-yellow-50 p-3 rounded border border-yellow-300 mt-1 flex items-center justify-between">
                                            <span className="text-yellow-800">{paymentData.memo}</span>
                                            <button
                                                onClick={() => copyToClipboard(paymentData.memo!)}
                                                className="text-yellow-600 hover:text-yellow-800 ml-2"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-yellow-600 mt-1">
                                            ⚠️ Le memo est obligatoire pour identifier votre paiement
                                        </p>
                                    </div>
                                )}

                                {/* Tokens to receive */}
                                <div>
                                    <label className="font-semibold text-slate-700">Jetons à recevoir:</label>
                                    <div className="text-lg font-mono bg-green-50 p-3 rounded border border-green-200 mt-1">
                                        {paymentData.tokens} jetons
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="glass-card p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Instructions de paiement</h3>
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                <ul className="text-sm text-orange-700 space-y-2">
                                    <li>• Envoyez exactement {paymentData.amount} {paymentData.currency}</li>
                                    {selectedCurrency && (
                                        <li>• Utilisez le réseau {selectedCurrency.network}</li>
                                    )}
                                    {paymentData.memo && (
                                        <li>• N'oubliez pas d'inclure le memo dans votre transaction</li>
                                    )}
                                    <li>• La confirmation peut prendre 1-10 minutes</li>
                                    <li>• Ne fermez pas cette page avant confirmation</li>
                                    <li>• Le paiement expire automatiquement après le délai</li>
                                </ul>
                            </div>
                        </div>

                        {/* Check Payment Button */}
                        <div className="glass-card p-6">
                            <div className="text-center">
                                <button
                                    onClick={checkPayment}
                                    disabled={checkingPayment}
                                    className="btn btn-primary"
                                >
                                    {checkingPayment ? (
                                        <>
                                            <RefreshCw size={16} className="mr-2 animate-spin" />
                                            Vérification en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} className="mr-2" />
                                            Vérifier le paiement
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 mt-2">
                                    Le statut est vérifié automatiquement toutes les 30 secondes
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentInterface;
