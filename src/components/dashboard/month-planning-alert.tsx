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
    planningAlertDays: number;
    nextMonthExists: boolean;
}

export function MonthPlanningAlert({ currentYear, currentMonth, userId, planningAlertDays, nextMonthExists }: MonthPlanningAlertProps) {
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

    // Show plan alert if next month doesn't exist AND we are within the alert window
    if (!nextMonthExists && daysRemaining <= planningAlertDays) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-card p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 opacity-50" />
                <div className="relative flex flex-col gap-4 rounded-2xl bg-card/95 p-5 backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                        <p className="text-base font-bold leading-tight text-foreground">
                            Planejar {nextMonthName}
                        </p>
                        <p className="text-sm font-medium leading-normal text-muted-foreground">
                            O mês de {nextMonthName} está chegando. Como deseja iniciar?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            className="w-full bg-primary font-semibold text-white hover:bg-primary/90"
                            onClick={handleDuplicateMonth}
                            disabled={loading}
                        >
                            {loading ? "Duplicando..." : "Duplicar Mês"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-border/50 bg-muted/30 font-semibold text-foreground hover:bg-muted/50 hover:text-foreground"
                        >
                            Começar do Zero
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Show review alert (3 days or less) ONLY if next month already exists (otherwise we show the plan alert above)
    if (showReviewAlert) {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-accent-green/50 bg-accent-green/20 p-5">
                <div className="flex flex-col gap-1">
                    <p className="text-foreground text-base font-bold leading-tight">Últimos {daysRemaining} dias do mês!</p>
                    <p className="text-accent-green/80 text-base font-normal leading-normal">
                        Revise suas entradas e saídas antes do mês acabar.
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
