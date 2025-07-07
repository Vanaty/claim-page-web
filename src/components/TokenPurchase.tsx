import React, { useState, useEffect } from 'react';
import { CreditCard, Package, Check, AlertCircle, Clock, RefreshCw, History, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPayment, getTokenPackages, checkPaymentStatus,getUserPaymentHistory } from '../services/apiService';
import { User } from '../types';

interface TokenPackage {
    id: string;
    name: string;
    tokens: number;
    price: number;
    currency: string;
    popular?: boolean;
    bonus?: number;
}

interface PaymentHistory {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    token_amount: number;
    status: string;
    payment_url: string;
    created_at: string;
    completed_at: string;
    expires_at: string;
}

interface TokenPurchaseProps {
    user: User;
    onTokensPurchased: (amount: number) => void;
    showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const TokenPurchase: React.FC<TokenPurchaseProps> = ({ user, onTokensPurchased, showToast }) => {
    const [packages, setPackages] = useState<TokenPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        loadTokenPackages();
    }, []);

    const loadTokenPackages = async () => {
        try {
            const packagesData = await getTokenPackages();
            setPackages(packagesData);
        } catch (error) {
            // Fallback packages pour le développement
            setPackages([
                { id: '1', name: 'Starter', tokens: 100, price: 5, currency: 'USD', popular: false, bonus: 0 },
                { id: '2', name: 'Pro', tokens: 500, price: 20, currency: 'USD', popular: true, bonus: 50 },
                { id: '3', name: 'Premium', tokens: 1000, price: 35, currency: 'USD', popular: false, bonus: 150 }
            ]);
            console.error('Failed to load token packages:', error);
            if (showToast) {
                showToast('error', 'Erreur lors du chargement des forfaits');
            }
        }
    };

    const handlePurchase = async (packageData: TokenPackage) => {
        try {
            console.log('Selected package:', packageData);
            setIsLoading(true);
            setSelectedPackage(packageData);

            // Le backend s'occupe de créer le paiement Cryptomus
            const response = await createPayment(packageData.id, packageData.price);

            // Vérifier si la création du paiement a réussi
            if (response.success && response.payment_url) {
                setPaymentData(response);
                setPaymentStatus('pending');

                if (showToast) {
                    showToast('info', 'Paiement créé. Suivez les instructions pour compléter le paiement.');
                }
            } else {
                // Échec de la création du paiement
                setPaymentStatus('failed');
                const errorMessage = response.message || 'Impossible de créer le paiement';
                if (showToast) {
                    showToast('error', errorMessage);
                }
            }

        } catch (error: any) {
            console.error('Payment creation failed:', error);
            setPaymentStatus('failed');
            const message = error.response?.data?.message || 'Erreur lors de la création du paiement';
            if (showToast) {
                showToast('error', message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const checkPayment = async () => {
        if (!paymentData?.payment_id) return;

        try {
            setCheckingPayment(true);
            const result = await checkPaymentStatus(paymentData.payment_id);

            if (result.status === 'paid' || result.status === 'confirmed') {
                setPaymentStatus('completed');
                onTokensPurchased(selectedPackage?.tokens || 0);
                if (showToast) {
                    showToast('success', `${selectedPackage?.tokens} jetons ajoutés à votre compte !`);
                }
                // Reset state
                setTimeout(() => {
                    setSelectedPackage(null);
                    setPaymentData(null);
                    setPaymentStatus(null);
                }, 3000);
            } else if (result.status === 'failed' || result.status === 'cancelled') {
                setPaymentStatus('failed');
                if (showToast) {
                    showToast('error', 'Le paiement a échoué ou a été annulé');
                }
            } else {
                if (showToast) {
                    showToast('info', 'Paiement en cours de traitement...');
                }
            }
        } catch (error) {
            console.error('Payment status check failed:', error);
            if (showToast) {
                showToast('error', 'Erreur lors de la vérification du paiement');
            }
        } finally {
            setCheckingPayment(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        if (showToast) {
            showToast('success', 'Copié dans le presse-papiers');
        }
    };

    const loadPaymentHistory = async () => {
        try {
            setLoadingHistory(true);
            const history = await getUserPaymentHistory();
            setPaymentHistory(history);
        } catch (error) {
            console.error('Failed to load payment history:', error);
            if (showToast) {
                showToast('error', 'Erreur lors du chargement de l\'historique');
            }
        } finally {
            setLoadingHistory(false);
        }
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
        if (!showHistory && paymentHistory.length === 0) {
            loadPaymentHistory();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'completed':
            case 'confirmed':
                return 'text-green-600 bg-green-100';
            case 'pending':
            case 'processing':
                return 'text-yellow-600 bg-yellow-100';
            case 'failed':
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'Payé';
            case 'completed':
                return 'Terminé';
            case 'confirmed':
                return 'Confirmé';
            case 'pending':
                return 'En attente';
            case 'processing':
                return 'En cours';
            case 'failed':
                return 'Échoué';
            case 'cancelled':
                return 'Annulé';
            default:
                return status;
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Acheter des jetons</h2>

            <div className="mb-6">
                <div className="glass-card p-6 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Solde actuel</h3>
                            <div className="token-balance text-3xl">{user.tokens}</div>
                        </div>
                        <div className="bg-green-600 rounded-full p-4">
                            <Package size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {paymentStatus && (
                <div className="glass-card p-6 mb-6">
                    <div className="text-center">
                        {paymentStatus === 'pending' && paymentData && (
                            <div className="text-blue-600">
                                <div className="flex items-center justify-center mb-4">
                                    <Clock size={48} className="mr-2" />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Paiement en attente</h3>
                                        <p className="text-slate-600">
                                            Cliquez sur le lien ci-dessous pour effectuer le paiement
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 gap-4 text-sm">
                                        <div>
                                            <label className="font-semibold text-slate-700">Montant à payer:</label>
                                            <div className="text-lg font-mono bg-white p-2 rounded border mt-1">
                                                {paymentData.amount} {paymentData.currency}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-semibold text-slate-700">Jetons à recevoir:</label>
                                            <div className="text-lg font-mono bg-white p-2 rounded border mt-1">
                                                {paymentData.token_amount} jetons
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <a
                                        href={paymentData.payment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary mr-2 inline-flex items-center"
                                    >
                                        <CreditCard size={16} className="mr-2" />
                                        Effectuer le paiement
                                    </a>
                                    
                                    <button
                                        onClick={checkPayment}
                                        disabled={checkingPayment}
                                        className="btn btn-secondary ml-2"
                                    >
                                        {checkingPayment ? (
                                            <>
                                                <RefreshCw size={16} className="mr-2 animate-spin" />
                                                Vérification...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={16} className="mr-2" />
                                                Vérifier le paiement
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    {paymentData.payment_id && <p>ID de paiement: {paymentData.payment_id}</p>}
                                    {paymentData.expires_at && <p>Expire le: {new Date(paymentData.expires_at).toLocaleString()}</p>}
                                    {paymentData.message && <p>Message: {paymentData.message}</p>}
                                </div>
                            </div>
                        )}

                        {paymentStatus === 'completed' && (
                            <div className="text-green-600">
                                <Check size={48} className="mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Paiement réussi !</h3>
                                <p className="text-slate-600">
                                    Vos jetons ont été ajoutés à votre compte
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'failed' && (
                            <div className="text-red-600">
                                <AlertCircle size={48} className="mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Paiement échoué</h3>
                                <p className="text-slate-600 mb-4">
                                    {paymentData?.message || 'Veuillez réessayer ou contacter le support'}
                                </p>
                                <button
                                    onClick={() => {
                                        setPaymentData(null);
                                        setPaymentStatus(null);
                                        setSelectedPackage(null);
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Réessayer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        className={`glass-card p-6 relative ${pkg.popular ? 'border-2 border-blue-500' : ''}`}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Populaire
                                </span>
                            </div>
                        )}

                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {pkg.tokens} jetons
                            </div>
                            {pkg.bonus && (
                                <div className="text-sm text-green-600 font-semibold mb-2">
                                    +{pkg.bonus} jetons bonus
                                </div>
                            )}
                            <div className="text-2xl font-bold text-slate-800 mb-4">
                                {pkg.price} {pkg.currency}
                            </div>
                            <div className="text-sm text-slate-500 mb-6">
                                ≈ {(pkg.price / pkg.tokens).toFixed(3)} {pkg.currency} par jeton
                            </div>

                            <button
                                onClick={() => handlePurchase(pkg)}
                                disabled={isLoading}
                                className="btn btn-primary w-full"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Traitement...
                                    </div>
                                ) : (
                                    <>
                                        <CreditCard size={16} className="mr-2" />
                                        Acheter maintenant
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Payment History Section */}
            <div className="mt-8 glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800 flex items-center">
                        <History size={20} className="mr-2" />
                        Historique des paiements
                    </h4>
                    <button
                        onClick={toggleHistory}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        {showHistory ? (
                            <>
                                Masquer <ChevronUp size={16} className="ml-1" />
                            </>
                        ) : (
                            <>
                                Afficher <ChevronDown size={16} className="ml-1" />
                            </>
                        )}
                    </button>
                </div>

                {showHistory && (
                    <div className="mt-4">
                        {loadingHistory ? (
                            <div className="flex items-center justify-center py-8">
                                <RefreshCw size={24} className="animate-spin text-blue-600 mr-2" />
                                <span className="text-slate-600">Chargement de l'historique...</span>
                            </div>
                        ) : paymentHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-2 px-3">Date</th>
                                            <th className="text-left py-2 px-3">Montant</th>
                                            <th className="text-left py-2 px-3">Jetons</th>
                                            <th className="text-left py-2 px-3">Statut</th>
                                            <th className="text-left py-2 px-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id} className="border-b border-slate-100">
                                                <td className="py-3 px-3">
                                                    {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-3 px-3">
                                                    {payment.amount} {payment.currency}
                                                </td>
                                                <td className="py-3 px-3">
                                                    {payment.token_amount} jetons
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                        {getStatusText(payment.status)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    {payment.status === 'pending' && payment.payment_url && (
                                                        <a
                                                            href={payment.payment_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                                        >
                                                            Continuer le paiement
                                                        </a>
                                                    )}
                                                    {payment.status === 'pending' && !payment.payment_url && (
                                                        <span className="text-slate-400 text-xs">
                                                            En attente
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Package size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Aucun paiement dans l'historique</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 glass-card p-6">
                <h4 className="font-semibold text-slate-800 mb-4">Paiement sécurisé avec Cryptomus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Accepte Bitcoin, Ethereum, USDT et plus de 20 cryptomonnaies</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Transactions sécurisées et vérifiées automatiquement</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Confirmation en temps réel</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Support client 24/7</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenPurchase;
