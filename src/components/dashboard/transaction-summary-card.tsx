"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";

interface TransactionSummaryCardProps {
    currentDay: number;
    totalUpToToday: number;
    totalMarked: number;
    totalOverall: number;
    type: "income" | "expense" | "investment" | "misc";
    currency?: string;
}

const typeConfig = {
    income: {
        label: "Entradas",
        markedLabel: "Recebido",
        color: "emerald",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-l-emerald-500",
        textClass: "text-emerald-600",
        iconBgClass: "bg-emerald-500/20",
        progressBarClass: "bg-emerald-500",
    },
    expense: {
        label: "Saídas",
        markedLabel: "Pago",
        color: "rose",
        bgClass: "bg-rose-500/10",
        borderClass: "border-l-rose-500",
        textClass: "text-rose-600",
        iconBgClass: "bg-rose-500/20",
        progressBarClass: "bg-rose-500",
    },
    investment: {
        label: "Investimentos",
        markedLabel: "Pago",
        color: "blue",
        bgClass: "bg-blue-500/10",
        borderClass: "border-l-blue-500",
        textClass: "text-blue-600",
        iconBgClass: "bg-blue-500/20",
        progressBarClass: "bg-blue-500",
    },
    misc: {
        label: "Gastos Avulsos",
        markedLabel: "Pago",
        color: "amber",
        bgClass: "bg-amber-500/10",
        borderClass: "border-l-amber-500",
        textClass: "text-amber-600",
        iconBgClass: "bg-amber-500/20",
        progressBarClass: "bg-amber-500",
    },
};

export function TransactionSummaryCard({
    currentDay,
    totalUpToToday,
    totalMarked,
    totalOverall,
    type,
    currency = "R$",
}: TransactionSummaryCardProps) {
    const config = typeConfig[type];
    const percentage = totalOverall > 0 ? (totalMarked / totalOverall) * 100 : 0;

    return (
        <Card className={`${config.bgClass} ${config.borderClass} border-l-4 backdrop-blur-sm`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Day Info */}
                    <div className="flex items-center gap-3">
                        <div className={`${config.iconBgClass} p-2 rounded-lg`}>
                            <Calendar className={`h-5 w-5 ${config.textClass}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Hoje é dia</p>
                            <p className={`text-2xl font-bold ${config.textClass}`}>{currentDay}</p>
                        </div>
                    </div>

                    {/* Right: Totals */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-muted-foreground">
                                Total até hoje:
                            </span>
                            <span className="text-lg font-semibold">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalUpToToday)}
                            </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-muted-foreground">
                                {config.markedLabel}:
                            </span>
                            <span className={`text-lg font-bold ${config.textClass}`}>
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalMarked)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${config.progressBarClass} transition-all duration-300`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                {percentage.toFixed(0)}% do total mensal
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
