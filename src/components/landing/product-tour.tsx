"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Heart,
    PiggyBank,
    Coffee,
    Check,
    Sparkles
} from 'lucide-react';

interface TourStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface MockTransaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'tithe' | 'investment' | 'misc';
    date: string;
}

const steps: TourStep[] = [
    {
        id: 'income',
        title: 'Entradas',
        description: 'Comece registrando seu salário e rendas extras. A base de uma boa gestão é saber exatamente quanto entra.',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'text-emerald-400'
    },
    {
        id: 'tithe',
        title: 'Primeiro Deus',
        description: 'Antes das contas, honramos Aquele que nos dá capacidade para prosperar. O dízimo (10%) é calculado e separado automaticamente.',
        icon: <Heart className="w-6 h-6" />,
        color: 'text-yellow-400'
    },
    {
        id: 'expense',
        title: 'Saídas Fixas',
        description: 'Liste suas contas essenciais como aluguel e internet. Tenha clareza dos seus compromissos mensais.',
        icon: <TrendingDown className="w-6 h-6" />,
        color: 'text-red-400'
    },
    {
        id: 'invest',
        title: 'Futuro Rico',
        description: 'Você é seu maior ativo. Tratamos seu investimento como uma conta obrigatória no fluxo de caixa, garantindo a construção do seu império.',
        icon: <PiggyBank className="w-6 h-6" />,
        color: 'text-blue-400'
    },
    {
        id: 'misc',
        title: 'Sem Neura',
        description: 'Saiu do orçamento? Respire! Um lanchinho não vai falir seu império. Priorize sua saúde mental: registre sem culpa e continue sua jornada.',
        icon: <Coffee className="w-6 h-6" />,
        color: 'text-orange-400'
    }
];

// Mock Data for the phone screen based on current step
const getScreenData = (stepId: string): MockTransaction[] => {
    const salary: MockTransaction = { id: '1', description: 'Salário Mensal', amount: 5000, type: 'income', date: '05/10' };
    const tithe: MockTransaction = { id: 't1', description: 'Dízimo (10%)', amount: 500, type: 'tithe', date: '05/10' };
    const rent: MockTransaction = { id: 'e1', description: 'Aluguel Apto', amount: 1800, type: 'expense', date: '10/10' };
    const internet: MockTransaction = { id: 'e2', description: 'Internet Fibra', amount: 120, type: 'expense', date: '15/10' };
    const invest: MockTransaction = { id: 'i1', description: 'Fundo Imobiliário', amount: 1000, type: 'investment', date: '05/10' };

    // Fun/Humorous expenses for the "Sem Neura" step
    const ifood: MockTransaction = { id: 'm1', description: 'Ifood da Preguiça', amount: 65, type: 'misc', date: 'Ontem' };
    const cafe: MockTransaction = { id: 'm2', description: 'Café da Sanidade', amount: 18, type: 'misc', date: 'Hoje' };

    switch (stepId) {
        case 'income':
            return [salary];
        case 'tithe':
            return [salary, tithe];
        case 'expense':
            return [salary, tithe, rent, internet];
        case 'invest':
            // Show investment clearly
            return [salary, tithe, invest, rent];
        case 'misc':
            // Show a mix with funny items
            return [salary, tithe, invest, ifood, cafe];
        default:
            return [salary];
    }
};

const ProductTour: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-play timer
    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    // Auto-scroll logic for mobile buttons
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.children[activeStep] as HTMLElement;
            if (activeBtn) {
                // Scroll to center the active button
                const container = scrollContainerRef.current;
                // Calculate center position
                const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeStep]);

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setIsAutoPlaying(false);
    };

    const currentTransactions = getScreenData(steps[activeStep].id);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">

            {/* === MOBILE/TABLET VIEW CONTROLS (< lg) === */}
            {/* Keeps everything "above the fold" on mobile by stacking horizontally */}
            <div className="lg:hidden w-full flex flex-col gap-4 mb-2">
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        Como Funciona
                    </h2>
                </div>

                {/* Horizontal Navigation Pills with Gradient Hints */}
                <div className="relative group">
                    {/* Left Fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#0b1121] to-transparent z-10 pointer-events-none lg:hidden"></div>

                    {/* Scrollable Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-2 overflow-x-auto pb-2 snap-x px-4 no-scrollbar scroll-smooth w-full"
                    >
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => handleStepClick(index)}
                                className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium snap-center
                    ${activeStep === index
                                        ? 'bg-slate-800 border-primary text-white shadow-lg shadow-primary/10'
                                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800'}
                  `}
                            >
                                <div className={`${activeStep === index ? step.color : 'text-slate-500'}`}>
                                    {React.cloneElement(step.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
                                </div>
                                <span className="whitespace-nowrap">{step.title}</span>
                            </button>
                        ))}
                        {/* Spacer at end to allow last item to be centered easily */}
                        <div className="w-2 flex-shrink-0"></div>
                    </div>

                    {/* Right Fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0b1121] to-transparent z-10 pointer-events-none lg:hidden"></div>
                </div>

                {/* Compact Description for Mobile */}
                <div className="text-center h-[70px] relative px-4 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <p className="text-slate-300 text-sm leading-snug max-w-lg">
                                <span className={`font-bold mr-1 ${steps[activeStep].color.replace('text-', 'text-')}`}>
                                    {steps[activeStep].title}:
                                </span>
                                {steps[activeStep].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* === DESKTOP VIEW CONTROLS (lg+) === */}
            <div className="hidden lg:block w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Simples, Fácil, Funciona
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Veja como o Santo Dinheiro transforma sua gestão financeira em um processo de 5 passos simples, focados na sua paz mental.
                    </p>
                </div>

                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            className={`p-4 rounded-xl cursor-pointer transition-colors duration-300 border border-transparent ${index === activeStep
                                    ? 'bg-white/10 border-white/10 shadow-lg'
                                    : 'hover:bg-white/5'
                                }`}
                            onClick={() => handleStepClick(index)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg bg-slate-800 ${index === activeStep ? step.color : 'text-slate-500'}`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-lg ${index === activeStep ? 'text-white' : 'text-slate-400'}`}>
                                        {step.title}
                                    </h3>
                                    <AnimatePresence>
                                        {index === activeStep && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="text-slate-300 mt-2 text-sm"
                                            >
                                                {step.description}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* === SHARED PHONE UI === */}
            <div className="w-full lg:w-1/2 flex justify-center">
                {/* Phone Mockup */}
                <div className="relative w-[300px] h-[600px] sm:w-[320px] sm:h-[640px] scale-95 lg:scale-100 bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/20">

                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>

                    {/* Screen Content */}
                    <div className="h-full w-full bg-[#0f172a] overflow-y-auto pt-12 pb-8 px-4 relative scrollbar-hide">

                        {/* Header Mock */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="text-xs text-slate-400">Saldo Disponível</div>
                                <div className="text-2xl font-bold text-white">
                                    {/* Dynamic calculation just for show */}
                                    R$ {currentTransactions.reduce((acc, curr) => {
                                        if (curr.type === 'income') return acc + curr.amount;
                                        return acc - curr.amount;
                                    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            <AnimatePresence mode='popLayout'>
                                {currentTransactions.map((tx) => (
                                    <motion.div
                                        key={tx.id}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={`
                      relative p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm
                      ${tx.type === 'tithe'
                                                ? 'bg-gradient-to-r from-yellow-900/40 to-yellow-800/20 border border-yellow-500/30'
                                                : 'bg-slate-800/50 border border-slate-700/50'}
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                        ${tx.type === 'expense' ? 'bg-red-500/20 text-red-400' : ''}
                        ${tx.type === 'tithe' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                        ${tx.type === 'investment' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${tx.type === 'misc' ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                                                {tx.type === 'income' && <TrendingUp size={18} />}
                                                {tx.type === 'expense' && <TrendingDown size={18} />}
                                                {tx.type === 'tithe' && <Heart size={18} />}
                                                {tx.type === 'investment' && <PiggyBank size={18} />}
                                                {tx.type === 'misc' && <Coffee size={18} />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`font-medium text-sm truncate ${tx.type === 'tithe' ? 'text-yellow-100' : 'text-white'}`}>
                                                    {tx.description}
                                                </div>
                                                <div className="text-xs text-slate-400">{tx.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`font-semibold text-sm
                        ${tx.type === 'income' ? 'text-emerald-400' : ''}
                        ${tx.type === 'tithe' ? 'text-yellow-400' : 'text-white'}
                        ${(tx.type === 'expense' || tx.type === 'investment' || tx.type === 'misc') ? 'text-white' : ''}
                      `}>
                                                {tx.type === 'income' ? '+' : '-'} R$ {tx.amount}
                                            </div>
                                            {tx.type === 'tithe' && (
                                                <div className="flex items-center justify-end gap-1 text-[10px] text-yellow-500 mt-1">
                                                    <Check size={10} /> Pago
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Empty State placeholder just to fill space if few items */}
                            {currentTransactions.length < 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    className="border-2 border-dashed border-slate-700 rounded-2xl h-20 flex items-center justify-center text-slate-600 text-sm"
                                >
                                    <Sparkles size={16} className="mr-2" />
                                    Futuro próspero...
                                </motion.div>
                            )}
                        </div>

                        {/* Fab Button Mock */}
                        <motion.div
                            layout
                            className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-purple-900/50 flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                        >
                            <div className="text-2xl font-light">+</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTour;
