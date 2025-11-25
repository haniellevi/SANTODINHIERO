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
import { Trash2, Lock, GripVertical, TrendingDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder } from "@/actions/finance";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditExpenseDialog } from "./edit-expense-dialog";

interface ExpenseListProps {
    expenses: MonthWithDetails["expenses"];
    titheAmount: number;
    totalInvestment: number;
    totalMisc: number;
}

export function ExpenseList({ expenses: initialExpenses, titheAmount, totalInvestment, totalMisc }: ExpenseListProps) {
    const [expenses, setExpenses] = useState(initialExpenses);

    useEffect(() => {
        setExpenses(initialExpenses);
    }, [initialExpenses]);

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "expense");
            toast.success("Despesa removida");
        } catch (error) {
            toast.error("Erro ao remover despesa");
        }
    }

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(expenses) as typeof expenses;
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setExpenses(items);

        const updates = items.map((item, index) => ({
            id: item.id,
            order: index,
        }));

        try {
            await updateItemOrder(updates, "expense");
        } catch (error) {
            toast.error("Erro ao reordenar");
        }
    }

    const hasExpenses = expenses.length > 0 || titheAmount > 0 || totalInvestment > 0 || totalMisc > 0;

    if (!hasExpenses) {
        return (
            <EmptyState
                icon={TrendingDown}
                title="Nenhuma despesa"
                description="Registre seus gastos fixos e variáveis para manter o controle."
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
                            <TableHead className="text-muted-foreground font-medium">Vencimento</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground font-medium">Valor Total</TableHead>
                            <TableHead className="w-[100px] text-muted-foreground font-medium">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Virtual Rows in a separate tbody */}
                    {(titheAmount > 0 || totalInvestment > 0 || totalMisc > 0) && (
                        <TableBody>
                            {/* Dízimo (Virtual Row) */}
                            {titheAmount > 0 && (
                                <TableRow className="bg-card hover:bg-card/80 transition-colors border-none rounded-lg shadow-sm">
                                    <TableCell className="rounded-l-lg border-y border-l border-border/50 text-muted-foreground/50 text-xs">
                                        -
                                    </TableCell>
                                    <TableCell className="border-y border-border/50">
                                        <Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" />
                                    </TableCell>
                                    <TableCell className="font-medium flex items-center gap-2 border-y border-border/50 whitespace-normal">
                                        Dízimo (10%)
                                    </TableCell>
                                    <TableCell className="border-y border-border/50">-</TableCell>
                                    <TableCell className="text-xs text-muted-foreground border-y border-border/50">Automático</TableCell>
                                    <TableCell className="text-right font-bold text-lg border-y border-border/50 text-rose-500">{formatCurrency(titheAmount)}</TableCell>
                                    <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                        <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-muted-foreground opacity-50">
                                            <Lock className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Total Investimentos (Virtual Row) */}
                            {totalInvestment > 0 && (
                                <TableRow className="bg-blue-950/10 hover:bg-blue-950/20 transition-colors border-none rounded-lg shadow-sm">
                                    <TableCell className="rounded-l-lg border-y border-l border-blue-500/20 text-blue-500/50 text-xs">
                                        -
                                    </TableCell>
                                    <TableCell className="border-y border-blue-500/20">
                                        <Lock className="h-4 w-4 text-blue-500/50 mx-auto" />
                                    </TableCell>
                                    <TableCell className="font-medium text-blue-400 border-y border-blue-500/20 whitespace-normal">Total Investimentos</TableCell>
                                    <TableCell className="border-y border-blue-500/20">-</TableCell>
                                    <TableCell className="text-xs text-blue-400/70 border-y border-blue-500/20">Agregado</TableCell>
                                    <TableCell className="text-right font-bold text-lg text-blue-400 border-y border-blue-500/20">{formatCurrency(totalInvestment)}</TableCell>
                                    <TableCell className="rounded-r-lg border-y border-r border-blue-500/20">
                                        <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-blue-400/50">
                                            <Lock className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Total Gastos Avulsos (Virtual Row) */}
                            {totalMisc > 0 && (
                                <TableRow className="bg-orange-950/10 hover:bg-orange-950/20 transition-colors border-none rounded-lg shadow-sm">
                                    <TableCell className="rounded-l-lg border-y border-l border-orange-500/20 text-orange-500/50 text-xs">
                                        -
                                    </TableCell>
                                    <TableCell className="border-y border-orange-500/20">
                                        <Lock className="h-4 w-4 text-orange-500/50 mx-auto" />
                                    </TableCell>
                                    <TableCell className="font-medium text-orange-400 border-y border-orange-500/20 whitespace-normal">Total Gastos Avulsos</TableCell>
                                    <TableCell className="border-y border-orange-500/20">-</TableCell>
                                    <TableCell className="text-xs text-orange-400/70 border-y border-orange-500/20">Agregado</TableCell>
                                    <TableCell className="text-right font-bold text-lg text-orange-400 border-y border-orange-500/20">{formatCurrency(totalMisc)}</TableCell>
                                    <TableCell className="rounded-r-lg border-y border-r border-orange-500/20">
                                        <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-orange-400/50">
                                            <Lock className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}

                    {/* Draggable Rows in a separate tbody */}
                    <Droppable droppableId="expenses">
                        {(provided) => (
                            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                {expenses.map((expense, index) => {
                                    const total = Number(expense.totalAmount);
                                    const paid = Number(expense.paidAmount);
                                    const percentage = total > 0 ? (paid / total) * 100 : 0;

                                    return (
                                        <Draggable key={expense.id} draggableId={expense.id} index={index}>
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
                                                    <TableCell className="font-medium border-y border-border/50 whitespace-normal min-w-[150px]">{expense.description}</TableCell>
                                                    <TableCell className="border-y border-border/50">{expense.dayOfMonth || "-"}</TableCell>
                                                    <TableCell className="w-[180px] border-y border-border/50">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-muted-foreground">Pago: {formatCurrency(paid)}</span>
                                                            </div>
                                                            <Progress value={percentage} className="h-1.5 bg-muted/50" indicatorClassName={percentage >= 100 ? "bg-emerald-500" : "bg-primary"} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-lg border-y border-border/50 text-rose-500">
                                                        {formatCurrency(total)}
                                                    </TableCell>
                                                    <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <EditExpenseDialog expense={expense} />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(expense.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </TableBody>
                        )}
                    </Droppable>
                </Table>
            </div>
        </DragDropContext>
    );
}
