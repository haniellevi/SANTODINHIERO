"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/finance-utils";
import { Trash2, GripVertical, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditMiscExpenseDialog } from "./edit-misc-expense-dialog";

interface MiscExpenseListProps {
    miscExpenses: MonthWithDetails["miscExpenses"];
}

export function MiscExpenseList({ miscExpenses: initialMiscExpenses }: MiscExpenseListProps) {
    const [miscExpenses, setMiscExpenses] = useState(initialMiscExpenses);

    useEffect(() => {
        setMiscExpenses(initialMiscExpenses);
    }, [initialMiscExpenses]);

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "misc");
            toast.success("Gasto avulso removido");
        } catch (error) {
            toast.error("Erro ao remover gasto avulso");
        }
    }

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(miscExpenses);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setMiscExpenses(items);

        const updates = items.map((item, index) => ({
            id: item.id,
            order: index,
        }));

        try {
            await updateItemOrder(updates, "misc");
        } catch (error) {
            toast.error("Erro ao reordenar");
        }
    }

    if (miscExpenses.length === 0) {
        return (
            <EmptyState
                icon={ShoppingCart}
                title="Nenhum gasto avulso"
                description="Registre gastos extras que não se encaixam nas categorias fixas."
            />
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Dia</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <Droppable droppableId="miscExpenses">
                    {(provided) => (
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                            {miscExpenses.map((miscExpense, index) => (
                                <Draggable key={miscExpense.id} draggableId={miscExpense.id} index={index}>
                                    {(provided) => (
                                        <TableRow
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="bg-background"
                                        >
                                            <TableCell>
                                                <div {...provided.dragHandleProps} className="cursor-grab">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{miscExpense.description}</TableCell>
                                            <TableCell>{miscExpense.dayOfMonth || "-"}</TableCell>
                                            <TableCell className="text-right text-orange-600 font-semibold">
                                                {formatCurrency(Number(miscExpense.amount))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <EditMiscExpenseDialog miscExpense={miscExpense} />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDelete(miscExpense.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </TableBody>
                    )}
                </Droppable>
            </Table>
        </DragDropContext>
    );
}
