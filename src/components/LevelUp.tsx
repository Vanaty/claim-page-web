import React, { useState } from 'react';
import { Zap, CircleDot, Lock } from 'lucide-react';
import { TronAccount } from '../types';
import RouletteBot from './RouletteBot';

interface LevelUpProps {
  accounts: TronAccount[];
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

type GameTab = 'roulette' | 'coming_soon';

const TABS: { id: GameTab; label: string; icon: React.ReactNode; available: boolean }[] = [
  {
    id: 'roulette',
    label: 'Roulette',
    icon: <CircleDot size={16} />,
    available: true,
  },
  {
    id: 'coming_soon',
    label: 'Autres jeux',
    icon: <Lock size={16} />,
    available: false,
  },
];

const LevelUp: React.FC<LevelUpProps> = ({ accounts, showToast }) => {
  const [activeTab, setActiveTab] = useState<GameTab>('roulette');

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Level UP</h1>
          <p className="text-sm text-slate-500">Bots de jeu automatisés — configurez et laissez tourner côté serveur</p>
        </div>
      </div>

      {/* ── Game Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            disabled={!tab.available}
            onClick={() => tab.available && setActiveTab(tab.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.id && tab.available
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              ${!tab.available ? 'opacity-40 cursor-not-allowed hover:text-slate-500 hover:border-transparent' : 'cursor-pointer'}
            `}
          >
            {tab.icon}
            {tab.label}
            {!tab.available && (
              <span className="ml-1 text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                Bientôt
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────────── */}
      {activeTab === 'roulette' && (
        <RouletteBot accounts={accounts} showToast={showToast} />
      )}

      {activeTab === 'coming_soon' && (
        <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400 gap-3">
          <Lock size={40} className="opacity-30" />
          <p className="text-lg font-medium">Bientôt disponible</p>
          <p className="text-sm max-w-sm">
            De nouveaux jeux automatisés arrivent prochainement. Restez à l'écoute !
          </p>
        </div>
      )}
    </div>
  );
};

export default LevelUp;
