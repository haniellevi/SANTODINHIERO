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
            <div className="flex flex-col gap-4 rounded-xl border border-accent-green/50 bg-accent-green/20 p-5">
                <div className="flex flex-col gap-1">
                    <p className="text-white text-base font-bold leading-tight">Faltam {daysRemaining} dias para o fim do mês!</p>
                    <p className="text-accent-green/80 text-base font-normal leading-normal">
                        Como deseja iniciar o planejamento de {nextMonthName}?
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                    <Button
                        className="w-full bg-accent-green text-black hover:bg-accent-green/90 font-bold"
                        onClick={handleDuplicateMonth}
                        disabled={loading}
                    >
                        {loading ? "Duplicando..." : "Duplicar Mês"}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10 font-bold"
                    >
                        Começar do Zero
                    </Button>
                </div>
            </div>
        );
    }

    // Don't show alert if not within alert window
    return null;
}
