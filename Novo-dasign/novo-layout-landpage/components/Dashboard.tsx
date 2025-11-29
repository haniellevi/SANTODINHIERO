import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Home, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Receipt from './Receipt';
import IncomesView from './IncomesView';
import ExpensesView from './ExpensesView';
import InvestmentsView from './InvestmentsView';
import MiscView from './MiscView';
import { DashboardProps } from '../types';

type DashboardView = 'home' | 'incomes' | 'expenses' | 'investments' | 'misc';

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Render the specific content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'incomes':
        return <IncomesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'investments':
        return <InvestmentsView />;
      case 'misc':
        return <MiscView />;
      default:
        return (
          <main className="max-w-3xl mx-auto px-4 pt-8">
            {/* Big Balance */}
            <div className="text-center mb-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block"
                >
                  <h1 className="text-5xl font-bold text-emerald-500 tracking-tight mb-2">R$ 5.770,00</h1>
                  <p className="text-slate-500 uppercase tracking-widest text-xs font-medium">Saldo do Mês</p>
                </motion.div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Income Card */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setCurrentView('incomes')}
                  className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between h-24 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/20"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUpCircle size={20} className="text-emerald-500" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Entradas</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-500 dark:text-emerald-400">R$ 8.500,00</span>
                </motion.div>

                {/* Expense Card */}
                <motion.div 
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   onClick={() => setCurrentView('expenses')}
                   className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between h-24 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-danger/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-danger/20"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDownCircle size={20} className="text-danger" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Saídas</span>
                    </div>
                    <span className="text-xl font-bold text-danger">R$ 2.730,00</span>
                </motion.div>
            </div>

            {/* Warning/Info Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-4 rounded-xl border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-white/[0.02] flex flex-col gap-1"
            >
                <h3 className="dark:text-white text-slate-800 font-bold text-sm">Últimos 2 dias do mês!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Revise suas entradas e saídas antes do mês acabar.</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-8 border border-slate-200 dark:border-white/5">
                <button 
                  onClick={() => setActiveTab('daily')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'daily' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Resumo do Dia
                </button>
                <button 
                   onClick={() => setActiveTab('upcoming')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Próximas
                </button>
                <button 
                   onClick={() => setActiveTab('recent')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'recent' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Recentes
                </button>
            </div>

            {/* Main Content Area */}
            <div className="relative">
                {activeTab === 'daily' && <Receipt />}
                {activeTab !== 'daily' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-center py-20 text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-white/[0.02]"
                    >
                        <p>Conteúdo da aba {activeTab === 'upcoming' ? 'Próximas' : 'Recentes'} aqui...</p>
                    </motion.div>
                )}
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen pb-24 dark:bg-dark bg-slate-50 transition-colors duration-300">
      
      {/* Top Navigation */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 dark:bg-dark/95 bg-white/95 backdrop-blur-md z-20 border-b dark:border-white/5 border-slate-200 shadow-sm transition-colors duration-300">
         <button onClick={onBack} className="w-8 h-8 rounded-full dark:bg-white/5 bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft size={18} />
         </button>
         
         {currentView === 'home' ? (
             <div className="flex items-center gap-4">
                 <button className="text-slate-400 hover:text-primary transition-colors"><ChevronLeft size={16} /></button>
                 <div className="text-center">
                     <h2 className="text-gold font-bold text-lg leading-none">Novembro De 2025</h2>
                     <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Visão Geral</span>
                 </div>
                 <button className="text-slate-400 hover:text-primary transition-colors"><ChevronRight size={16} /></button>
             </div>
         ) : (
             <div className="text-center">
                <h2 className="dark:text-white text-slate-900 font-bold text-lg leading-none capitalize">
                    {currentView === 'misc' ? 'Gastos Avulsos' : currentView}
                </h2>
             </div>
         )}
         
         <div className="flex items-center gap-3">
             <button 
               onClick={toggleTheme} 
               className="w-8 h-8 rounded-full dark:bg-white/5 bg-slate-100 flex items-center justify-center text-slate-400 hover:text-gold transition-colors"
               title="Alternar Tema"
             >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary cursor-pointer">
                SD
             </div>
         </div>
      </header>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
            {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 dark:bg-dark/90 bg-white/90 backdrop-blur-xl border-t dark:border-white/10 border-slate-200 pb-safe pt-2 px-6 pb-4 z-50 transition-colors duration-300">
          <div className="flex justify-between items-center max-w-lg mx-auto">
              <NavButton 
                  icon={<Home size={24} />} 
                  label="Início" 
                  isActive={currentView === 'home'} 
                  onClick={() => setCurrentView('home')}
              />
              <NavButton 
                  icon={<ArrowUpCircle size={24} />} 
                  label="Entradas" 
                  isActive={currentView === 'incomes'}
                  onClick={() => setCurrentView('incomes')}
              />
              <NavButton 
                  icon={<ArrowDownCircle size={24} />} 
                  label="Saídas" 
                  isActive={currentView === 'expenses'}
                  onClick={() => setCurrentView('expenses')}
              />
              <NavButton 
                  icon={<TrendingUp size={24} />} 
                  label="Investimentos" 
                  isActive={currentView === 'investments'}
                  onClick={() => setCurrentView('investments')}
              />
              <NavButton 
                  icon={<Coffee size={24} />} 
                  label="Avulsos" 
                  isActive={currentView === 'misc'} 
                  color="text-gold" 
                  onClick={() => setCurrentView('misc')}
              />
          </div>
      </nav>

    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, isActive?: boolean, color?: string, onClick: () => void }> = ({ icon, label, isActive, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'}`}
    >
        <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary/20 scale-110' : ''} ${color && !isActive ? color : ''}`}>
           {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

export default Dashboard;
