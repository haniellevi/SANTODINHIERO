"use client";

import { Button } from "@/components/ui/button";
import {
    shouldShowPlanNextMonthAlert,
    shouldShowReviewMonthAlert,
    getNextMonth,
    getMonthName,
    getDaysUntilEndOfMonth
} from "@/lib/month-utils";
import { duplicateMonth } from "@/actions/finance";
import { toast } from "sonner";
import { useState } from "react";

interface MonthPlanningAlertProps {
    currentYear: number;
    currentMonth: number;
    userId: string;
}

export function MonthPlanningAlert({ currentYear, currentMonth, userId }: MonthPlanningAlertProps) {
    const [loading, setLoading] = useState(false);

    const showPlanAlert = shouldShowPlanNextMonthAlert(currentYear, currentMonth);
    const showReviewAlert = shouldShowReviewMonthAlert(currentYear, currentMonth);
    const daysRemaining = getDaysUntilEndOfMonth(currentYear, currentMonth);
    const nextMonth = getNextMonth(currentYear, currentMonth);
    const nextMonthName = getMonthName(nextMonth.month);

    const handleDuplicateMonth = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("sourceMonth", currentMonth.toString());
            formData.append("sourceYear", currentYear.toString());

            await duplicateMonth(formData);
            toast.success(`Mês de ${nextMonthName} criado com sucesso!`);
        } catch (error) {
            toast.error("Erro ao duplicar mês");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Show review alert (3 days or less)
    if (showReviewAlert) {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-accent-green/50 bg-accent-green/20 p-5">
                <div className="flex flex-col gap-1">
                    <p className="text-white text-base font-bold leading-tight">Últimos {daysRemaining} dias do mês!</p>
                    <p className="text-accent-green/80 text-base font-normal leading-normal">
                        Revise suas entradas e saídas antes do mês acabar.
                    </p>
                </div>
            </div>
        );
    }

    // Show plan alert (10 days or less, but more than 3)
    if (showPlanAlert) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-card p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/50 to-emerald-900/50 opacity-50" />
                <div className="relative flex flex-col gap-4 rounded-2xl bg-card/95 p-5 backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                        <p className="text-base font-bold leading-tight text-white">
                            Faltam {daysRemaining} dias para o fim do mês!
                        </p>
                        <p className="text-sm font-medium leading-normal text-muted-foreground">
                            Como deseja iniciar o planejamento de <span className="text-emerald-400">{nextMonthName}</span>?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            className="w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
                            onClick={handleDuplicateMonth}
                            disabled={loading}
                        >
                            {loading ? "Duplicando..." : "Duplicar Mês"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-white/10 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white"
                        >
                            Começar do Zero
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Don't show alert if not within alert window
    return null;
}
