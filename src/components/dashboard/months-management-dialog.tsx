"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatMonthYear, formatMonthYearFromNumbers } from "@/lib/date-utils";
import { toast } from "sonner";
import { deleteMonth } from "@/actions/finance";

interface MonthsManagementDialogProps {
    availableMonths: { month: number; year: number }[];
    currentMonth: number;
    currentYear: number;
    userId: string;
}

export function MonthsManagementDialog({
    availableMonths,
    currentMonth,
    currentYear,
    userId
}: MonthsManagementDialogProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const handleNavigate = (month: number, year: number) => {
        router.push(`/dashboard?month=${month}&year=${year}`);
        setOpen(false);
    };

    // Sort months descending (newest first)
    const sortedMonths = [...availableMonths].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
    });

    const handleDelete = async (month: number, year: number) => {
        // Get real-time current month/year
        const now = new Date();
        const realTimeMonth = now.getMonth() + 1;
        const realTimeYear = now.getFullYear();

        // Prevent deleting the current real-time month
        if (month === realTimeMonth && year === realTimeYear) {
            toast.error("Não é possível excluir o mês atual.");
            return;
        }

        // Prevent deleting past months
        const targetDate = new Date(year, month - 1);
        const currentDate = new Date(now.getFullYear(), now.getMonth());

        if (targetDate < currentDate) {
            toast.error("Não é possível excluir meses passados.");
            return;
        }

        if (!confirm("Tem certeza que deseja excluir este mês? Todos os dados serão perdidos.")) {
            return;
        }

        const id = `${month}-${year}`;
        setDeletingId(id);

        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("month", month.toString());
            formData.append("year", year.toString());

            await deleteMonth(formData);
            toast.success("Mês excluído com sucesso!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir mês.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <CalendarDays className="h-5 w-5" />
                    <span className="sr-only">Gerenciar Meses</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Histórico de Meses</DialogTitle>
                    <DialogDescription>
                        Navegue pelo seu histórico financeiro. Meses passados não podem ser excluídos.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                    {sortedMonths.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            Nenhum mês encontrado.
                        </p>
                    ) : (
                        sortedMonths.map((m) => {
                            const date = new Date(m.year, m.month - 1);
                            const isCurrentView = m.month === currentMonth && m.year === currentYear;
                            const isPast = date < new Date(new Date().getFullYear(), new Date().getMonth());
                            const id = `${m.month}-${m.year}`;

                            return (
                                <div
                                    key={id}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isCurrentView
                                        ? "bg-primary/10 border-primary/50"
                                        : "bg-card border-border hover:bg-accent/50"
                                        }`}
                                >
                                    <button
                                        onClick={() => handleNavigate(m.month, m.year)}
                                        className="flex flex-col items-start flex-1"
                                    >
                                        <span className={`font-medium capitalize ${isCurrentView ? "text-primary" : "text-foreground"}`}>
                                            {formatMonthYearFromNumbers(m.month, m.year)}
                                        </span>
                                        {isCurrentView && (
                                            <span className="text-[10px] uppercase font-bold text-primary/70">
                                                Visualizando agora
                                            </span>
                                        )}
                                    </button>

                                    {!isPast && !isCurrentView && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleDelete(m.month, m.year)}
                                            disabled={deletingId === id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Excluir mês</span>
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
