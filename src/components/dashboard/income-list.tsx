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
import { Trash2, GripVertical, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditIncomeDialog } from "./edit-income-dialog";

interface IncomeListProps {
    incomes: MonthWithDetails["incomes"];
}

export function IncomeList({ incomes: initialIncomes }: IncomeListProps) {
    const [incomes, setIncomes] = useState(initialIncomes);

    useEffect(() => {
        setIncomes(initialIncomes);
    }, [initialIncomes]);

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "income");
            toast.success("Receita removida");
        } catch (error) {
            toast.error("Erro ao remover receita");
        }
    }

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(incomes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setIncomes(items);

        const updates = items.map((item, index) => ({
            id: item.id,
            order: index,
        }));

        try {
            await updateItemOrder(updates, "income");
        } catch (error) {
            toast.error("Erro ao reordenar");
        }
    }

    if (incomes.length === 0) {
        return (
            <EmptyState
                icon={TrendingUp}
                title="Nenhuma receita"
                description="Adicione suas fontes de renda para começar a organizar."
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
                <Droppable droppableId="incomes">
                    {(provided) => (
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                            {incomes.map((income, index) => (
                                <Draggable key={income.id} draggableId={income.id} index={index}>
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
                                            <TableCell className="font-medium">{income.description}</TableCell>
                                            <TableCell>{income.dayOfMonth || "-"}</TableCell>
                                            <TableCell className="text-right text-green-600 font-semibold">
                                                {formatCurrency(Number(income.amount))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <EditIncomeDialog income={income} />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDelete(income.id)}
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
