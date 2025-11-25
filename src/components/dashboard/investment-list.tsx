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
import { Trash2, GripVertical, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditInvestmentDialog } from "./edit-investment-dialog";

interface InvestmentListProps {
    investments: MonthWithDetails["investments"];
}

export function InvestmentList({ investments: initialInvestments }: InvestmentListProps) {
    const [investments, setInvestments] = useState(initialInvestments);

    useEffect(() => {
        setInvestments(initialInvestments);
    }, [initialInvestments]);

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "investment");
            toast.success("Investimento removido");
        } catch (error) {
            toast.error("Erro ao remover investimento");
        }
    }

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(investments);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setInvestments(items);

        const updates = items.map((item, index) => ({
            id: item.id,
            order: index,
        }));

        try {
            await updateItemOrder(updates, "investment");
        } catch (error) {
            toast.error("Erro ao reordenar");
        }
    }

    if (investments.length === 0) {
        return (
            <EmptyState
                icon={PiggyBank}
                title="Nenhum investimento"
                description="Comece a investir no seu futuro hoje mesmo."
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
                <Droppable droppableId="investments">
                    {(provided) => (
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                            {investments.map((investment, index) => (
                                <Draggable key={investment.id} draggableId={investment.id} index={index}>
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
                                            <TableCell className="font-medium">{investment.description}</TableCell>
                                            <TableCell>{investment.dayOfMonth || "-"}</TableCell>
                                            <TableCell className="text-right text-blue-600 font-semibold">
                                                {formatCurrency(Number(investment.amount))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <EditInvestmentDialog investment={investment} />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDelete(investment.id)}
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
