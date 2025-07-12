import React, { useState, useEffect } from 'react';
import { CreditCard, Package, Check, AlertCircle, Clock, RefreshCw, History, ChevronDown, ChevronUp, Link, Copy, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPayment, getTokenPackages, checkPaymentStatus, getUserPaymentHistory, getSupportedCurrencies } from '../services/apiService';
import { User,SupportedCurrency } from '../types';

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
    payment_url?: string;
    memo?: string;
    deposit_address?: string;
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
    const navigate = useNavigate();
    const [packages, setPackages] = useState<TokenPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
    const [supportedCurrencies, setSupportedCurrencies] = useState<SupportedCurrency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showCurrencySelection, setShowCurrencySelection] = useState(false);
    const [transactionIdToCheck, setTransactionIdToCheck] = useState('');
    const [transactionStatus, setTransactionStatus] = useState<any>(null);
    const [checkingTransaction, setCheckingTransaction] = useState(false);

    useEffect(() => {
        loadTokenPackages();
        loadSupportedCurrencies();
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

    const loadSupportedCurrencies = async () => {
        try {
            const currencies = await getSupportedCurrencies();
            setSupportedCurrencies(currencies);
            const defaultCurrency = currencies.find(c => c.code === 'USDT') || currencies[0];
            setSelectedCurrency(defaultCurrency);
        } catch (error) {
            // Fallback currencies pour le développement
            const fallbackCurrencies = [
                { code: 'USDT', name: 'Tether USD', network: 'TRC-20', rate: 1, icon: '₮' },
                { code: 'TRX', name: 'TRON', network: 'TRON', rate: 0.12, icon: '⚡' },
                { code: 'BNB', name: 'Binance Coin', network: 'BSC', rate: 620, icon: '🔶' },
                { code: 'ETH', name: 'Ethereum', network: 'ERC-20', rate: 3200, icon: '⟐' }
            ];
            setSupportedCurrencies(fallbackCurrencies);
            setSelectedCurrency(fallbackCurrencies[0]);
            console.error('Failed to load supported currencies:', error);
            if (showToast) {
                showToast('error', 'Erreur lors du chargement des devises supportées');
            }
        }
    };

    const calculateCryptoAmount = (usdPrice: number) => {
        if (!selectedCurrency) return 0;
        return (usdPrice / selectedCurrency.rate).toFixed(6);
    };

    const handlePurchase = async (packageData: TokenPackage) => {
        if (!selectedCurrency) {
            if (showToast) {
                showToast('error', 'Veuillez sélectionner une devise');
            }
            return;
        }

        try {
            console.log('Selected package:', packageData);
            console.log('Selected currency:', selectedCurrency);
            setIsLoading(true);
            setSelectedPackage(packageData);

            // Le backend s'occupe de créer le paiement crypto avec la devise sélectionnée
            const response = await createPayment(packageData.id, selectedCurrency.code);

            // Vérifier si la création du paiement a réussi
            if (response.success && (response.deposit_address || response.memo)) {
                // Redirect to payment interface with payment data
                navigate(`/payment/${response.memo}`, {
                    state: {
                        paymentData: {
                            ...response,
                            tokens: packageData.tokens
                        },
                        selectedCurrency: selectedCurrency
                    }
                });
            } else {
                // Échec de la création du paiement
                setPaymentStatus('failed');
                const errorMessage = response.message || 'Impossible de créer le paiement crypto';
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

            if (result.status === 'paid' || result.status === 'confirmed' || result.status === 'completed') {
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

    const checkTransactionStatus = async () => {
        if (!transactionIdToCheck.trim()) return;

        try {
            setCheckingTransaction(true);
            const result = await checkPaymentStatus(transactionIdToCheck.trim());

            if (result.status === 'paid' || result.status === 'confirmed' || result.status === 'completed') {
                setTransactionStatus(result);
                if (showToast) {
                    showToast('success', 'Le paiement a été confirmé avec succès');
                }
            } else if (result.status === 'failed' || result.status === 'cancelled') {
                setTransactionStatus(result);
                if (showToast) {
                    showToast('error', 'Le paiement a échoué ou a été annulé');
                }
            } else {
                setTransactionStatus(result);
                if (showToast) {
                    showToast('info', 'Le paiement est en cours de traitement');
                }
            }
        } catch (error) {
            console.error('Transaction status check failed:', error);
            if (showToast) {
                showToast('error', 'Erreur lors de la vérification de l\'ID de transaction');
            }
        } finally {
            setCheckingTransaction(false);
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

            {/* Currency Selection */}
            <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <DollarSign size={20} className="mr-2" />
                        Devise de paiement
                    </h3>
                    <button
                        onClick={() => setShowCurrencySelection(!showCurrencySelection)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        Changer {showCurrencySelection ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                    </button>
                </div>

                {selectedCurrency && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">{selectedCurrency.icon}</span>
                            <div>
                                <div className="font-semibold">{selectedCurrency.name} ({selectedCurrency.code})</div>
                                <div className="text-sm text-slate-600">Réseau: {selectedCurrency.network}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-600">Taux de change</div>
                            <div className="font-semibold">1 USD = {(1/selectedCurrency.rate).toFixed(6)} {selectedCurrency.code}</div>
                        </div>
                    </div>
                )}

                {showCurrencySelection && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {supportedCurrencies.map((currency) => (
                            <button
                                key={currency.code}
                                onClick={() => {
                                    setSelectedCurrency(currency);
                                    setShowCurrencySelection(false);
                                }}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    selectedCurrency?.code === currency.code
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <img className="w-6 h-6" src={`/assets/icons/${currency.code.toLowerCase()}.png`} alt={`Icon ${currency.code}`} />
                                </div>
                                <div className="text-sm font-semibold">{currency.code}</div>
                                <div className="text-xs text-slate-600">{currency.network}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    1 USD = {(1/currency.rate).toFixed(6)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Balance Card */}
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
                            <div className="text-2xl font-bold text-slate-800 mb-2">
                                {pkg.price} USD
                            </div>
                            
                            {selectedCurrency && selectedCurrency.code !== 'USD' && (
                                <div className="text-lg font-semibold text-blue-600 mb-2 flex items-center justify-center">
                                    {selectedCurrency.icon && <span className="mr-1">{selectedCurrency.icon}</span>}
                                    {calculateCryptoAmount(pkg.price)} {selectedCurrency.code}
                                </div>
                            )}
                            
                            <div className="text-sm text-slate-500 mb-6">
                                ≈ {(pkg.price / pkg.tokens).toFixed(3)} USD par jeton
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
                                                    {payment.status === 'pending' && !payment.payment_url && payment.memo && (
                                                        <div className="text-xs">
                                                            <span className="text-slate-600">Memo:</span>
                                                            <div className="font-mono text-blue-600 cursor-pointer" 
                                                                 onClick={() => copyToClipboard(payment.memo!)}>
                                                                {payment.memo}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {payment.status === 'pending' && !payment.payment_url && !payment.memo && (
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

            {/* Payment Verification by Transaction ID Section */}
            <div className="mt-8 glass-card p-6">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                    <RefreshCw size={20} className="mr-2" />
                    Vérifier un paiement par ID de transaction
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-700 mb-2">
                        Vous avez effectué un paiement et souhaitez vérifier son statut ? 
                        Entrez votre ID de transaction ci-dessous.
                    </p>
                    <p className="text-xs text-blue-600">
                        L'ID de transaction se trouve dans votre historique de paiements ou dans l'email de confirmation.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Entrez votre ID de transaction"
                            className="form-input w-full"
                            value={transactionIdToCheck}
                            onChange={(e) => setTransactionIdToCheck(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={checkTransactionStatus}
                        disabled={!transactionIdToCheck.trim() || checkingTransaction}
                        className="btn btn-primary"
                    >
                        {checkingTransaction ? (
                            <>
                                <RefreshCw size={16} className="mr-2 animate-spin" />
                                Vérification...
                            </>
                        ) : (
                            <>
                                <Check size={16} className="mr-2" />
                                Vérifier
                            </>
                        )}
                    </button>
                </div>

                {transactionStatus && (
                    <div className="mt-4 p-4 rounded-lg border">
                        <div className={`flex items-center mb-3 ${
                            transactionStatus.status === 'paid' || transactionStatus.status === 'completed' || transactionStatus.status === 'confirmed'
                                ? 'text-green-600'
                                : transactionStatus.status === 'pending' || transactionStatus.status === 'processing'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}>
                            {transactionStatus.status === 'paid' || transactionStatus.status === 'completed' || transactionStatus.status === 'confirmed' ? (
                                <Check size={20} className="mr-2" />
                            ) : transactionStatus.status === 'pending' || transactionStatus.status === 'processing' ? (
                                <Clock size={20} className="mr-2" />
                            ) : (
                                <AlertCircle size={20} className="mr-2" />
                            )}
                            <span className="font-semibold">
                                Statut: {getStatusText(transactionStatus.status)}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-slate-700">ID de transaction:</span>
                                <div className="font-mono text-slate-600 break-all">{transactionStatus.id}</div>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Montant:</span>
                                <div className="text-slate-600">{transactionStatus.amount} {transactionStatus.currency}</div>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Jetons:</span>
                                <div className="text-slate-600">{transactionStatus.token_amount} jetons</div>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Date de création:</span>
                                <div className="text-slate-600">
                                    {new Date(transactionStatus.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            {transactionStatus.completed_at && (
                                <div>
                                    <span className="font-medium text-slate-700">Date de completion:</span>
                                    <div className="text-slate-600">
                                        {new Date(transactionStatus.completed_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            )}
                            {transactionStatus.memo && (
                                <div className="md:col-span-2">
                                    <span className="font-medium text-slate-700">Memo:</span>
                                    <div className="font-mono text-slate-600 bg-slate-50 p-2 rounded mt-1">
                                        {transactionStatus.memo}
                                    </div>
                                </div>
                            )}
                        </div>

                        {(transactionStatus.status === 'pending' || transactionStatus.status === 'processing') && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm text-yellow-700">
                                    ⏳ Votre paiement est en cours de traitement. 
                                    Les confirmations blockchain peuvent prendre jusqu'à 10 minutes.
                                </p>
                            </div>
                        )}

                        {transactionStatus.status === 'failed' && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm text-red-700">
                                    ❌ Ce paiement a échoué. Contactez le support si vous pensez qu'il s'agit d'une erreur.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 glass-card p-6">
                <h4 className="font-semibold text-slate-800 mb-4">Paiement sécurisé par cryptomonnaies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Paiements en USDT, TRON, BNB et autres cryptos</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Taux de change en temps réel</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Support multi-réseaux (TRC-20, BSC, ERC-20)</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Transactions sécurisées et confirmées automatiquement</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Confirmation en 1-10 minutes</span>
                    </div>
                    <div className="flex items-start">
                        <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Frais de transaction optimisés par réseau</span>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <h5 className="font-semibold text-blue-800 mb-2">Devises supportées :</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {supportedCurrencies.map((currency) => (
                            <div key={currency.code} className="flex items-center text-blue-700">
                                <span className="mr-2">{currency.icon}</span>
                                <span className="text-xs">
                                    {currency.code} ({currency.network})
                                </span>
                            </div>
                        ))}
                    </div>
                    <ul className="list-disc pl-5 text-blue-700 space-y-1">
                        <li>Paiements traités via blockchain avec taux de change en temps réel</li>
                        <li>Utilisez le bon réseau selon la cryptomonnaie sélectionnée</li>
                        <li>Le memo est obligatoire pour identifier votre transaction</li>
                        <li>Support disponible : support@{window.location.hostname}</li>
                        <li>Les jetons sont crédités après confirmation blockchain</li>
                        <li>Politique de remboursement : voir nos <Link to="/terms" className="underline">conditions d'utilisation</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TokenPurchase;
