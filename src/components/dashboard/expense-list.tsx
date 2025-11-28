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
import { Trash2, GripVertical, TrendingDown, Calendar, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideButton } from "@/components/ui/slide-button";
import { deleteItem, updateItemOrder, toggleExpensePaid, toggleIncomeTithePaid } from "@/actions/finance";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditExpenseDialog } from "./edit-expense-dialog";
import { TransactionSummaryCard } from "./transaction-summary-card";
import { cn } from "@/lib/utils";

type SerializedExpense = Omit<MonthWithDetails["expenses"][number], "totalAmount" | "paidAmount"> & {
    totalAmount: number;
    paidAmount: number;
};

type SerializedInvestment = Omit<MonthWithDetails["investments"][number], "amount"> & {
    amount: number;
};

type SerializedMiscExpense = Omit<MonthWithDetails["miscExpenses"][number], "amount"> & {
    amount: number;
};

type SerializedIncome = Omit<MonthWithDetails["incomes"][number], "amount"> & {
    amount: number;
    isTithePaid?: boolean;
};

interface ExpenseListProps {
    expenses: SerializedExpense[];
    investments: SerializedInvestment[];
    miscExpenses: SerializedMiscExpense[];
    incomes: SerializedIncome[];
    titheAmount: number;
    totalInvestment: number;
    totalInvestmentPaid: number;
    totalMisc: number;
    totalMiscPaid: number;
    isTithePaid: boolean;
    monthId: string;
    isTitheEnabled?: boolean;
}

export function ExpenseList({
    expenses: initialExpenses,
    investments,
    miscExpenses,
    incomes: initialIncomes,
    totalInvestment,
    totalInvestmentPaid,
    totalMisc,
    totalMiscPaid,
    monthId,
    isTitheEnabled = true
}: ExpenseListProps) {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [incomes, setIncomes] = useState(initialIncomes);

    useEffect(() => {
        setExpenses(initialExpenses);
        setIncomes(initialIncomes);
    }, [initialExpenses, initialIncomes]);

    const currentDay = new Date().getDate();

    const investmentsUpToToday = investments
        .filter(i => (i.dayOfMonth || 32) <= currentDay)
        .reduce((sum, i) => sum + i.amount, 0);

    const miscExpensesUpToToday = miscExpenses
        .filter(m => (m.dayOfMonth || 32) <= currentDay)
        .reduce((sum, m) => sum + m.amount, 0);

    const titheItems = isTitheEnabled ? incomes.map(income => ({
        id: `tithe-${income.id}`,
        originalId: income.id,
        description: `Dízimo - ${income.description}`,
        amount: income.amount * 0.1,
        dayOfMonth: income.dayOfMonth,
        isPaid: income.isTithePaid || false,
        displayType: 'tithe' as const
    })) : [];

    const totalTithe = titheItems.reduce((acc, curr) => acc + curr.amount, 0);
    const totalTithePaid = titheItems.filter(t => t.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

    const totalUpToToday = expenses
        .filter(e => (e.dayOfMonth || 32) <= currentDay)
        .reduce((acc, curr) => acc + Number(curr.totalAmount), 0)
        + investmentsUpToToday
        + miscExpensesUpToToday;

    const totalPaid = expenses.reduce((acc, curr) => acc + Number(curr.paidAmount), 0)
        + totalInvestmentPaid
        + totalMiscPaid
        + totalTithePaid;

    const totalOverall = expenses.reduce((acc, curr) => acc + Number(curr.totalAmount), 0) + totalTithe + totalInvestment + totalMisc;

    const displayItems = [
        ...expenses.map(e => ({ ...e, displayType: 'expense' as const })),
        ...titheItems
    ].sort((a, b) => {
        const dayA = a.dayOfMonth || 32;
        const dayB = b.dayOfMonth || 32;
        if (dayA !== dayB) return dayA - dayB;

        if (a.displayType === 'tithe' && b.displayType === 'expense') return -1;
        if (a.displayType === 'expense' && b.displayType === 'tithe') return 1;

        if (a.displayType === 'expense' && b.displayType === 'expense') return (a as any).order - (b as any).order;
        return 0;
    });

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "expense");
            toast.success("Despesa removida");
        } catch (error) {
            toast.error("Erro ao remover despesa");
        }
    }

    async function handleTogglePaid(id: string, isPaid: boolean) {
        const updatedExpenses = expenses.map(e => {
            if (e.id === id) {
                return {
                    ...e,
                    isPaid: isPaid,
                    paidAmount: isPaid ? e.totalAmount : 0
                };
            }
            return e;
        });
        setExpenses(updatedExpenses);

        try {
            await toggleExpensePaid(id, isPaid);
            toast.success(isPaid ? "Despesa marcada como paga" : "Despesa marcada como pendente");
        } catch (error) {
            setExpenses(expenses);
            toast.error("Erro ao atualizar status");
        }
    }

    async function handleToggleTithe(incomeId: string, isPaid: boolean) {
        const updatedIncomes = incomes.map(i => {
            if (i.id === incomeId) {
                return { ...i, isTithePaid: isPaid };
            }
            return i;
        });
        setIncomes(updatedIncomes);

        try {
            await toggleIncomeTithePaid(incomeId, isPaid);
            toast.success(isPaid ? "Dízimo marcado como pago" : "Dízimo marcado como pendente");
        } catch (error) {
            setIncomes(incomes);
            toast.error("Erro ao atualizar status do dízimo");
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

    const hasExpenses = displayItems.length > 0 || totalInvestment > 0 || totalMisc > 0;

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
        <div className="space-y-6">
            <TransactionSummaryCard
                currentDay={currentDay}
                totalUpToToday={totalUpToToday}
                totalMarked={totalPaid}
                totalOverall={totalOverall}
                type="expense"
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="hidden md:block overflow-x-auto">
                    <Table className="border-separate border-spacing-y-3">
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

                        <Droppable droppableId="expenses-desktop">
                            {(provided) => (
                                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                    {displayItems.map((item, visualIndex) => {
                                        if (item.displayType === 'tithe') {
                                            return (
                                                <TableRow
                                                    key={item.id}
                                                    className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 hover:from-yellow-500/20 hover:to-yellow-500/20 transition-all border-none rounded-lg shadow-sm border-l-4 border-l-amber-500"
                                                >
                                                    <TableCell className="rounded-l-lg border-y border-amber-500/20 text-amber-600/70 text-xs">-</TableCell>
                                                    <TableCell className="border-y border-amber-500/20"><Crown className="h-5 w-5 text-amber-500 mx-auto fill-amber-500/20" /></TableCell>
                                                    <TableCell className="font-bold text-amber-600 border-y border-amber-500/20 whitespace-normal text-base">{item.description}</TableCell>
                                                    <TableCell className="border-y border-amber-500/20 font-medium text-amber-600/80">{item.dayOfMonth || "-"}</TableCell>
                                                    <TableCell className="text-xs text-amber-600/70 border-y border-amber-500/20 w-[200px]">
                                                        <SlideButton
                                                            isConfirmed={item.isPaid}
                                                            onConfirm={async () => await handleToggleTithe(item.originalId, !item.isPaid)}
                                                            label="Arrastar para pagar"
                                                            confirmedLabel="Pago"
                                                            variant="misc"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-xl border-y border-amber-500/20 text-amber-600">{formatCurrency(item.amount)}</TableCell>
                                                    <TableCell className="rounded-r-lg border-y border-r border-amber-500/20">
                                                        {/* No actions for tithe */}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }

                                        const expense = item as typeof expenses[0];
                                        const expenseIndex = expenses.findIndex(e => e.id === expense.id);
                                        const total = Number(expense.totalAmount);
                                        const paid = Number(expense.paidAmount);
                                        const percentage = total > 0 ? (paid / total) * 100 : 0;

                                        return (
                                            <Draggable key={expense.id} draggableId={expense.id} index={expenseIndex}>
                                                {(provided, snapshot) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`bg-card hover:bg-card/80 transition-colors border-none rounded-lg shadow-sm group ${snapshot.isDragging ? "opacity-50" : ""}`}
                                                        style={{ ...provided.draggableProps.style, display: snapshot.isDragging ? "table" : undefined }}
                                                    >
                                                        <TableCell className="rounded-l-lg border-y border-l border-border/50 text-muted-foreground/50 text-xs">{expenseIndex + 1}</TableCell>
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
                                                                <Progress value={percentage} className="h-1.5 bg-muted/50" indicatorClassName="bg-rose-500" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-lg border-y border-border/50 text-rose-500">{formatCurrency(total)}</TableCell>
                                                        <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <EditExpenseDialog expense={expense} />
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(expense.id)}>
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

                <div className="md:hidden space-y-2">
                    <Droppable droppableId="expenses-mobile">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {displayItems.map((item, visualIndex) => {
                                    if (item.displayType === 'tithe') {
                                        return (
                                            <Card key={item.id} className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 border-amber-500/20 shadow-sm border-l-4 border-l-amber-500">
                                                <CardContent className="p-3 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-amber-500/10 rounded-full"><Crown className="h-5 w-5 text-amber-500 fill-amber-500/20" /></div>
                                                            <div>
                                                                <p className="font-bold text-amber-600 text-base">{item.description}</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-amber-600/70 mt-0.5">
                                                                    <Calendar className="h-2.5 w-2.5" />
                                                                    <span>Dia {item.dayOfMonth || "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-xl text-amber-600">{formatCurrency(item.amount)}</p>
                                                    </div>
                                                    <div className="pt-2 border-t border-amber-500/10">
                                                        <SlideButton
                                                            isConfirmed={item.isPaid}
                                                            onConfirm={async () => await handleToggleTithe(item.originalId, !item.isPaid)}
                                                            label="Arrastar para pagar"
                                                            confirmedLabel="Pago"
                                                            variant="misc"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    }

                                    const expense = item as typeof expenses[0];
                                    const expenseIndex = expenses.findIndex(e => e.id === expense.id);
                                    const total = Number(expense.totalAmount);
                                    const paid = Number(expense.paidAmount);
                                    const percentage = total > 0 ? (paid / total) * 100 : 0;

                                    return (
                                        <Draggable key={`mobile-${expense.id}`} draggableId={`mobile-${expense.id}`} index={expenseIndex}>
                                            {(provided, snapshot) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={cn("bg-card border-none shadow-sm", snapshot.isDragging && "opacity-50")}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <CardContent className="p-2 space-y-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground/50 shrink-0">
                                                                    <GripVertical className="h-3.5 w-3.5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-medium truncate text-xs">{expense.description}</p>
                                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                        <Calendar className="h-2.5 w-2.5" />
                                                                        <span>{expense.dayOfMonth || "-"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="font-bold text-sm text-rose-500 shrink-0">{formatCurrency(total)}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Progress value={percentage} className="h-1" indicatorClassName="bg-rose-500" />
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1">
                                                                <SlideButton
                                                                    isConfirmed={Number(expense.paidAmount) >= Number(expense.totalAmount)}
                                                                    onConfirm={async () => await handleTogglePaid(expense.id, !(Number(expense.paidAmount) >= Number(expense.totalAmount)))}
                                                                    label="Pagar"
                                                                    confirmedLabel="Pago"
                                                                    variant="expense"
                                                                    className="h-8 min-w-[100px]"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1 shrink-0">
                                                                <EditExpenseDialog expense={expense} />
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(expense.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
}
