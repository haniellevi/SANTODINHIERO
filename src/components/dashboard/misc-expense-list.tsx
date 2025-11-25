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

        const items = Array.from(miscExpenses) as typeof miscExpenses;
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
            <div className="overflow-x-auto">
                <Table className="border-separate border-spacing-y-3 min-w-[600px] md:min-w-full">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[40px] text-muted-foreground font-medium">#</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="text-muted-foreground font-medium">Descrição</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Dia</TableHead>
                            <TableHead className="text-right text-muted-foreground font-medium">Valor</TableHead>
                            <TableHead className="w-[100px] text-muted-foreground font-medium">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <Droppable droppableId="miscExpenses">
                        {(provided) => (
                            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                {miscExpenses.map((miscExpense, index) => (
                                    <Draggable key={miscExpense.id} draggableId={miscExpense.id} index={index}>
                                        {(provided, snapshot) => (
                                            <TableRow
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`bg-card hover:bg-card/80 transition-colors border-none rounded-lg shadow-sm group ${snapshot.isDragging ? "opacity-50" : ""}`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    display: snapshot.isDragging ? "table" : undefined,
                                                }}
                                            >
                                                <TableCell className="rounded-l-lg border-y border-l border-border/50 text-muted-foreground/50 text-xs">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="border-y border-border/50">
                                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded transition-colors w-fit mx-auto touch-none">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium border-y border-border/50 whitespace-normal min-w-[150px]">{miscExpense.description}</TableCell>
                                                <TableCell className="border-y border-border/50">{miscExpense.dayOfMonth || "-"}</TableCell>
                                                <TableCell className="text-right text-yellow-500 font-bold text-lg border-y border-border/50">
                                                    {formatCurrency(Number(miscExpense.amount))}
                                                </TableCell>
                                                <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <EditMiscExpenseDialog miscExpense={miscExpense} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            </div>
        </DragDropContext>
    );
}
