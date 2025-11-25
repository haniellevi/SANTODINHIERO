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
import { createMiscExpense } from "@/actions/finance";
import { toast } from "sonner";

interface AddMiscExpenseDialogProps {
    monthId: string;
}

export function AddMiscExpenseDialog({ monthId }: AddMiscExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createMiscExpense(formData);
            toast.success("Gasto avulso adicionado com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error("Erro ao adicionar gasto avulso");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50">
                    <PlusCircle className="h-4 w-4" />
                    Adicionar Gasto Avulso
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Gasto Avulso</DialogTitle>
                    <DialogDescription>
                        Registre uma despesa variável ou não planejada.
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
                            placeholder="Ex: Lanche, Uber, Presente"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Valor
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
                        <Label htmlFor="dayOfMonth" className="text-right">
                            Dia
                        </Label>
                        <Input
                            id="dayOfMonth"
                            name="dayOfMonth"
                            type="number"
                            min="1"
                            max="31"
                            placeholder="Dia do gasto"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                            {loading ? "Salvando..." : "Salvar Gasto"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
