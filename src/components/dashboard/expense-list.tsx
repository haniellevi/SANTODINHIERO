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

        const items = Array.from(expenses);
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Virtual Rows in a separate tbody */}
                {(titheAmount > 0 || totalInvestment > 0 || totalMisc > 0) && (
                    <TableBody>
                        {/* Dízimo (Virtual Row) */}
                        {titheAmount > 0 && (
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableCell>
                                    <Lock className="h-4 w-4 text-muted-foreground opacity-50 mx-auto" />
                                </TableCell>
                                <TableCell className="font-medium flex items-center gap-2">
                                    Dízimo (10%)
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell className="text-xs text-muted-foreground">Automático</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(titheAmount)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-muted-foreground opacity-50">
                                        <Lock className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Total Investimentos (Virtual Row) */}
                        {totalInvestment > 0 && (
                            <TableRow className="bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                                <TableCell>
                                    <Lock className="h-4 w-4 text-muted-foreground opacity-50 mx-auto" />
                                </TableCell>
                                <TableCell className="font-medium text-blue-700 dark:text-blue-400">Total Investimentos</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell className="text-xs text-muted-foreground">Agregado</TableCell>
                                <TableCell className="text-right font-semibold text-blue-700 dark:text-blue-400">{formatCurrency(totalInvestment)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-muted-foreground opacity-50">
                                        <Lock className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Total Gastos Avulsos (Virtual Row) */}
                        {totalMisc > 0 && (
                            <TableRow className="bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-50/50 dark:hover:bg-orange-950/20">
                                <TableCell>
                                    <Lock className="h-4 w-4 text-muted-foreground opacity-50 mx-auto" />
                                </TableCell>
                                <TableCell className="font-medium text-orange-700 dark:text-orange-400">Total Gastos Avulsos</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell className="text-xs text-muted-foreground">Agregado</TableCell>
                                <TableCell className="text-right font-semibold text-orange-700 dark:text-orange-400">{formatCurrency(totalMisc)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-muted-foreground opacity-50">
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
                                                <TableCell className="font-medium">{expense.description}</TableCell>
                                                <TableCell>{expense.dayOfMonth || "-"}</TableCell>
                                                <TableCell className="w-[150px]">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatCurrency(paid)} pagos
                                                        </span>
                                                        <Progress value={percentage} className="h-2" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(total)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <EditExpenseDialog expense={expense} />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
        </DragDropContext>
    );
}
