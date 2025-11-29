import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, ShieldCheck, Zap } from 'lucide-react';
import ProductTour from './components/ProductTour';
import Testimonials from './components/Testimonials';
import Dashboard from './components/Dashboard';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  // Simple state to toggle views for the starter kit
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  if (currentView === 'dashboard') {
      return <Dashboard onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-dark text-slate-50 font-sans selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-dark/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Logo className="w-12 h-12 relative z-10 drop-shadow-lg" />
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
              onClick={() => setCurrentView('dashboard')}
              className="hidden md:block text-sm font-medium hover:text-white text-slate-300 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-gradient-to-r from-primary to-primaryDark hover:from-primaryDark hover:to-primary text-white border border-white/10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2"
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
              <span className="text-gold-gradient drop-shadow-sm">
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
                onClick={() => setCurrentView('dashboard')}
                className="w-full sm:w-auto bg-white text-primaryDark hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                Criar conta Grátis
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
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
        
        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Footer */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-[3rem] p-12 text-center border border-primary/20 relative overflow-hidden group">
             {/* Animated Glow in Footer */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>
             
             <Logo className="w-20 h-20 mx-auto mb-8 animate-float drop-shadow-2xl" />

             <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Pronto para organizar sua vida?</h2>
             <p className="text-lg text-purple-200 mb-8 relative z-10 max-w-xl mx-auto">
               Junte-se a milhares de pessoas que encontraram a paz financeira unindo propósito e tecnologia.
             </p>
             <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-white text-primaryDark px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-xl shadow-primary/20 relative z-10 transform hover:scale-105 duration-200"
              >
               Começar Gratuitamente
             </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm bg-dark">
        <p>&copy; {new Date().getFullYear()} Santo Dinheiro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;