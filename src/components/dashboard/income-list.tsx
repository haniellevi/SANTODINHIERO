"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { Trash2, GripVertical, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditIncomeDialog } from "./edit-income-dialog";
import { cn } from "@/lib/utils";

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

        const items = Array.from(incomes) as typeof incomes;
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
            <div className="hidden md:block overflow-x-auto">
                <Table className="border-separate border-spacing-y-3">
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
                    <Droppable droppableId="incomes-desktop">
                        {(provided) => (
                            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                {incomes.map((income, index) => (
                                    <Draggable key={income.id} draggableId={income.id} index={index}>
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
                                                <TableCell className="font-medium border-y border-border/50 whitespace-normal min-w-[150px]">{income.description}</TableCell>
                                                <TableCell className="border-y border-border/50">{income.dayOfMonth || "-"}</TableCell>
                                                <TableCell className="text-right text-emerald-500 font-bold text-lg border-y border-border/50">
                                                    {formatCurrency(Number(income.amount))}
                                                </TableCell>
                                                <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <EditIncomeDialog income={income} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            </div>

            <div className="md:hidden space-y-4">
                <Droppable droppableId="incomes-mobile">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {incomes.map((income, index) => (
                                <Draggable key={`mobile-${income.id}`} draggableId={`mobile-${income.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn("bg-card border-none shadow-sm", snapshot.isDragging && "opacity-50")}
                                            style={provided.draggableProps.style}
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded text-muted-foreground/50">
                                                            <GripVertical className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium line-clamp-1">{income.description}</p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>Dia {income.dayOfMonth || "-"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <EditIncomeDialog income={income} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(income.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                    <span className="text-xs text-muted-foreground">Valor</span>
                                                    <p className="font-bold text-lg text-emerald-500">{formatCurrency(Number(income.amount))}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}
