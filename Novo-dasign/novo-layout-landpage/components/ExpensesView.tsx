import React from 'react';
import ModuleLayout from './ModuleLayout';
import { Calendar, ChevronRight, Crown, MoreVertical, Pencil, Trash2 } from 'lucide-react';

const mockExpenses = [
  // Tithes (Special)
  { id: 't1', description: 'Dízimo - Agencia Texugo', date: '06', value: 'R$ 250,00', type: 'tithe', status: 'pending' },
  { id: 't2', description: 'Dízimo - Salário Mensal', date: '10', value: 'R$ 600,00', type: 'tithe', status: 'pending' },
  // Regular Expenses
  { id: 1, description: 'Conta de Luz', date: '18', value: 'R$ 520,00', type: 'expense', status: 'paid' },
  { id: 2, description: 'Aluguel', date: '28', value: 'R$ 1.000,00', type: 'expense', status: 'paid' },
  { id: 3, description: 'Internet', date: '30', value: 'R$ 80,00', type: 'expense', status: 'paid' },
];

const ExpensesView: React.FC = () => {
  return (
    <ModuleLayout
      title="Saídas"
      subtitle="Gerencie seus gastos mensais"
      totalValue="R$ 2.450,00"
      totalLabel="Total de Saídas:"
      progressValue={65}
      accentColor="danger"
      onAdd={() => alert("Modal de adicionar saída")}
    >
      <div className="w-full text-left text-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b dark:border-white/5 border-slate-200 text-slate-400 font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Descrição</div>
            <div className="col-span-2">Vencimento</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Valor</div>
        </div>

        <div className="divide-y dark:divide-white/5 divide-slate-100">
          {mockExpenses.map((item, index) => {
            const isTithe = item.type === 'tithe';
            
            if (isTithe) {
                // Special Card for Tithe
                return (
                    <div key={item.id} className="p-1">
                        <div className="bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/10 rounded-lg p-4 grid grid-cols-12 gap-4 items-center hover:border-yellow-500/30 transition-all group">
                            <div className="col-span-1 flex justify-center text-gold"><Crown size={16} /></div>
                            <div className="col-span-4 font-bold text-gold flex items-center gap-2">
                                {item.description}
                            </div>
                            <div className="col-span-2 text-gold/80 font-mono text-xs">{item.date}</div>
                            <div className="col-span-3">
                                <div className="flex items-center gap-2 bg-black/20 rounded-full px-2 py-1 w-fit cursor-pointer border border-white/5 hover:border-gold/50 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                        <ChevronRight size={14} className="text-slate-400" />
                                    </div>
                                    <span className="text-[10px] text-slate-400">Arrastar para pagar</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-right font-bold text-gold text-lg">
                                {item.value}
                            </div>
                        </div>
                    </div>
                )
            }

            // Regular Row
            return (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="col-span-1 text-slate-500">{index + 1}</div>
                    <div className="col-span-4 font-medium dark:text-white text-slate-900 flex items-center gap-3">
                        <MoreVertical size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab" />
                        {item.description}
                    </div>
                    <div className="col-span-2 text-slate-500 text-xs">{item.date}</div>
                    <div className="col-span-3">
                         {/* Toggle Mock */}
                         <div className="w-32 bg-slate-800 rounded-full h-8 p-1 flex items-center cursor-pointer relative">
                             <div className="w-full text-center text-[10px] text-slate-400 font-medium">Pago: R$ {item.value.replace('R$ ', '')}</div>
                             <div className="absolute right-1 w-6 h-6 bg-danger rounded-full shadow-lg flex items-center justify-center text-white">
                                 <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                             <div className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-danger rounded-full"></div>
                         </div>
                    </div>
                    <div className="col-span-2 text-right">
                        <div className="flex items-center justify-end gap-3">
                            <span className="font-bold text-danger">{item.value}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-white/10 rounded text-slate-400"><Pencil size={14}/></button>
                                <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-danger"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default ExpensesView;
