"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Plan {
    id: string;
    name: string;
    priceMonthlyCents: number | null;
    priceYearlyCents: number | null;
    description: string | null;
    features: string | null; // JSON string
    highlight: boolean;
    ctaLabel: string | null;
    ctaUrl: string | null;
}

export default function Pricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/public/plans');
                if (response.ok) {
                    const data = await response.json();
                    setPlans(data);
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (plans.length === 0) {
        return (
            <section id="pricing" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                        Nossos Planos
                    </h2>
                    <p className="text-slate-400">
                        Carregando planos ou nenhum plano disponível no momento.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                        Planos que cabem no seu bolso
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                        Escolha a melhor opção para sua jornada financeira.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                billingCycle === 'monthly'
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                billingCycle === 'yearly'
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Anual <span className="text-[10px] ml-1 text-emerald-300 font-bold">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                        const price = billingCycle === 'monthly'
                            ? (plan.priceMonthlyCents || 0) / 100
                            : (plan.priceYearlyCents || 0) / 100;

                        const featuresList = plan.features ? JSON.parse(plan.features) : [];

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "relative p-8 rounded-3xl border transition-all duration-300 flex flex-col",
                                    plan.highlight
                                        ? "bg-gradient-to-b from-primary/20 to-primary/5 border-primary/50 shadow-2xl shadow-primary/10"
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                )}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        MAIS POPULAR
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm h-10">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm text-slate-400">R$</span>
                                        <span className="text-4xl font-bold text-white">{price.toFixed(2).replace('.', ',')}</span>
                                        <span className="text-slate-400">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {featuresList.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                plan.highlight ? "bg-primary/20 text-primary" : "bg-white/10 text-slate-300"
                                            )}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className={cn(
                                        "w-full py-6 rounded-xl font-bold text-base transition-all duration-300",
                                        plan.highlight
                                            ? "bg-primary hover:bg-primaryDark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
                                            : "bg-white text-slate-900 hover:bg-slate-100"
                                    )}
                                    asChild
                                >
                                    <a href={plan.ctaUrl || "/dashboard"}>
                                        {plan.ctaLabel || "Começar Agora"}
                                    </a>
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
