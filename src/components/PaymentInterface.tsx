import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, Copy, Check, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { checkPaymentStatusById,checkPaymentStatus } from '../services/apiService';

interface PaymentData {
    amount: number;
    currency: string;
    deposit_address?: string;
    payment_id?: string;
    tokens: number;
    expires_at: string;
}

const PaymentInterface: React.FC<{ showToast: (type: 'success' | 'error' | 'info', message: string) => void }> = ({ showToast }) => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const paymentData = location.state?.paymentData as PaymentData;
    const selectedCurrency = location.state?.selectedCurrency;
    
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [txHash, setTxHash] = useState('');
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

    const handleVerifyPayment = (e: React.FormEvent) => {
        e.preventDefault();
        verifyPaymentByTxHash(txHash);
    };

    const verifyPaymentByTxHash = async (txHash: string) => {
        if (!paymentData?.payment_id) return;
        try {
            setCheckingPayment(true);
            const result = await checkPaymentStatus(paymentData.payment_id, txHash);
            if (result.success && (result.status === 'paid' || result.status === 'confirmed' || result.status === 'completed')) {
                setPaymentStatus('completed');
                setTimeout(() => {
                    navigate('/payment-success/' + paymentData.payment_id);
                }, 2000);
            }
            showToast('info', result.message || 'Vérification terminée');
        } catch (error) {
            console.error('Payment verification failed:', error);
        } finally {
            setCheckingPayment(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    const checkPayment = async () => {
        if (!paymentData?.payment_id) return;

        try {
            setCheckingPayment(true);
            const result = await checkPaymentStatusById(paymentData.payment_id);

            if (result.status === 'paid' || result.status === 'confirmed' || result.status === 'completed') {
                setPaymentStatus('completed');
                setTimeout(() => {
                    navigate('/payment-success/' + paymentData.payment_id);
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
                                {/* Formulaire pour le verification par transaction hash */}
                                <p className="text-slate-500 text-sm mt-6 mb-3">
                                    Si la vérification automatique prend du temps, vous pouvez vérifier manuellement :
                                </p>
                                <form onSubmit={handleVerifyPayment} className="flex justify-center max-w-lg mx-auto">
                                    <input
                                        type="text"
                                        placeholder="Entrez le hash de la transaction (TxID)"
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        className="w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        disabled={checkingPayment}
                                    />
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 flex items-center"
                                        disabled={checkingPayment || !txHash}
                                    >
                                        {checkingPayment ? <RefreshCw size={16} className="animate-spin" /> : 'Vérifier'}
                                    </button>
                                </form>
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

                        {/* Payment Details with Warning */}
                        <div className="glass-card p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">Détails du paiement</h3>
                            
                            {/* Exact Amount Warning */}
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                                <div className="flex items-start">
                                    <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-red-800 mb-2">⚠️ IMPORTANT - Montant exact requis</h4>
                                        <p className="text-sm text-red-700 mb-2">
                                            Nous devons recevoir <strong>exactement {paymentData.amount} {paymentData.currency}</strong> sur notre adresse.
                                        </p>
                                        <p className="text-sm text-red-700 mb-2">
                                            <strong>Important :</strong> Vous devez inclure les frais de réseau dans votre transaction pour que nous recevions le montant exact. 
                                            Le montant affiché ci-dessous est ce que nous devons recevoir, pas ce que vous devez envoyer.
                                        </p>
                                        <p className="text-sm text-red-700">
                                            Si nous ne recevons pas exactement ce montant, la vérification automatique ne fonctionnera pas et votre paiement ne sera pas traité.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {/* Amount */}
                                <div>
                                    <label className="font-semibold text-slate-700">Montant que nous devons recevoir (EXACTEMENT):</label>
                                    <div className="text-lg font-mono bg-white p-3 rounded border mt-1 flex items-center justify-between">
                                        <div className="flex items-center">
                                            {selectedCurrency && (
                                                <img 
                                                    className="w-6 h-6 mr-2" 
                                                    src={`/assets/icons/${selectedCurrency.code.toLowerCase()}.png`} 
                                                    alt={`Icon ${selectedCurrency.code}`}
                                                />
                                            )}
                                            <span className="font-bold text-red-600">{paymentData.amount} {paymentData.currency}</span>
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
                                    <div className="text-xs text-orange-600 mt-2 font-medium">
                                        ⚠️ N'oubliez pas d'ajouter les frais de réseau à votre transaction pour que nous recevions exactement ce montant
                                    </div>
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

                                {/* Payment ID */}
                                {paymentData.payment_id && (
                                    <div>
                                        <label className="font-semibold text-slate-700">ID de paiement:</label>
                                        <div className="text-sm font-mono bg-blue-50 p-3 rounded border border-blue-300 mt-1 flex items-center justify-between">
                                            <span className="text-blue-800">{paymentData.payment_id}</span>
                                            <button
                                                onClick={() => copyToClipboard(paymentData.payment_id!)}
                                                className="text-blue-600 hover:text-blue-800 ml-2"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-1">
                                            ID unique pour le suivi de votre paiement
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
                                    <li className="font-semibold">• Nous devons recevoir EXACTEMENT {paymentData.amount} {paymentData.currency} sur notre adresse</li>
                                    <li className="font-semibold">• Incluez les frais de réseau dans votre transaction pour que nous recevions le montant exact</li>
                                    {selectedCurrency && (
                                        <li>• Utilisez le réseau {selectedCurrency.network}</li>
                                    )}
                                    <li>• Le montant affiché est ce que nous devons recevoir, pas ce que vous devez envoyer</li>
                                    <li>• La vérification automatique se fait toutes les 30 secondes</li>
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
