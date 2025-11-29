import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  totalValue: string;
  totalLabel?: string;
  progressValue: number;
  accentColor: string; // Tailwind color class prefix (e.g., 'emerald', 'danger')
  onAdd: () => void;
  children: React.ReactNode;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  subtitle,
  totalValue,
  totalLabel = "Total até hoje:",
  progressValue,
  accentColor,
  onAdd,
  children
}) => {
  // Mapping for dynamic colors based on the accent prop
  const colors: Record<string, any> = {
    emerald: {
      bg: 'from-emerald-900/20 to-emerald-900/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      bar: 'bg-emerald-500',
      button: 'bg-emerald-500 hover:bg-emerald-400'
    },
    danger: { // Red
      bg: 'from-red-900/20 to-red-900/5',
      border: 'border-red-500/20',
      text: 'text-red-500',
      bar: 'bg-red-500',
      button: 'bg-red-500 hover:bg-red-400'
    },
    blue: {
      bg: 'from-blue-900/20 to-blue-900/5',
      border: 'border-blue-500/20',
      text: 'text-blue-500',
      bar: 'bg-blue-500',
      button: 'bg-blue-500 hover:bg-blue-400'
    },
    gold: {
      bg: 'from-yellow-900/20 to-yellow-900/5',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      bar: 'bg-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-400'
    }
  };

  const theme = colors[accentColor] || colors.emerald;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <button 
          onClick={onAdd}
          className={`px-4 py-2 rounded-lg text-white font-medium text-sm flex items-center gap-2 transition-colors ${theme.button}`}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Adicionar {title.slice(0, -1)}</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl p-6 md:p-8 mb-8 border ${theme.border} bg-gradient-to-br ${theme.bg} overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
               <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Hoje é dia <span className={`${theme.text} font-bold text-lg ml-1`}>28</span></p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">{totalLabel}</p>
                  <p className={`text-2xl font-bold dark:text-white text-slate-900`}>{totalValue}</p>
               </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full rounded-full ${theme.bar}`}
               />
            </div>
            <div className="flex justify-between mt-2">
               <span className="text-[10px] text-slate-500">{totalLabel.replace(':', '')}</span>
               <span className={`text-[10px] ${theme.text}`}>{totalValue}</span>
            </div>
            <p className="text-[10px] text-right text-slate-500 mt-1">{progressValue}% do total mensal</p>
          </div>
        </div>
      </motion.div>

      {/* Content List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/5 bg-white dark:bg-slate-900/50 dark:border-white/5 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
           {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ModuleLayout;
