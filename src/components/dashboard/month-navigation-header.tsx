"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface MonthNavigationHeaderProps {
    currentDate: Date;
    availableMonths: { month: number; year: number }[];
    userId: string;
}

import { MonthsManagementDialog } from "./months-management-dialog";

export function MonthNavigationHeader({
    currentDate,
    availableMonths,
    userId,
}: MonthNavigationHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Check if previous/next month exists
    const hasPrevMonth = availableMonths.some(m => {
        const mDate = new Date(m.year, m.month - 1);
        const cDate = new Date(currentYear, currentMonth - 1);
        return mDate < cDate;
    });

    const hasNextMonth = availableMonths.some(m => {
        const mDate = new Date(m.year, m.month - 1);
        const cDate = new Date(currentYear, currentMonth - 1);
        return mDate > cDate;
    });

    const handleNavigation = (direction: "prev" | "next") => {
        // Find the next available month in the direction
        const currentIdx = availableMonths.findIndex(
            m => m.month === currentMonth && m.year === currentYear
        );

        if (currentIdx === -1) return;

        const targetIdx = direction === "prev" ? currentIdx - 1 : currentIdx + 1;
        const targetMonth = availableMonths[targetIdx];

        if (!targetMonth) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("month", targetMonth.month.toString());
        params.set("year", targetMonth.year.toString());

        router.push(`?${params.toString()}`);
    };

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(currentDate).replace(" de ", " - ");

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigation("prev")}
                    disabled={!hasPrevMonth}
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
                <h2 className="text-xl font-bold capitalize tracking-tight text-primary">
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
                disabled={!hasNextMonth}
                className="size-10 rounded-full hover:bg-accent text-primary disabled:opacity-30"
            >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Próximo mês</span>
            </Button>
        </div>
    );
}
