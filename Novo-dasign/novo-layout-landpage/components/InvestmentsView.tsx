import React from 'react';
import ModuleLayout from './ModuleLayout';
import { Calendar, CheckCircle2, MoreVertical, Pencil, Trash2, TrendingUp } from 'lucide-react';

const mockInvestments = [
  { id: 1, description: 'Lote', date: '10', value: 'R$ 50,00' },
  { id: 2, description: 'Carta de Credito', date: '07', value: 'R$ 150,00' },
];

const InvestmentsView: React.FC = () => {
  return (
    <ModuleLayout
      title="Investimentos"
      subtitle="Gerencie seus investimentos mensais"
      totalValue="R$ 200,00"
      totalLabel="Total até hoje:"
      progressValue={100}
      accentColor="blue"
      onAdd={() => alert("Modal de adicionar investimento")}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b dark:border-white/5 border-slate-200 text-slate-400">
            <th className="p-4 font-medium w-16">#</th>
            <th className="p-4 font-medium">Descrição</th>
            <th className="p-4 font-medium">Dia</th>
            <th className="p-4 font-medium text-right">Valor</th>
            <th className="p-4 font-medium text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {mockInvestments.map((item, index) => (
            <tr key={item.id} className="border-b dark:border-white/5 border-slate-100 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
              <td className="p-4 text-slate-500">{index + 1}</td>
              <td className="p-4 font-medium dark:text-white text-slate-900 flex items-center gap-3">
                 <MoreVertical size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab" />
                 {item.description}
              </td>
              <td className="p-4 text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> {item.date}
                </div>
              </td>
              <td className="p-4 text-right">
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-bold">
                  {item.value}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                   <button className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors" title="Confirmar Aporte">
                     <CheckCircle2 size={18} />
                   </button>
                   <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                     <Pencil size={16} />
                   </button>
                   <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-danger transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleLayout>
  );
};

export default InvestmentsView;
