import React from 'react';

interface StepInputProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  ringColor?: string;
  placeholder?: string;
}

const StepInput: React.FC<StepInputProps> = ({
  value,
  onChange,
  step = 1,
  min = 0,
  ringColor = 'focus:ring-blue-200',
  placeholder = '0 = désactivé',
}) => {
  const dec = () => onChange(Math.max(min, parseFloat((value - step).toFixed(6))));
  const inc = () => onChange(parseFloat((value + step).toFixed(6)));

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={dec}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 text-lg font-bold transition select-none"
        aria-label="Diminuer"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        step={step}
        value={value.toFixed(6)}
        onChange={e => onChange(Number(Math.max(min, Number(e.target.value)).toFixed(6)))}
        className={`w-28 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 ${ringColor} text-center`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={inc}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 text-lg font-bold transition select-none"
        aria-label="Augmenter"
      >
        +
      </button>
    </div>
  );
};

export default StepInput;