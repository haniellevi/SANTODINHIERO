"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, ShieldCheck, Zap } from 'lucide-react';
import ProductTour from '@/components/landing/product-tour';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/dashboard');
    };

    return (
        <div className="dark min-h-screen bg-[#0b1121] text-slate-50 font-sans selection:bg-primary/30">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0b1121]/70 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Logo className="w-12 h-12 relative z-10 drop-shadow-lg" variant="icon" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight leading-none text-white group-hover:text-gold transition-colors duration-300">Santo Dinheiro</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Gestão com Fidelidade</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
                        <a href="#guide" className="hover:text-white transition-colors">Como Funciona</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogin}
                            className="hidden md:block text-sm font-medium hover:text-white text-slate-300 transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={handleLogin}
                            className="bg-gradient-to-r from-primary to-primaryDark hover:from-primaryDark hover:to-primary text-white border border-white/10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                        >
                            Começar Agora <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">

                    {/* Background Gradients - Adjusted to match Logo colors */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60 mix-blend-screen" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/4 w-[600px] h-[400px] bg-gold/10 blur-[100px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gold mb-8 shadow-inner shadow-white/5"
                        >
                            <Star size={12} fill="currentColor" />
                            <span className="tracking-wide">NOVO DASHBOARD 2.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
                        >
                            Sua vida financeira,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold drop-shadow-sm">
                                simplesmente divina.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            Esqueça as planilhas complexas. Tenha clareza total sobre seu patrimônio, automatize seus dízimos e acompanhe investimentos com a elegância que sua vida financeira merece.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button
                                onClick={handleLogin}
                                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                            >
                                Criar conta Grátis
                            </button>
                            <button
                                onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <ChevronRight size={16} />
                                </span>
                                Ver demonstração
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Animated Guide Section */}
                <section id="guide" className="py-20 bg-surface relative border-y border-white/5">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                    <ProductTour />
                </section>

                {/* Features Grid */}
                <section id="features" className="py-24 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            Excelência em cada detalhe
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Uma ferramenta forjada para quem valoriza tempo, estética e propósito.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {/* Card 1 */}
                        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/10">
                                    <ShieldCheck className="text-emerald-400 w-6 h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-100">Privacidade Absoluta</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                Segurança de nível bancário. Seus dados são criptografados de ponta a ponta e visíveis apenas para você. O que acontece na sua carteira, fica na sua carteira.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors border border-gold/10">
                                    <Star className="text-gold w-6 h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-100">Honra Simplificada</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                O único app que trata o dízimo com a dignidade que ele merece. Cálculo automático e visualização dourada para facilitar sua fidelidade mensal sem contas manuais.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors border border-primary/10">
                                    <Zap className="text-primary w-6 h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-100">Fluidez Extrema</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                Desenhado para o ritmo da vida moderna. Toques precisos, respostas imediatas e zero espera. Uma interface que se move na velocidade do seu pensamento.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <Pricing />

                {/* Testimonials Section */}
                <Testimonials />

                {/* CTA Footer */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-[3rem] p-12 text-center border border-primary/20 relative overflow-hidden group">
                        {/* Animated Glow in Footer */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>

                        <div className="flex justify-center mb-8">
                            <Logo className="w-20 h-20 animate-float drop-shadow-2xl" variant="icon" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Pronto para organizar sua vida?</h2>
                        <p className="text-lg text-purple-200 mb-8 relative z-10 max-w-xl mx-auto">
                            Junte-se a milhares de pessoas que encontraram a paz financeira unindo propósito e tecnologia.
                        </p>
                        <button
                            onClick={handleLogin}
                            className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors relative z-10 transform hover:scale-105 duration-200"
                        >
                            Começar Gratuitamente
                        </button>
                    </div>
                </section>
            </main>

            <footer className="relative border-t border-white/10 bg-gradient-to-b from-dark to-[#050810] overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Logo className="w-10 h-10" variant="icon" />
                                <div>
                                    <h3 className="font-bold text-xl text-white">Santo Dinheiro</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Gestão com Fidelidade</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                A plataforma que une propósito e tecnologia para transformar sua vida financeira com elegância e simplicidade.
                            </p>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Produto</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Funcionalidades</a></li>
                                <li><a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Planos</a></li>
                                <li><a href="#guide" className="text-slate-400 hover:text-white text-sm transition-colors">Como Funciona</a></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Empresa</h4>
                            <ul className="space-y-3">
                                <li><a href="/#" className="text-slate-400 hover:text-white text-sm transition-colors">Sobre Nós</a></li>
                                <li><a href="mailto:contato@santodinheiro.com" className="text-slate-400 hover:text-white text-sm transition-colors">Contato</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} Santo Dinheiro. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacidade</a>
                            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Termos</a>
                            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
