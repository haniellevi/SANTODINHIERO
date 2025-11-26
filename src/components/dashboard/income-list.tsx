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

type SerializedIncome = Omit<MonthWithDetails["incomes"][number], "amount"> & { amount: number };

interface IncomeListProps {
    incomes: SerializedIncome[];
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
                            <TableHead className="w-[40px] text-muted-foreground font-medium pl-4">#</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="text-muted-foreground font-medium">Descrição</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Dia</TableHead>
                            <TableHead className="text-right text-muted-foreground font-medium">Valor</TableHead>
                            <TableHead className="w-[100px] text-muted-foreground font-medium pr-4">Ações</TableHead>
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
                                                className={`bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all border-none rounded-xl shadow-sm group ${snapshot.isDragging ? "opacity-50 shadow-lg ring-2 ring-emerald-500/20" : "hover:shadow-md hover:ring-1 hover:ring-white/5"}`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    display: snapshot.isDragging ? "table" : undefined,
                                                }}
                                            >
                                                <TableCell className="rounded-l-xl border-y border-l border-white/5 text-muted-foreground/50 text-xs pl-4">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="border-y border-white/5">
                                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg transition-colors w-fit mx-auto touch-none">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium border-y border-white/5 whitespace-normal min-w-[150px] text-foreground/90">{income.description}</TableCell>
                                                <TableCell className="border-y border-white/5">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                        <span>{income.dayOfMonth || "-"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-lg border-y border-white/5">
                                                    <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                                                        {formatCurrency(Number(income.amount))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="rounded-r-xl border-y border-r border-white/5 pr-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                                                        <EditIncomeDialog income={income} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg"
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

            <div className="md:hidden space-y-4 pb-20">
                <Droppable droppableId="incomes-mobile">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {incomes.map((income, index) => (
                                <Draggable key={`mobile-${income.id}`} draggableId={`mobile-${income.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn(
                                                "bg-card/80 backdrop-blur-xl border-white/5 shadow-sm overflow-hidden transition-all",
                                                "border-l-[3px] border-l-emerald-500",
                                                snapshot.isDragging ? "opacity-50 scale-95 ring-2 ring-emerald-500/20" : "active:scale-[0.98]"
                                            )}
                                            style={provided.draggableProps.style}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                                            <CardContent className="p-2 relative">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded text-muted-foreground/40 shrink-0">
                                                            <GripVertical className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-baseline justify-between gap-2">
                                                                <p className="font-semibold text-foreground/90 truncate text-xs">{income.description}</p>
                                                                <p className="font-bold text-base text-emerald-500 shrink-0">{formatCurrency(Number(income.amount))}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                                                <Calendar className="h-2.5 w-2.5" />
                                                                <span>Dia {income.dayOfMonth || "-"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-0.5 shrink-0">
                                                        <EditIncomeDialog income={income} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                                            onClick={() => handleDelete(income.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
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
