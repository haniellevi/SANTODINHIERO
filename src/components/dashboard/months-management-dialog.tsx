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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarDays, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatMonthYearFromNumbers } from "@/lib/date-utils";
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

    const [deleteConfirmation, setDeleteConfirmation] = React.useState<{ open: boolean; month: number; year: number } | null>(null);

    const handleDeleteClick = (month: number, year: number) => {
        // Get real-time current month/year
        const now = new Date();
        const realTimeMonth = now.getMonth() + 1;
        const realTimeYear = now.getFullYear();

        // Prevent deleting the current real-time month
        if (month === realTimeMonth && year === realTimeYear) {
            toast.error("Não é possível excluir o mês atual (Novembro 2025).");
            return;
        }

        setDeleteConfirmation({ open: true, month, year });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;
        const { month, year } = deleteConfirmation;

        const id = `${month}-${year}`;
        setDeletingId(id);
        setDeleteConfirmation(null);

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
        <>
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
                            Navegue pelo seu histórico financeiro.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                        {sortedMonths.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">
                                Nenhum mês encontrado.
                            </p>
                        ) : (
                            sortedMonths.map((m) => {
                                const isCurrentView = m.month === currentMonth && m.year === currentYear;
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

                                        {!isCurrentView && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleDeleteClick(m.month, m.year)}
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

            <AlertDialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">Excluir Mês?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o mês de <strong>{deleteConfirmation && formatMonthYearFromNumbers(deleteConfirmation.month, deleteConfirmation.year)}</strong>?
                            <br /><br />
                            Isso apagará permanentemente todas as receitas, despesas e investimentos deste mês. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sim, excluir tudo
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
