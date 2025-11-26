"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { updateExpense } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";

interface EditExpenseDialogProps {
    expense: MonthWithDetails["expenses"][number];
}

export function EditExpenseDialog({ expense }: EditExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await updateExpense(expense.id, formData);
            toast.success("Despesa atualizada com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error("Erro ao atualizar despesa");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Editar Despesa</DialogTitle>
                    <DialogDescription>
                        Atualize as informações da despesa.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descrição
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue={expense.description}
                                placeholder="Ex: Aluguel"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalAmount" className="text-right">
                                Valor Total
                            </Label>
                            <Input
                                id="totalAmount"
                                name="totalAmount"
                                type="number"
                                step="0.01"
                                defaultValue={String(Number(expense.totalAmount))}
                                placeholder="0,00"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="paidAmount" className="text-right">
                                Valor Pago
                            </Label>
                            <Input
                                id="paidAmount"
                                name="paidAmount"
                                type="number"
                                step="0.01"
                                defaultValue={String(Number(expense.paidAmount))}
                                placeholder="0,00"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dayOfMonth" className="text-right">
                                Vencimento
                            </Label>
                            <Input
                                id="dayOfMonth"
                                name="dayOfMonth"
                                type="number"
                                min="1"
                                max="31"
                                defaultValue={expense.dayOfMonth || ""}
                                placeholder="Dia do vencimento"
                                className="col-span-3"
                            />
                        </div>
                        <DialogFooter className="flex-shrink-0 pt-4 sticky bottom-0 bg-background">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
