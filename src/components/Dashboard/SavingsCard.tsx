import React, { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction } from '../../types';
import { formatINR, formatDateShort } from '../../utils/currency';

interface SavingsCardProps {
  savingsTarget: number;
  totalSaved: number;
  transactions: Transaction[];
  onAddDepositClick: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({
  savingsTarget,
  totalSaved,
  transactions,
  onAddDepositClick,
  onDeleteTransaction,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const savingsTransactions = transactions.filter((t) => t.type === 'savings');
  const percentProgress =
    savingsTarget > 0 ? Math.min(100, Math.round((totalSaved / savingsTarget) * 100)) : 100;
  const isGoalAchieved = totalSaved >= savingsTarget && savingsTarget > 0;

  const handleConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-950/80 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Savings Target
              </h3>
              {isGoalAchieved && (
                <button
                  onClick={handleConfetti}
                  className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-3 h-3" /> Target Met
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">Guaranteed wealth building</p>
          </div>
        </div>

        <button
          onClick={onAddDepositClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Deposit</span>
        </button>
      </div>

      {/* Figures Row */}
      <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block">
            Target
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono-numbers">
            {formatINR(savingsTarget)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            Saved
          </span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
            {formatINR(totalSaved)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block">
            Progress
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {percentProgress}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentProgress}%` }}
          />
        </div>
      </div>

      {/* Money Protected Banner */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-3 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            Money Protected
          </h4>
          <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
            <span className="font-bold">{formatINR(totalSaved)}</span> saved and removed from spending budget.
          </p>
        </div>
      </div>

      {/* Savings Deposits Toggle & List */}
      <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowHistory((h) => !h)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1"
        >
          <span>
            Savings Deposits ({savingsTransactions.length})
          </span>
          {showHistory ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showHistory && (
          <div className="mt-2 space-y-2 animate-slide-up">
            {savingsTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                Your savings journey starts here.
              </p>
            ) : (
              savingsTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDateShort(tx.date)} {tx.note && `• ${tx.note}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                      +{formatINR(tx.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete deposit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
