import React, { useState, useEffect, useCallback } from 'react';
import StepInput from './StepInput';
import {
  Play,
  Square,
  RefreshCw,
  Clock,
  TrendingDown,
  TrendingUp,
  Coins,
  ChevronDown,
  ChevronUp,
  Info,
  StopCircle,
  X,
  Trash2,
} from 'lucide-react';
import {
  TronAccount,
  RouletteConfig,
  RouletteSession,
  RouletteBet,
  RouletteMartingaleStrategy,
} from '../types';
import {
  startRouletteBot,
  stopRouletteBot,
  stopAllRouletteBots,
  getRouletteStatus,
} from '../services/apiService';

// ─── Constants ────────────────────────────────────────────────────────────────

const RED_NUMS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

/** Standard European roulette grid: 3 rows × 12 columns */
const GRID_ROWS: number[][] = [
  [3,  6,  9,  12, 15, 18, 21, 24, 27, 30, 33, 36], // top row
  [2,  5,  8,  11, 14, 17, 20, 23, 26, 29, 32, 35], // mid row
  [1,  4,  7,  10, 13, 16, 19, 22, 25, 28, 31, 34], // bot row
];

const CHIP_VALUES: {id: number, value: number; label: string}[] = [
    {id: 0, value: 100, label: '100'},
    {id: 1, value: 1000, label: '1K'},
    {id: 2, value: 10000, label: '10K'},
    {id: 3, value: 100000, label: '100K'},
    {id: 4, value: 1000000, label: '1M'},
    {id: 5, value: 10000000, label: '10M'},
    {id: 6, value: 100000000, label: '100M'},
];

const STRATEGIES: { value: RouletteMartingaleStrategy; label: string; description: string }[] = [
  { value: 'none',               label: 'Mise fixe',       description: 'Mise identique à chaque tour' },
  { value: 'martingale',         label: 'Martingale',      description: 'Double la mise après chaque perte' },
  { value: 'reverse_martingale', label: 'Anti-Martingale', description: 'Double la mise après chaque gain' },
  { value: 'fibonacci',          label: 'Fibonacci',       description: 'Suit la séquence de Fibonacci' },
];

const SCHEDULE_PRESETS = [
  { label: 'Toutes les 5 min',  value: 'PT5M'   },
  { label: 'Toutes les 10 min', value: 'PT10M'  },
  { label: 'Toutes les 15 min', value: 'PT15M'  },
  { label: 'Toutes les 30 min', value: 'PT30M'  },
  { label: 'Toutes les heures', value: 'PT1H'   },
  { label: 'Personnalisé',      value: 'custom' },
];

interface BotConfig {
  strategy:        RouletteMartingaleStrategy;
  stop_loss:       number;
  stop_win:        number;
  stop_on_wagered: number;
}

const DEFAULT_BOT_CONFIG: BotConfig = {
  strategy:        'none',
  stop_loss:       0.0,
  stop_win:        0.0,
  stop_on_wagered: 0.0,
};

const BET_LABELS: Record<string, string> = {
  red:    '♦ Rouge',
  black:  '♣ Noir',
  green:  '0 Vert',
  odd:    'Impair',
  even:   'Pair',
  '1-18': '1-18',
  '19-36':'19-36',
  dozen1: '1ère Douzaine (1-12)',
  dozen2: '2e Douzaine (13-24)',
  dozen3: '3e Douzaine (25-36)',
  col1:   'Colonne 1 (2:1)',
  col2:   'Colonne 2 (2:1)',
  col3:   'Colonne 3 (2:1)',
};

const betLabel = (key: string): string => {
  if (BET_LABELS[key]) return BET_LABELS[key];
  if (key.startsWith('n')) return `N° ${key.slice(1)}`;
  return key;
};

/**
 * Zone numbers sent to the backend:
 *  0-36  → individual numbers
 *  37    → 1-18
 *  38    → 19-36
 *  39    → red
 *  40    → black
 *  41    → even
 *  42    → odd
 *  43    → dozen1 (1-12)
 *  44    → dozen2 (13-24)
 *  45    → dozen3 (25-36)
 *  46    → col1
 *  47    → col2
 *  48    → col3
 */
const ZONE_MAP: Record<string, number> = {
  'n0': 0,  'n1': 1,  'n2': 2,  'n3': 3,  'n4': 4,  'n5': 5,
  'n6': 6,  'n7': 7,  'n8': 8,  'n9': 9,  'n10': 10, 'n11': 11,
  'n12': 12,'n13': 13,'n14': 14,'n15': 15,'n16': 16,'n17': 17,
  'n18': 18,'n19': 19,'n20': 20,'n21': 21,'n22': 22,'n23': 23,
  'n24': 24,'n25': 25,'n26': 26,'n27': 27,'n28': 28,'n29': 29,
  'n30': 30,'n31': 31,'n32': 32,'n33': 33,'n34': 34,'n35': 35,
  'n36': 36,
  '1-18':   37,
  '19-36':  38,
  'red':    39,
  'black':  40,
  'even':   41,
  'odd':    42,
  'dozen1': 43,
  'dozen2': 44,
  'dozen3': 45,
  'col1':   46,
  'col2':   47,
  'col3':   48,
};

/** Chip colors (casino-style) keyed by chip id */
const CHIP_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  0: { bg: '#94a3b8', border: '#64748b', text: '#0f172a' }, // silver  – 100
  1: { bg: '#ef4444', border: '#b91c1c', text: '#fff'    }, // red     – 1K
  2: { bg: '#3b82f6', border: '#1d4ed8', text: '#fff'    }, // blue    – 10K
  3: { bg: '#22c55e', border: '#15803d', text: '#fff'    }, // green   – 100K
  4: { bg: '#0f172a', border: '#475569', text: '#fff'    }, // black   – 1M
  5: { bg: '#a855f7', border: '#7e22ce', text: '#fff'    }, // purple  – 10M
  6: { bg: '#f59e0b', border: '#d97706', text: '#0f172a' }, // gold    – 100M
};

// ─── ChipBadge ────────────────────────────────────────────────────────────────

const ChipBadge: React.FC<{ chipIds: number[] }> = ({ chipIds }) => {
  const topId = chipIds[chipIds.length - 1];
  const chip  = CHIP_VALUES.find(c => c.id === topId);
  const color = CHIP_COLORS[topId] ?? CHIP_COLORS[0];
  const count = chipIds.length;
  return (
    <span style={{ position: 'absolute', top: '-6px', right: '-6px', zIndex: 2, pointerEvents: 'none' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: color.bg,
          color: color.text,
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          fontSize: '8px',
          fontWeight: '900',
          lineHeight: 1,
          border: `2px solid ${color.border}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        {chip?.label ?? '?'}
      </span>
      {count > 1 && (
        <span
          style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            background: '#1e293b',
            color: '#fff',
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '7px',
            fontWeight: '900',
            border: '1.5px solid #fff',
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
};

// ─── RouletteTableGrid ────────────────────────────────────────────────────────

interface RouletteTableGridProps {
  /** zone key → chip_id[] (stacked chips) */
  selectedBets: Record<string, number[]>;
  onCellClick: (key: string) => void;
}

const cellBase: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  color: 'white',
  borderRadius: '4px',
  border: '2px solid transparent',
  transition: 'filter 0.1s, border-color 0.1s',
  userSelect: 'none',
  minHeight: '44px',
};

const selectedBorder: React.CSSProperties = {
  border: '2px solid #fbbf24',
  boxShadow: '0 0 0 1px #fbbf24, inset 0 0 0 200px rgba(251,191,36,0.13)',
};

const RouletteTableGrid: React.FC<RouletteTableGridProps> = ({ selectedBets, onCellClick }) => {
  const numBg = (n: number) =>
    n === 0 ? '#16a34a' : RED_NUMS.has(n) ? '#dc2626' : '#1e293b';

  const isSel = (k: string) => (selectedBets[k]?.length ?? 0) > 0;

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '52px repeat(12, 1fr) 46px',
    gridTemplateRows: '44px 44px 44px',
    gap: '2px',
  };

  const subRow: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '52px repeat(12, 1fr) 46px',
    gap: '2px',
    marginTop: '2px',
  };

  const outsideBg = (key: string) => {
    if (key === 'red')   return '#dc2626';
    if (key === 'black') return '#0f172a';
    return '#475569';
  };

  const outsideSelBg = (key: string) => {
    if (key === 'red')   return '#dc2626'; // keep red color even when selected
    if (key === 'black') return '#0f172a'; // keep black color even when selected
    return '#1d4ed8';
  };

  return (
    <div style={{ minWidth: '580px' }}>

      {/* ── Numbers grid + Zero + Column bets ────────────────────────────── */}
      <div style={gridStyle}>

        {/* 0 — spans all 3 rows */}
        <button
          style={{
            ...cellBase,
            gridRow: '1 / 4',
            background: numBg(0),
            minHeight: '134px',
            fontSize: '22px',
            ...(isSel('n0') ? selectedBorder : {}),
          }}
          onClick={() => onCellClick('n0')}
        >
          0
          {isSel('n0') && <ChipBadge chipIds={selectedBets['n0']} />}
        </button>

        {/* Number cells */}
        {GRID_ROWS.map((row, rowIdx) =>
          row.map((num, colIdx) => {
            const key = `n${num}`;
            return (
              <button
                key={num}
                style={{
                  ...cellBase,
                  gridColumn: `${colIdx + 2}`,
                  gridRow: `${rowIdx + 1}`,
                  background: numBg(num),
                  ...(isSel(key) ? selectedBorder : {}),
                }}
                onClick={() => onCellClick(key)}
              >
                {num}
                {isSel(key) && <ChipBadge chipIds={selectedBets[key]} />}
              </button>
            );
          })
        )}

        {/* Column bets (2:1) — right side, one per row */}
        {(['col3', 'col2', 'col1'] as const).map((key, i) => (
          <button
            key={key}
            style={{
              ...cellBase,
              gridColumn: '14',
              gridRow: `${i + 1}`,
              background: isSel(key) ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              ...(isSel(key) ? selectedBorder : {}),
            }}
            onClick={() => onCellClick(key)}
          >
            2:1
            {isSel(key) && <ChipBadge chipIds={selectedBets[key]} />}
          </button>
        ))}
      </div>

      {/* ── Dozen bets ────────────────────────────────────────────────────── */}
      <div style={subRow}>
        <div style={{ gridColumn: '1' }} />
        {(['dozen1', 'dozen2', 'dozen3'] as const).map((key, i) => {
          const labels = ['1ère Douzaine (1-12)', '2e Douzaine (13-24)', '3e Douzaine (25-36)'];
          return (
            <button
              key={key}
              style={{
                ...cellBase,
                gridColumn: `${i * 4 + 2} / ${i * 4 + 6}`,
                background: isSel(key) ? '#1d4ed8' : '#475569',
                padding: '8px',
                fontSize: '11px',
                ...(isSel(key) ? selectedBorder : {}),
              }}
              onClick={() => onCellClick(key)}
            >
              {labels[i]}
              {isSel(key) && <ChipBadge chipIds={selectedBets[key]} />}
            </button>
          );
        })}
        <div style={{ gridColumn: '14' }} />
      </div>

      {/* ── Outside bets ──────────────────────────────────────────────────── */}
      <div style={subRow}>
        <div style={{ gridColumn: '1' }} />
        {[
          { key: '1-18',  label: '1-18'    },
          { key: 'even',  label: 'Pair'    },
          { key: 'red',   label: '♦ Rouge' },
          { key: 'black', label: '♣ Noir'  },
          { key: 'odd',   label: 'Impair'  },
          { key: '19-36', label: '19-36'   },
        ].map((bet, i) => (
          <button
            key={bet.key}
            style={{
              ...cellBase,
              gridColumn: `${i * 2 + 2} / ${i * 2 + 4}`,
              background: isSel(bet.key) ? outsideSelBg(bet.key) : outsideBg(bet.key),
              padding: '8px',
              fontSize: '12px',
              ...(isSel(bet.key) ? selectedBorder : {}),
            }}
            onClick={() => onCellClick(bet.key)}
          >
            {bet.label}
            {isSel(bet.key) && <ChipBadge chipIds={selectedBets[bet.key]} />}
          </button>
        ))}
        <div style={{ gridColumn: '14' }} />
      </div>

    </div>
  );
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: RouletteSession['status'] }> = ({ status }) => {
  const map = {
    running:   { cls: 'bg-green-100 text-green-700 border-green-200', label: 'En cours' },
    stopped:   { cls: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Arrêté'   },
    completed: { cls: 'bg-blue-100  text-blue-700  border-blue-200',  label: 'Terminé'  },
  };
  const { cls, label } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface RouletteBotProps {
  accounts:  TronAccount[];
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const RouletteBot: React.FC<RouletteBotProps> = ({ accounts, showToast }) => {
  const [config, setConfig]                         = useState<BotConfig>(DEFAULT_BOT_CONFIG);
  /** zone key → chip_id[] (stacked chips; each click appends) */
  const [selectedBets, setSelectedBets]             = useState<Record<string, number[]>>({});
  /** currently selected chip id (index into CHIP_VALUES) */
  const [activeChipId, setActiveChipId]             = useState<number>(0);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode]             = useState<string>('PT5M');
  const [customSchedule, setCustomSchedule]         = useState<string>('');
  const [sessions, setSessions]                     = useState<RouletteSession[]>([]);
  const [isSubmitting, setIsSubmitting]             = useState(false);
  const [isLoadingStatus, setIsLoadingStatus]       = useState(false);
  const [showSessionsExpanded, setShowSessionsExpanded] = useState(true);

  const resolvedSchedule = scheduleMode === 'custom' ? customSchedule : scheduleMode;

  // ── Status polling ──────────────────────────────────────────────────────────

  const refreshStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const data = await getRouletteStatus();
      setSessions(data);
    } catch {
      // silently ignore – no sessions yet
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 15_000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  // ── Bet handlers ────────────────────────────────────────────────────────────

  /** Append the active chip to the zone's stack */
  const handleCellClick = (key: string) => {
    setSelectedBets(prev => ({
      ...prev,
      [key]: [...(prev[key] ?? []), activeChipId],
    }));
  };

  /** Remove a single chip at a given index from a zone */
  const handleRemoveChipAt = (key: string, index: number) => {
    setSelectedBets(prev => {
      const chips = [...(prev[key] ?? [])];
      chips.splice(index, 1);
      if (chips.length === 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: chips };
    });
  };

  /** Remove all chips from a zone */
  const handleRemoveBet = (key: string) =>
    setSelectedBets(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleClearBets = () => setSelectedBets({});

  // ── Account helpers ─────────────────────────────────────────────────────────

  const toggleAccount = (id: string) =>
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );

  const setField = <K extends keyof BotConfig>(key: K, value: BotConfig[K]) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleStart = async () => {
    if (selectedAccountIds.length === 0) {
      showToast('error', 'Sélectionnez au moins un compte.');
      return;
    }
    if (!resolvedSchedule) {
      showToast('error', 'Définissez un intervalle de planification.');
      return;
    }
    if (config.stop_loss === 0 && config.stop_win === 0 && config.stop_on_wagered === 0) {
      showToast('error', 'Définissez au moins une condition d\'arrêt (Stop Loss, Stop Win ou Stop sur Misé).');
      return;
    }
    const bets: RouletteBet[] = Object.entries(selectedBets)
      .filter(([key]) => ZONE_MAP[key] !== undefined)
      .flatMap(([key, chipIds]) => chipIds.map(chip_id => ({ zone: ZONE_MAP[key], chip_id })));

    if (bets.length === 0) {
      showToast('error', 'Sélectionnez au moins une case sur la table.');
      return;
    }

    setIsSubmitting(true);
    try {
        for (const id of selectedAccountIds) {
            const payload: RouletteConfig = {
                ...config,
                schedule: resolvedSchedule,
                bets,
                account_id: id, // send one request per account for better tracking and control
            };
            const result = await startRouletteBot(payload);
            showToast('success', result.message || 'Bot roulette démarré !');
        }
        await refreshStatus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      showToast('error', e?.response?.data?.detail || 'Erreur lors du démarrage du bot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStop = async (sessionId: string) => {
    try {
      const result = await stopRouletteBot(sessionId);
      showToast('info', result.message || 'Session arrêtée.');
      await refreshStatus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      showToast('error', e?.response?.data?.detail || "Erreur lors de l'arrêt.");
    }
  };

  const handleStopAll = async () => {
    try {
      const result = await stopAllRouletteBots();
      showToast('info', result.message || 'Toutes les sessions arrêtées.');
      await refreshStatus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      showToast('error', e?.response?.data?.detail || "Erreur lors de l'arrêt global.");
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const activeSessions   = sessions.filter(s => s.status === 'running');
  const selectedBetKeys  = Object.keys(selectedBets);
  const totalBetPerRound = Object.values(selectedBets).flat().reduce((sum, chipId) => {
    const chip = CHIP_VALUES.find(c => c.id === chipId);
    return sum + (chip?.value ?? 0);
  }, 0);

  const dotColor = (key: string) => {
    if (key === 'red')   return '#dc2626';
    if (key === 'black') return '#1e293b';
    if (key.startsWith('n')) {
      const n = Number(key.slice(1));
      if (n === 0) return '#16a34a';
      return RED_NUMS.has(n) ? '#dc2626' : '#1e293b';
    }
    return '#64748b';
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Bet Selection Card ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-lg">🎰</span>
            Sélection des Mises
          </h2>
          {selectedBetKeys.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{selectedBetKeys.length}</span>{' '}
                zone{selectedBetKeys.length > 1 ? 's' : ''} —{' '}
                <span className="font-semibold text-slate-600">{Object.values(selectedBets).flat().length}</span> jeton{Object.values(selectedBets).flat().length > 1 ? 's' : ''} — Total :{' '}
                <span className="font-semibold text-blue-700">{(totalBetPerRound/1000000)}</span> TRX/tour
              </span>
              <button
                onClick={handleClearBets}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition"
              >
                <Trash2 size={11} />
                Effacer tout
              </button>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">

          {/* ── Chip selector ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">Jeton :</span>
            {CHIP_VALUES.map(chip => {
              const color  = CHIP_COLORS[chip.id];
              const active = activeChipId === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveChipId(chip.id)}
                  style={{
                    background: active ? color.bg : '#fff',
                    borderColor: active ? color.border : '#e2e8f0',
                    color: active ? color.text : '#334155',
                    transform: active ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  className="w-12 h-12 rounded-full font-bold text-xs border-2 transition-all"
                >
                  {chip.label}
                </button>
              );
            })}
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
              Chaque clic ajoute un jeton · Cumulable sur la même case
            </span>
          </div>

          {/* ── Roulette table ────────────────────────────────────────────── */}
          <div
            className="overflow-x-auto pb-2 rounded-xl"
            style={{ background: '#1a5c1a', padding: '10px 10px 12px' }}
          >
            <RouletteTableGrid
              selectedBets={selectedBets}
              onCellClick={handleCellClick}
            />
          </div>

          {/* ── Selected bets summary ─────────────────────────────────────── */}
          {selectedBetKeys.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Zone</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Zone #</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Jetons posés</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Total zone</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBetKeys.map(key => {
                    const chipIds  = selectedBets[key] ?? [];
                    const zoneTotal = chipIds.reduce((s, cid) => s + (CHIP_VALUES.find(c => c.id === cid)?.value ?? 0), 0);
                    return (
                      <tr key={key} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-medium text-slate-700">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                              style={{ background: dotColor(key) }}
                            />
                            {betLabel(key)}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-400 text-xs font-mono">
                          zone {ZONE_MAP[key]}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1 flex-wrap items-center">
                            {chipIds.map((cid, idx) => {
                              const cc   = CHIP_COLORS[cid] ?? CHIP_COLORS[0];
                              const chip = CHIP_VALUES.find(c => c.id === cid);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleRemoveChipAt(key, idx)}
                                  title={`Retirer ce jeton (${chip?.value.toLocaleString()})`}
                                  style={{
                                    background: cc.bg,
                                    borderColor: cc.border,
                                    color: cc.text,
                                    position: 'relative',
                                  }}
                                  className="w-8 h-8 rounded-full text-[10px] font-bold border-2 transition-all hover:opacity-70 hover:scale-95"
                                >
                                  {chip?.label ?? '?'}
                                </button>
                              );
                            })}
                            {/* Quick-add active chip button */}
                            <button
                              onClick={() => handleCellClick(key)}
                              title="Ajouter le jeton actif"
                              className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-600 text-[10px] font-bold transition-all flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-600 font-medium text-sm hidden sm:table-cell">
                          {zoneTotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleRemoveBet(key)}
                            className="text-slate-400 hover:text-red-500 transition"
                            title="Retirer tous les jetons de cette zone"
                          >
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-400 text-sm py-1">
              Choisissez un jeton, puis cliquez sur les cases de la table pour placer vos mises.
            </p>
          )}
        </div>
      </div>

      {/* ── Bot Config Table ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600">⚙️</span>
            Configuration du Bot
          </h2>
          {activeSessions.length > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {activeSessions.length} session(s) active(s)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-48">Paramètre</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Valeur</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

              {/* Stratégie */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">Stratégie</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {STRATEGIES.map(s => (
                      <button
                        disabled
                        key={s.value}
                        onClick={() => setField('strategy', s.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                          ${config.strategy === s.value
                            ? 'bg-blue-600 text-white border-transparent shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                  {STRATEGIES.find(s => s.value === config.strategy)?.description}
                </td>
              </tr>

              {/* Planification */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    Planification
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {SCHEDULE_PRESETS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setScheduleMode(p.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                          ${scheduleMode === p.value
                            ? 'bg-indigo-600 text-white border-transparent shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                    {scheduleMode === 'custom' && (
                      <input
                        type="text"
                        placeholder="ex: PT2M30S"
                        value={customSchedule}
                        onChange={e => setCustomSchedule(e.target.value)}
                        className="w-44 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">Intervalle entre chaque tour du bot</td>
              </tr>

              {/* Stop Loss */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown size={14} className="text-red-400" />
                    Stop Loss
                    <span className="text-red-400 text-xs font-bold" title="Au moins une condition d'arrêt est requise">*</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StepInput
                      value={config.stop_loss}
                      onChange={v => setField('stop_loss', v)}
                      step={0.0001}
                      ringColor="focus:ring-red-200"
                    />
                    <span className="text-slate-400 text-xs">TRX</span>
                    {config.stop_loss === 0 && <span className="text-xs text-slate-400 italic">désactivé</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">Stoppe si perte cumulée ≥ seuil</td>
              </tr>

              {/* Stop Win */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-green-500" />
                    Stop Win
                    <span className="text-red-400 text-xs font-bold" title="Au moins une condition d'arrêt est requise">*</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StepInput
                      value={config.stop_win}
                      onChange={v => setField('stop_win', v)}
                      step={0.0001}
                      ringColor="focus:ring-green-200"
                    />
                    <span className="text-slate-400 text-xs">TRX</span>
                    {config.stop_win === 0 && <span className="text-xs text-slate-400 italic">désactivé</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">Stoppe si gain cumulé ≥ seuil</td>
              </tr>

              {/* Stop on Wagered */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Coins size={14} className="text-yellow-500" />
                    Stop sur Misé
                    <span className="text-red-400 text-xs font-bold" title="Au moins une condition d'arrêt est requise">*</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StepInput
                      value={config.stop_on_wagered}
                      onChange={v => setField('stop_on_wagered', v)}
                      step={0.0001}
                      ringColor="focus:ring-yellow-200"
                    />
                    <span className="text-slate-400 text-xs">TRX</span>
                    {config.stop_on_wagered === 0 && <span className="text-xs text-slate-400 italic">désactivé</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">Stoppe si total misé ≥ seuil</td>
              </tr>

              {/* Required note row */}
              <tr>
                <td colSpan={3} className="px-4 py-2 text-xs text-red-400 italic">
                  * Au moins une condition d'arrêt est requise.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* ── Account Selection ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Comptes cibles
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({selectedAccountIds.length} / {accounts.length} sélectionné{selectedAccountIds.length > 1 ? 's' : ''})
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedAccountIds(accounts.map(a => a.id))}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition"
            >
              Tout sélectionner
            </button>
            <button
              onClick={() => setSelectedAccountIds([])}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition"
            >
              Effacer
            </button>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-400 text-sm">
            <Info size={28} className="mx-auto mb-2 opacity-40" />
            Aucun compte disponible. Ajoutez des comptes d'abord.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-2.5 w-8"></th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Adresse</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Site</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Solde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map(acc => {
                  const isSelected = selectedAccountIds.includes(acc.id);
                  return (
                    <tr
                      key={acc.id}
                      onClick={() => toggleAccount(acc.id)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 hover:bg-blue-100/60' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAccount(acc.id)}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-700 max-w-[180px] truncate">
                        {acc.address}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 hidden md:table-cell text-xs">
                        {acc.baseUrl ?? '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                          ${acc.status === 'active'  ? 'bg-green-50  text-green-700  border-green-200'  : ''}
                          ${acc.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${acc.status === 'error'   ? 'bg-red-50    text-red-700    border-red-200'    : ''}
                        `}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 font-medium hidden sm:table-cell">
                        {acc.balance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Action Buttons ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isSubmitting || selectedAccountIds.length === 0 || selectedBetKeys.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition"
        >
          {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          {isSubmitting ? 'Démarrage…' : 'Démarrer le Bot'}
        </button>

        {activeSessions.length > 0 && (
          <button
            onClick={handleStopAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition"
          >
            <StopCircle size={16} />
            Tout Arrêter ({activeSessions.length})
          </button>
        )}

        <button
          onClick={refreshStatus}
          disabled={isLoadingStatus}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm transition"
        >
          <RefreshCw size={14} className={isLoadingStatus ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* ── Sessions ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          className="w-full px-5 py-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50/50 transition"
          onClick={() => setShowSessionsExpanded(p => !p)}
        >
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600">📊</span>
            Sessions ({sessions.length})
          </h2>
          {showSessionsExpanded
            ? <ChevronUp size={16} className="text-slate-400" />
            : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {showSessionsExpanded && (
          sessions.length === 0 ? (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">
              <Clock size={28} className="mx-auto mb-2 opacity-40" />
              Aucune session. Démarrez le bot pour en voir apparaître.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Compte</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Tours</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Misé</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Gain</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Perte</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Raison d'arrêt</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map(session => (
                    <tr key={session.session_id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-700 max-w-[120px] truncate">{session.account_id}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={session.status} /></td>
                      <td className="px-4 py-2.5 text-slate-600 hidden sm:table-cell">{session.rounds_played}</td>
                      <td className="px-4 py-2.5 text-slate-600 hidden md:table-cell">{session.total_wagered.toFixed(8).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-green-600 font-medium hidden md:table-cell">+{session.total_win.toFixed(8).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-red-500 font-medium hidden md:table-cell">-{session.total_loss.toFixed(8).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs hidden lg:table-cell">{session.stop_reason ?? '—'}</td>
                      <td className="px-4 py-2.5">
                        {session.status === 'running' ? (
                          <button
                            onClick={() => handleStop(session.session_id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-medium transition"
                          >
                            <Square size={12} />
                            Stop
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Info Banner ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          Le bot tourne entièrement <strong>côté serveur</strong>. Vous pouvez fermer cet onglet sans interrompre les sessions actives.
          Mise à jour automatique toutes les 15 secondes.
        </p>
      </div>

    </div>
  );
};

export default RouletteBot;
