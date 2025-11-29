"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatMonthYearFromNumbers } from "@/lib/date-utils";
import { MonthsManagementDialog } from "./months-management-dialog";

interface MonthNavigationHeaderProps {
    currentMonth: number;
    currentYear: number;
    availableMonths: { month: number; year: number }[];
    userId: string;
}

export function MonthNavigationHeader({
    currentMonth,
    currentYear,
    availableMonths,
    userId,
}: MonthNavigationHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to compare months numerically (year * 12 + month)
    const getMonthValue = (m: { month: number; year: number }) => m.year * 12 + m.month;
    const currentMonthValue = currentYear * 12 + currentMonth;

    // Check if previous/next month exists
    const prevMonth = availableMonths
        .filter(m => getMonthValue(m) < currentMonthValue)
        .sort((a, b) => getMonthValue(b) - getMonthValue(a))[0]; // Descending

    const nextMonth = availableMonths
        .filter(m => getMonthValue(m) > currentMonthValue)
        .sort((a, b) => getMonthValue(a) - getMonthValue(b))[0]; // Ascending

    const handleNavigation = (direction: "prev" | "next") => {
        const targetMonth = direction === "prev" ? prevMonth : nextMonth;

        if (!targetMonth) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("month", targetMonth.month.toString());
        params.set("year", targetMonth.year.toString());

        router.push(`/dashboard?${params.toString()}`);
    };

    const formattedDate = formatMonthYearFromNumbers(currentMonth, currentYear);

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigation("prev")}
                    disabled={!prevMonth}
                    className="size-10 rounded-full hover:bg-accent text-primary disabled:opacity-30"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Mês anterior</span>
                </Button>

                <MonthsManagementDialog
                    availableMonths={availableMonths}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    userId={userId}
                />
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold tracking-tight text-primary">
                    {formattedDate}
                </h2>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Visão Geral
                </span>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation("next")}
                disabled={!nextMonth}
                className="size-10 rounded-full hover:bg-accent text-primary disabled:opacity-30"
            >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Próximo mês</span>
            </Button>
        </div>
    );
}
