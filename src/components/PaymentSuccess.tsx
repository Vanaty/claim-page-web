import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';
import { checkPaymentStatus } from '../services/apiService';

const PaymentSuccess: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
    const [paymentInfo, setPaymentInfo] = useState<any>(null);

    useEffect(() => {
        if (orderId) {
            verifyPayment();
        }
    }, [orderId]);

    const verifyPayment = async () => {
        try {
            const result = await checkPaymentStatus(orderId!);
            setPaymentInfo(result);
            
            if (result.status === 'paid' || result.status === 'confirmed') {
                setStatus('success');
                // Redirect to dashboard after 5 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 5000);
            } else {
                setStatus('failed');
            }
        } catch (error) {
            console.error('Payment verification failed:', error);
            setStatus('failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full text-center">
                {status === 'checking' && (
                    <div className="text-blue-600">
                        <RefreshCw size={64} className="mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold mb-2">Vérification du paiement</h2>
                        <p className="text-slate-600">Veuillez patienter...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-green-600">
                        <Check size={64} className="mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
                        <p className="text-slate-600 mb-4">
                            Vos jetons ont été ajoutés à votre compte.
                        </p>
                        {paymentInfo && (
                            <div className="bg-green-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-green-800">
                                    <strong>{paymentInfo.token_amount}</strong> jetons ajoutés
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-slate-500">
                            Redirection vers le tableau de bord dans 5 secondes...
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-red-600">
                        <AlertCircle size={64} className="mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Paiement échoué</h2>
                        <p className="text-slate-600 mb-4">
                            Le paiement n'a pas pu être vérifié.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-primary"
                        >
                            Retour au tableau de bord
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
