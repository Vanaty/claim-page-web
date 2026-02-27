import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AccountHistory } from '../types';
import { TrendingUp, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchAccountHistory } from '../services/apiService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AccountHistoryChartProps {
  accountId: string;
  accountAddress: string;
}

const AccountHistoryChart: React.FC<AccountHistoryChartProps> = ({ accountId, accountAddress }) => {
  const [history, setHistory] = useState<AccountHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [accountId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const historyData = await fetchAccountHistory(accountId);
      setHistory(historyData);
    } catch (err: any) {
      console.error('Failed to fetch account history:', err);
      setError('Impossible de charger l\'historique');
      // Generate sample data as fallback
      generateSampleHistory();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleHistory = () => {
    const sampleHistory = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 6 * 60 * 60 * 1000));
      const claimAmount = Math.random() * 2 + 0.5;
      const balance = 10 + (Math.random() * 5) + (i * 0.3);
      
      sampleHistory.push({
        date,
        balance: Math.max(0, balance),
        claimAmount: Math.random() > 0.3 ? claimAmount : undefined,
        action: Math.random() > 0.7 ? 'game' : 'claim' as 'claim' | 'game'
      });
    }
    setHistory(sampleHistory);
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-lg p-4 text-center">
        <RefreshCw size={24} className="text-blue-500 mx-auto mb-2 animate-spin" />
        <p className="text-sm text-slate-500">Chargement de l'historique...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-center">
        <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600 mb-2">{error}</p>
        <button
          onClick={loadHistory}
          className="text-xs text-red-700 hover:text-red-900 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Sort history by date and take last 10 entries
  const sortedHistory = [...history].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(-24);

  if (sortedHistory.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4 text-center">
        <Calendar size={24} className="text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Aucun historique disponible</p>
      </div>
    );
  }

  const chartData = {
    labels: sortedHistory.map(entry => 
      entry.date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Solde TRX',
        data: sortedHistory.map(entry => entry.balance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const entry = sortedHistory[context.dataIndex];
            const lines = [`Solde: ${context.parsed.y.toFixed(2)} TRX`];
            if (entry.claimAmount && entry.claimAmount > 0) {
              lines.push(`Claim: +${entry.claimAmount.toFixed(2)} TRX`);
            }
            lines.push(`Action: ${entry.action === 'claim' ? 'Réclamation' : entry.action === 'game' ? 'Jeu' : 'Mise à jour'}`);
            return lines;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
          font: {
            size: 10,
          },
          color: 'rgb(100, 116, 139)',
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
          color: 'rgb(100, 116, 139)',
          callback: function(value) {
            return Number(value).toFixed(1);
          }
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-700 flex items-center">
          <TrendingUp size={14} className="mr-1 text-blue-600" />
          Historique des 24 dernières actions
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{sortedHistory.length} entrées</span>
          <button
            onClick={loadHistory}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
            title="Actualiser"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
      
      <div style={{ height: '200px' }}>
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-medium text-blue-700">
            {sortedHistory.length > 0 ? sortedHistory[0].balance.toFixed(6) : '0.000000'}
          </div>
          <div className="text-slate-500">Avant</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded">
          <div className="font-medium text-purple-700">
            {sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].balance.toFixed(6) : '0.000000'}
          </div>
          <div className="text-slate-500">Après</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="font-medium text-green-700">
            {sortedHistory.length > 0 ? (sortedHistory[sortedHistory.length - 1].balance - sortedHistory[0].balance).toFixed(6) : '0.000000'}
          </div>
          <div className="text-slate-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default AccountHistoryChart;
