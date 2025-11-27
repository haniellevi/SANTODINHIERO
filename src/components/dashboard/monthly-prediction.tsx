"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ShoppingBag, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/finance-utils";

interface MonthlyPredictionProps {
    currentDay: number;
    // Incomes
    totalIncomesUpToToday: number;
    totalIncomesReceived: number;
    totalIncomesRemaining: number;
    totalIncomesOverall: number;
    // Expenses
    totalExpensesUpToToday: number;
    totalExpensesPaid: number;
    totalExpensesRemaining: number;
    totalExpensesOverall: number;
    // Investments
    totalInvestmentsUpToToday: number;
    totalInvestmentsPaid: number;
    totalInvestmentsRemaining: number;
    totalInvestmentsOverall: number;
    // Misc
    totalMiscUpToToday: number;
    totalMiscPaid: number;
    totalMiscRemaining: number;
    totalMiscOverall: number;
    // Tithe
    titheAmount: number;
    isTithePaid: boolean;
}

export function MonthlyPrediction({
    currentDay,
    totalIncomesUpToToday,
    totalIncomesReceived,
    totalIncomesRemaining,
    totalExpensesUpToToday,
    totalExpensesPaid,
    totalExpensesRemaining,
    totalInvestmentsUpToToday,
    totalInvestmentsPaid,
    totalInvestmentsRemaining,
    totalMiscUpToToday,
    totalMiscPaid,
    totalMiscRemaining,
    titheAmount,
    isTithePaid,
}: MonthlyPredictionProps) {
    // Calculate totals including tithe
    const totalInUpToToday = totalIncomesUpToToday;
    const totalOutUpToToday = totalExpensesUpToToday + totalInvestmentsUpToToday + totalMiscUpToToday + titheAmount;

    // Expected balance should be: what actually came in - what actually went out
    const totalInReceived = totalIncomesReceived;
    const totalOutPaid = totalExpensesPaid + totalInvestmentsPaid + totalMiscPaid + (isTithePaid ? titheAmount : 0);
    const expectedBalance = totalInReceived - totalOutPaid;

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Hoje é dia</p>
                            <p className="text-2xl font-bold text-primary">{currentDay}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Incomes */}
            <Card className="bg-emerald-500/5 border-emerald-500/20">
                <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-semibold text-emerald-600">Entradas</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Total</span>
                            <div className="flex-1 border-b border-dotted border-emerald-600/30"></div>
                            <span className="font-semibold text-emerald-600">{formatCurrency(totalIncomesUpToToday)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Já recebido</span>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/30"></div>
                            <span className="font-medium">{formatCurrency(totalIncomesReceived)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Ainda falta receber</span>
                            <div className="flex-1 border-b border-dotted border-amber-600/30"></div>
                            <span className="font-medium text-amber-600">{formatCurrency(totalIncomesRemaining)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses */}
            <Card className="bg-rose-500/5 border-rose-500/20">
                <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold text-rose-600">Saídas (Despesas + Dízimo)</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Total</span>
                            <div className="flex-1 border-b border-dotted border-rose-600/30"></div>
                            <span className="font-semibold text-rose-600">{formatCurrency(totalExpensesUpToToday + titheAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Já pago</span>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/30"></div>
                            <span className="font-medium">{formatCurrency(totalExpensesPaid + (isTithePaid ? titheAmount : 0))}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Ainda falta pagar</span>
                            <div className="flex-1 border-b border-dotted border-amber-600/30"></div>
                            <span className="font-medium text-amber-600">{formatCurrency(totalExpensesRemaining + (isTithePaid ? 0 : titheAmount))}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Investments */}
            <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <PiggyBank className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-blue-600">Investimentos</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Total</span>
                            <div className="flex-1 border-b border-dotted border-blue-600/30"></div>
                            <span className="font-semibold text-blue-600">{formatCurrency(totalInvestmentsUpToToday)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Já pago</span>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/30"></div>
                            <span className="font-medium">{formatCurrency(totalInvestmentsPaid)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Ainda falta pagar</span>
                            <div className="flex-1 border-b border-dotted border-amber-600/30"></div>
                            <span className="font-medium text-amber-600">{formatCurrency(totalInvestmentsRemaining)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Misc Expenses */}
            <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <ShoppingBag className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-amber-600">Gastos Avulsos</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Total</span>
                            <div className="flex-1 border-b border-dotted border-amber-600/30"></div>
                            <span className="font-semibold text-amber-600">{formatCurrency(totalMiscUpToToday)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Já pago</span>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/30"></div>
                            <span className="font-medium">{formatCurrency(totalMiscPaid)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-muted-foreground">Ainda falta pagar</span>
                            <div className="flex-1 border-b border-dotted border-amber-600/30"></div>
                            <span className="font-medium text-amber-600">{formatCurrency(totalMiscRemaining)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className={`border-2 ${expectedBalance >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className={`h-5 w-5 ${expectedBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <h3 className={`font-bold ${expectedBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Resumo até Hoje</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Entrou:</span>
                            <span className="font-bold text-emerald-600 text-base">{formatCurrency(totalInReceived)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Saiu:</span>
                            <span className="font-bold text-rose-600 text-base">{formatCurrency(totalOutPaid)}</span>
                        </div>
                        <div className="h-px bg-border my-2" />
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Você deve ter:</span>
                            <span className={`font-bold text-xl ${expectedBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(expectedBalance)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground italic mt-2">
                            *Se tudo foi registrado de forma correta
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
