import React from 'react';
import { motion } from 'framer-motion';

const Receipt: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-[#FDFBF7] text-slate-800 p-6 md:p-8 rounded-sm shadow-2xl max-w-md mx-auto font-mono text-sm relative overflow-hidden"
    >
      {/* Paper texture effect */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-multiply"></div>

      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-dashed border-slate-300">
        <h2 className="text-2xl font-bold tracking-widest text-slate-900 mb-1 uppercase">Santo Dinheiro</h2>
        <p className="text-xs uppercase tracking-wider text-slate-500">Extrato Diário de Finanças</p>
        
        <div className="flex justify-between mt-6 text-[10px] uppercase text-slate-500">
          <span>Data: 28/11/2025</span>
          <span>Hora: 21:19</span>
        </div>
      </div>

      {/* Message */}
      <div className="text-center mb-8">
        <p className="font-bold text-slate-700">Hoje é dia 28, e suas finanças até hoje estão assim:</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        
        {/* Entradas */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="font-bold text-xs uppercase text-slate-500">Entradas</span>
            <span className="font-bold text-emerald-600 text-base">R$ 8.500,00</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Nas minhas contas já entrou <span className="font-bold text-emerald-700">R$ 8.500,00</span>. Não temos mais previsão de entrada até o fim desse mês.
          </p>
          <div className="border-b border-dashed border-slate-200 w-full my-2"></div>
        </div>

        {/* Saídas */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="font-bold text-xs uppercase text-slate-500">Saídas</span>
            <span className="font-bold text-danger text-base">R$ 1.600,00</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Já pagamos <span className="font-bold text-danger">R$ 1.520,00</span> dos <span className="font-bold text-slate-700">R$ 1.600,00</span> que temos que pagar, tenho certeza que vamos conseguir pagar esses <span className="font-bold text-slate-700">R$ 80,00</span> que ainda faltam.
          </p>
          <div className="border-b border-dashed border-slate-200 w-full my-2"></div>
        </div>

        {/* Investimentos */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="font-bold text-xs uppercase text-slate-500">Investimentos</span>
            <span className="font-bold text-blue-600 text-base">R$ 200,00</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Já fizemos todos os investimentos do mês, parabéns!
          </p>
          <div className="border-b border-dashed border-slate-200 w-full my-2"></div>
        </div>

        {/* Gastos Avulsos */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="font-bold text-xs uppercase text-slate-500">Gastos Avulsos</span>
            <span className="font-bold text-yellow-600 text-base">R$ 80,00</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Até hoje você gastou <span className="font-bold text-yellow-700">R$ 80,00</span> que não estava previsto nas saídas do mês.
          </p>
          <div className="border-b border-dashed border-slate-200 w-full my-2"></div>
        </div>

      </div>

      {/* Summary Footer */}
      <div className="mt-8 pt-4 bg-slate-100/50 -mx-6 px-6 py-6 border-t border-dashed border-slate-300">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-base uppercase tracking-wider text-slate-800">Saldo Previsto:</span>
          <span className="font-bold text-xl text-emerald-600">R$ 6.620,00</span>
        </div>
        
        <div className="text-center space-y-2">
            <p className="text-[10px] italic text-slate-500">
                "Então Raniel, até HOJE, ENTROU <span className="font-bold text-slate-700">R$ 8.500,00</span> E SAIU <span className="font-bold text-slate-700">R$ 1.880,00</span>."
            </p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">
                Pelas minhas contas, você deve ter: <span className="text-emerald-700 text-xs">R$ 6.620,00</span>.
            </p>
            <p className="text-[8px] uppercase text-slate-400 pt-2">
                Obs: Se tudo foi registrado de forma correta.
            </p>
        </div>
      </div>

      {/* Barcode Mock */}
      <div className="mt-6 flex justify-between items-end opacity-40">
        {[...Array(40)].map((_, i) => (
            <div key={i} className="bg-slate-900" style={{ 
                width: Math.random() > 0.5 ? '2px' : '4px', 
                height: Math.random() > 0.5 ? '30px' : '40px' 
            }}></div>
        ))}
        <div className="text-[8px] font-mono absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#FDFBF7] px-2 text-slate-400">
            SD-28-11-2025
        </div>
      </div>
      
      {/* jagged edge effect css mock at bottom */}
       <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-transparent"
        style={{
            backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #020617 33.333%, #020617 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #020617 33.333%, #020617 66.667%, transparent 66.667%)',
            backgroundSize: '8px 16px',
            backgroundPosition: '0 100%',
            opacity: 0 // hidden for now as it blends with dark bg
        }}
       />

    </motion.div>
  );
};

export default Receipt;