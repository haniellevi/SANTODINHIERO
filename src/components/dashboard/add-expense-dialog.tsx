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
import { PlusCircle } from "lucide-react";
import { createExpense } from "@/actions/finance";
import { toast } from "sonner";

interface AddExpenseDialogProps {
    monthId: string;
}

export function AddExpenseDialog({ monthId }: AddExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createExpense(formData);
            toast.success("Saída adicionada com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error("Erro ao adicionar saída");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Adicionar Saída
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Saída</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova saída ou conta a pagar.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <input type="hidden" name="monthId" value={monthId} />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descrição
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Ex: Aluguel"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Valor Total
                        </Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
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
                            placeholder="0,00 (Opcional)"
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
                            placeholder="Dia do vencimento"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} variant="destructive">
                            {loading ? "Salvando..." : "Salvar Saída"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
