import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, User, Home as HomeIcon } from 'lucide-react';
import { AppSettings, CategoryBudget } from '../../types';
import { formatINR } from '../../utils/currency';

interface FirstTimeSetupModalProps {
  isOpen: boolean;
  onCompleteSetup: (setupData: {
    salary: number;
    savings: number;
    personal: number;
    girlfriend: number;
    home: number;
  }) => void;
}

export const FirstTimeSetupModal: React.FC<FirstTimeSetupModalProps> = ({
  isOpen,
  onCompleteSetup,
}) => {
  const [salary, setSalary] = useState('10000');
  const [savings, setSavings] = useState('6000');
  const [personal, setPersonal] = useState('1000');
  const [girlfriend, setGirlfriend] = useState('1000');
  const [home, setHome] = useState('2000');

  if (!isOpen) return null;

  const numSalary = Number(salary) || 0;
  const numSavings = Number(savings) || 0;
  const numPersonal = Number(personal) || 0;
  const numGirlfriend = Number(girlfriend) || 0;
  const numHome = Number(home) || 0;

  const totalAllocated = numSavings + numPersonal + numGirlfriend + numHome;
  const unallocated = numSalary - totalAllocated;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numSalary <= 0) return;

    onCompleteSetup({
      salary: numSalary,
      savings: numSavings,
      personal: numPersonal,
      girlfriend: numGirlfriend,
      home: numHome,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <span className="font-extrabold text-2xl">₹</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Let's set up your monthly money plan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Personalized for your salary, savings, personal freedom, and home life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Monthly Salary */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Monthly Salary (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-extrabold font-mono-numbers text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Savings Target */}
          <div>
            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Savings Target (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-800 text-sm font-extrabold font-mono-numbers text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Personal */}
          <div>
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5" />
              My Personal Budget (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={personal}
              onChange={(e) => setPersonal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Girlfriend */}
          <div>
            <label className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-1">
              <Heart className="w-3.5 h-3.5" />
              Me & My Girlfriend Budget (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={girlfriend}
              onChange={(e) => setGirlfriend(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Home */}
          <div>
            <label className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 mb-1">
              <HomeIcon className="w-3.5 h-3.5" />
              Home Budget (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Live Reconciliation Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
              <span>Total Allocation:</span>
              <span className="font-bold font-mono-numbers text-slate-900 dark:text-white">
                {formatINR(totalAllocated)} / {formatINR(numSalary)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">
                {unallocated >= 0 ? 'Remaining Buffer:' : 'Over-allocated:'}
              </span>
              <span
                className={`font-bold font-mono-numbers ${
                  unallocated >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatINR(unallocated)}
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Managing My Money</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
