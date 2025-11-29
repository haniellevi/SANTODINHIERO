"use client";

import { cn, formatCurrency } from "@/lib/utils";

interface ReceiptSummaryProps {
    userName: string;
    currentDay: number;
    // Incomes
    incomesUpToToday: number;
    incomesReceived: number;
    incomesRemaining: number;
    // Expenses
    expensesUpToToday: number;
    expensesPaid: number;
    expensesRemaining: number;
    // Investments
    investmentsUpToToday: number;
    investmentsPaid: number;
    investmentsRemaining: number;
    // Misc
    miscUpToToday: number;
    miscPaid: number;
    miscRemaining: number;
    // Balance
    balance: number;
    nextUpcomingIncome?: { dayOfMonth?: number; amount: number };
}

export function ReceiptSummary({
    userName,
    currentDay,
    incomesUpToToday,
    incomesReceived,
    incomesRemaining,
    expensesUpToToday,
    expensesPaid,
    expensesRemaining,
    investmentsUpToToday,
    investmentsPaid,
    investmentsRemaining,
    miscUpToToday,
    miscPaid,
    miscRemaining,
    balance,
    nextUpcomingIncome
}: ReceiptSummaryProps) {
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const totalOutflows = expensesUpToToday + investmentsUpToToday + miscUpToToday;

    return (
        <div className="w-full max-w-2xl mx-auto my-8 font-mono text-xs bg-[#fffdf5] text-gray-800 p-8 shadow-xl relative rotate-1 transform transition-transform hover:rotate-0 duration-300 rounded-sm">
            {/* Paper texture effect overlay */}
            <div className="absolute inset-0 bg-[#fffdf5] opacity-50 pointer-events-none mix-blend-multiply"></div>

            {/* Header */}
            <div className="relative z-10 text-center border-b-2 border-dashed border-gray-300 pb-4 mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-1">Santo Dinheiro</h2>
                <p className="text-xs text-gray-500">Extrato Diário de Finanças</p>
                <div className="flex justify-between mt-4 text-xs text-gray-500 font-bold">
                    <span>DATA: {date}</span>
                    <span>HORA: {time}</span>
                </div>
            </div>

            {/* Body */}
            <div className="relative z-10 space-y-6 mb-6">
                <p className="text-center mb-6 font-bold text-base leading-relaxed">
                    Hoje é dia {currentDay}, e suas finanças até hoje estão assim:
                </p>

                {/* ENTRADAS */}
                <div className="space-y-2 border-b border-dashed border-gray-300 pb-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600 font-bold">ENTRADAS</span>
                        <span className="font-bold text-emerald-600 text-base">{formatCurrency(incomesUpToToday)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed pl-2">
                        {incomesRemaining > 0 ? (
                            <>
                                De <span className="font-bold">{formatCurrency(incomesUpToToday)}</span> que deveria ter recebido até hoje, já entrou <span className="font-bold text-emerald-700">{formatCurrency(incomesReceived)}</span>.
                                {nextUpcomingIncome ? (
                                    <> Dia {nextUpcomingIncome.dayOfMonth} vai entrar mais <span className="font-bold">{formatCurrency(nextUpcomingIncome.amount)}</span>.</>
                                ) : (
                                    <> Acho que vai entrar mais dinheiro só no próximo mês.</>
                                )}
                            </>
                        ) : (
                            <>
                                Nas minhas contas já entrou <span className="font-bold text-emerald-700">{formatCurrency(incomesReceived)}</span>. Não temos mais previsão de entrada até o fim desse mês.
                            </>
                        )}
                    </p>
                </div>

                {/* SAÍDAS */}
                <div className="space-y-2 border-b border-dashed border-gray-300 pb-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600 font-bold">SAÍDAS</span>
                        <span className="font-bold text-rose-600 text-base">{formatCurrency(expensesUpToToday)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed pl-2">
                        {expensesRemaining <= 0 ? (
                            <>Já pagamos tudo nesse mês, parabéns!</>
                        ) : (
                            <>Já pagamos <span className="font-bold text-rose-700">{formatCurrency(expensesPaid)}</span> dos <span className="font-bold">{formatCurrency(expensesUpToToday)}</span> que temos que pagar, tenho certeza que vamos conseguir pagar esses <span className="font-bold">{formatCurrency(expensesRemaining)}</span> que ainda faltam.</>
                        )}
                    </p>
                </div>

                {/* INVESTIMENTOS */}
                <div className="space-y-2 border-b border-dashed border-gray-300 pb-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600 font-bold">INVESTIMENTOS</span>
                        <span className="font-bold text-blue-600 text-base">{formatCurrency(investmentsUpToToday)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed pl-2">
                        {investmentsRemaining <= 0 ? (
                            <>Já fizemos todos os investimentos do mês, parabéns!</>
                        ) : (
                            <>Já investimos <span className="font-bold text-blue-700">{formatCurrency(investmentsPaid)}</span>, ainda faltam <span className="font-bold">{formatCurrency(investmentsRemaining)}</span> de investimento esse mês!</>
                        )}
                    </p>
                </div>

                {/* GASTOS AVULSOS */}
                <div className="space-y-2 border-b border-dashed border-gray-300 pb-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600 font-bold">GASTOS AVULSOS</span>
                        <span className="font-bold text-yellow-600 text-base">{formatCurrency(miscUpToToday)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed pl-2">
                        {miscPaid > 0 ? (
                            <>Até hoje você gastou <span className="font-bold text-yellow-700">{formatCurrency(miscPaid)}</span> que não estava previsto nas saídas do mês.</>
                        ) : (
                            <>Parabéns, está muito disciplinado esse mês, ainda não teve gastos avulsos.</>
                        )}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="relative z-10 border-b-2 border-dashed border-gray-300 mb-6"></div>

            {/* Footer / Total */}
            <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-between items-end text-xl font-bold bg-gray-100/50 p-3 rounded">
                    <span>SALDO PREVISTO:</span>
                    <span className={cn(
                        balance >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>{formatCurrency(balance)}</span>
                </div>

                <div className="text-xs text-gray-500 italic border-t border-gray-200 pt-4 space-y-2">
                    <p className="text-sm">
                        "Então {userName}, até HOJE, ENTROU <span className="font-bold text-gray-700">{formatCurrency(incomesUpToToday)}</span> E SAIU <span className="font-bold text-gray-700">{formatCurrency(totalOutflows)}</span>."
                    </p>
                    <p className="text-sm">
                        Pelas minhas contas, você deve ter: <span className="font-bold text-gray-700">{formatCurrency(balance)}</span>.
                    </p>
                    <p className="mt-3 font-bold text-[10px] uppercase tracking-wider text-gray-400">
                        Obs: Se tudo foi registrado de forma correta.
                    </p>
                </div>
            </div>

            {/* Barcode decoration */}
            <div className="relative z-10 mt-6 opacity-30">
                <div className="h-8 bg-[repeating-linear-gradient(90deg,black,black_1px,transparent_1px,transparent_3px)] w-full"></div>
                <div className="text-center text-[10px] mt-1 font-mono">SD-{currentDay}-{new Date().getMonth() + 1}-{new Date().getFullYear()}</div>
            </div>
        </div>
    );
}
