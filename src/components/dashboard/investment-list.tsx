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

        const items = Array.from(investments) as typeof investments;
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
            <Table className="border-separate border-spacing-y-3">
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead className="text-muted-foreground font-medium">Descrição</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Dia</TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium">Valor</TableHead>
                        <TableHead className="w-[100px] text-muted-foreground font-medium">Ações</TableHead>
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
                                            className="bg-card hover:bg-card/80 transition-colors border-none rounded-lg shadow-sm group"
                                        >
                                            <TableCell className="rounded-l-lg border-y border-l border-border/50">
                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors w-fit mx-auto">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium border-y border-border/50">{investment.description}</TableCell>
                                            <TableCell className="border-y border-border/50">{investment.dayOfMonth || "-"}</TableCell>
                                            <TableCell className="text-right text-blue-500 font-bold text-lg border-y border-border/50">
                                                {formatCurrency(Number(investment.amount))}
                                            </TableCell>
                                            <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <EditInvestmentDialog investment={investment} />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
