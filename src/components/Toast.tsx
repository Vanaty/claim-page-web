import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
}

interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const bgColor = 
    type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
    type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
    'bg-blue-100 text-blue-800 border-l-4 border-blue-500';

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`mb-2 p-4 rounded-lg shadow-lg flex items-center justify-between ${bgColor}`}
      style={{ minWidth: '300px', maxWidth: '450px' }}
    >
      <div className="flex items-center">
        <Icon size={18} className="mr-2 flex-shrink-0" />
        <p className="pr-2">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-500 hover:text-slate-700"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  position = 'top-right' 
}) => {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50'
  };

  return (
    <div className={positionClasses[position]}>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
