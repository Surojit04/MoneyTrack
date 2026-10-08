import React, { useState } from 'react';
import { Smartphone, Plus, ChevronDown, ChevronUp, Trash2, Radio } from 'lucide-react';
import { Transaction } from '../../types';
import { formatINR, formatDateShort } from '../../utils/currency';

interface RechargeCardProps {
  transactions: Transaction[];
  onAddRechargeClick: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const RechargeCard: React.FC<RechargeCardProps> = ({
  transactions,
  onAddRechargeClick,
  onDeleteTransaction,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const rechargeExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.categoryId === 'recharge'
  );

  const totalRecharge = rechargeExpenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-purple-100 dark:border-purple-950/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Phone Recharge
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                Standalone Tracked
              </span>
            </div>
            <p className="text-xs text-slate-400">Mobile & data plans</p>
          </div>
        </div>

        <button
          onClick={onAddRechargeClick}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Recharge</span>
        </button>
      </div>

      {/* Figures Row */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 my-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block">
            Total Recharge This Month
          </span>
          <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-numbers">
            {formatINR(totalRecharge)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-400">
            {rechargeExpenses.length} recharge{rechargeExpenses.length === 1 ? '' : 's'} logged
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Included in total spending
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowHistory((h) => !h)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1"
        >
          <span>Recharge History ({rechargeExpenses.length})</span>
          {showHistory ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showHistory && (
          <div className="mt-2 space-y-2 animate-slide-up">
            {rechargeExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No phone recharge logged this month yet.
              </p>
            ) : (
              rechargeExpenses.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{tx.title}</span>
                        {tx.operator && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded">
                            {tx.operator}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDateShort(tx.date)} {tx.note && `• ${tx.note}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                      {formatINR(tx.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete recharge"
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
