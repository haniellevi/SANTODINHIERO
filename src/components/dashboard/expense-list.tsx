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
import { Trash2, Lock, GripVertical, TrendingDown, Pencil, Calendar, CheckCircle2, Circle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideButton } from "@/components/ui/slide-button";
import { deleteItem, updateItemOrder, toggleExpensePaid, toggleTithePaid } from "@/actions/finance";
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

interface ExpenseListProps {
    expenses: SerializedExpense[];
    investments: SerializedInvestment[];
    miscExpenses: SerializedMiscExpense[];
    titheAmount: number;
    totalInvestment: number;
    totalInvestmentPaid: number;
    totalMisc: number;
    totalMiscPaid: number;
    isTithePaid: boolean;
    monthId: string;
}

export function ExpenseList({
    expenses: initialExpenses,
    investments,
    miscExpenses,
    titheAmount,
    totalInvestment,
    totalInvestmentPaid,
    totalMisc,
    totalMiscPaid,
    isTithePaid,
    monthId
}: ExpenseListProps) {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [isTithePaidState, setIsTithePaidState] = useState(isTithePaid);

    useEffect(() => {
        setExpenses(initialExpenses);
        setIsTithePaidState(isTithePaid);
    }, [initialExpenses, isTithePaid]);

    const currentDay = new Date().getDate();

    // Calculate investments and misc expenses up to today
    const investmentsUpToToday = investments
        .filter(i => (i.dayOfMonth || 32) <= currentDay)
        .reduce((sum, i) => sum + i.amount, 0);

    const miscExpensesUpToToday = miscExpenses
        .filter(m => (m.dayOfMonth || 32) <= currentDay)
        .reduce((sum, m) => sum + m.amount, 0);

    // Include ALL totals (expenses + tithe + investments + misc) for accurate calculations
    // For "up to today", only include items with dayOfMonth <= currentDay
    // Tithe has no dayOfMonth, so we include it in totalOverall but NOT in totalUpToToday
    const totalUpToToday = expenses
        .filter(e => (e.dayOfMonth || 32) <= currentDay)
        .reduce((acc, curr) => acc + Number(curr.totalAmount), 0)
        + investmentsUpToToday
        + miscExpensesUpToToday;

    // Sum paid amounts including tithe (if paid), investments and misc
    const totalPaid = expenses.reduce((acc, curr) => acc + Number(curr.paidAmount), 0)
        + totalInvestmentPaid
        + totalMiscPaid
        + (isTithePaidState ? titheAmount : 0);

    const totalOverall = expenses.reduce((acc, curr) => acc + Number(curr.totalAmount), 0) + titheAmount + totalInvestment + totalMisc;

    async function handleDelete(id: string) {
        try {
            await deleteItem(id, "expense");
            toast.success("Despesa removida");
        } catch (error) {
            toast.error("Erro ao remover despesa");
        }
    }

    async function handleTogglePaid(id: string, isPaid: boolean) {
        // Optimistic update
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
            // Revert on error
            setExpenses(expenses);
            toast.error("Erro ao atualizar status");
        }
    }

    async function handleToggleTithe(isPaid: boolean) {
        setIsTithePaidState(isPaid);
        try {
            await toggleTithePaid(monthId, isPaid);
            toast.success(isPaid ? "Dízimo marcado como pago" : "Dízimo marcado como pendente");
        } catch (error) {
            setIsTithePaidState(!isPaid);
            toast.error("Erro ao atualizar status do dízimo");
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

                        {(titheAmount > 0 || totalInvestment > 0 || totalMisc > 0) && (
                            <TableBody>
                                {titheAmount > 0 && (
                                    <TableRow className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 hover:from-yellow-500/20 hover:to-yellow-500/20 transition-all border-none rounded-lg shadow-sm border-l-4 border-l-amber-500">
                                        <TableCell className="rounded-l-lg border-y border-amber-500/20 text-amber-600/70 text-xs">-</TableCell>
                                        <TableCell className="border-y border-amber-500/20"><Crown className="h-5 w-5 text-amber-500 mx-auto fill-amber-500/20" /></TableCell>
                                        <TableCell className="font-bold text-amber-600 border-y border-amber-500/20 whitespace-normal text-base">Dízimo (10%)</TableCell>
                                        <TableCell className="border-y border-amber-500/20">-</TableCell>
                                        <TableCell className="text-xs text-amber-600/70 border-y border-amber-500/20 w-[200px]">
                                            <SlideButton
                                                isConfirmed={isTithePaidState}
                                                onConfirm={async () => await handleToggleTithe(!isTithePaidState)}
                                                label="Arrastar para pagar"
                                                confirmedLabel="Pago"
                                                className={isTithePaidState ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-xl border-y border-amber-500/20 text-amber-600">{formatCurrency(titheAmount)}</TableCell>
                                        <TableCell className="rounded-r-lg border-y border-r border-amber-500/20">
                                            <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-amber-500/50"><Lock className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {totalInvestment > 0 && (
                                    <TableRow className="bg-blue-950/10 hover:bg-blue-950/20 transition-colors border-none rounded-lg shadow-sm">
                                        <TableCell className="rounded-l-lg border-y border-l border-blue-500/20 text-blue-500/50 text-xs">-</TableCell>
                                        <TableCell className="border-y border-blue-500/20"><Lock className="h-4 w-4 text-blue-500/50 mx-auto" /></TableCell>
                                        <TableCell className="font-medium text-blue-400 border-y border-blue-500/20 whitespace-normal">Total Investimentos</TableCell>
                                        <TableCell className="border-y border-blue-500/20">-</TableCell>
                                        <TableCell className="text-xs text-blue-400/70 border-y border-blue-500/20">Agregado</TableCell>
                                        <TableCell className="text-right font-bold text-lg text-blue-400 border-y border-blue-500/20">{formatCurrency(totalInvestment)}</TableCell>
                                        <TableCell className="rounded-r-lg border-y border-r border-blue-500/20">
                                            <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-blue-400/50"><Lock className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {totalMisc > 0 && (
                                    <TableRow className="bg-orange-950/10 hover:bg-orange-950/20 transition-colors border-none rounded-lg shadow-sm">
                                        <TableCell className="rounded-l-lg border-y border-l border-orange-500/20 text-orange-500/50 text-xs">-</TableCell>
                                        <TableCell className="border-y border-orange-500/20"><Lock className="h-4 w-4 text-orange-500/50 mx-auto" /></TableCell>
                                        <TableCell className="font-medium text-orange-400 border-y border-orange-500/20 whitespace-normal">Total Gastos Avulsos</TableCell>
                                        <TableCell className="border-y border-orange-500/20">-</TableCell>
                                        <TableCell className="text-xs text-orange-400/70 border-y border-orange-500/20">Agregado</TableCell>
                                        <TableCell className="text-right font-bold text-lg text-orange-400 border-y border-orange-500/20">{formatCurrency(totalMisc)}</TableCell>
                                        <TableCell className="rounded-r-lg border-y border-r border-orange-500/20">
                                            <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-orange-400/50"><Lock className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}

                        <Droppable droppableId="expenses-desktop">
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
                                                        style={{ ...provided.draggableProps.style, display: snapshot.isDragging ? "table" : undefined }}
                                                    >
                                                        <TableCell className="rounded-l-lg border-y border-l border-border/50 text-muted-foreground/50 text-xs">{index + 1}</TableCell>
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
                                                        <TableCell className="text-right font-bold text-lg border-y border-border/50 text-rose-500">{formatCurrency(total)}</TableCell>
                                                        <TableCell className="rounded-r-lg border-y border-r border-border/50">
                                                            <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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

                <div className="md:hidden space-y-4">
                    {titheAmount > 0 && (
                        <Card className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 border-amber-500/20 shadow-sm border-l-4 border-l-amber-500">
                            <CardContent className="p-3 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-full"><Crown className="h-5 w-5 text-amber-500 fill-amber-500/20" /></div>
                                        <div>
                                            <p className="font-bold text-amber-600 text-base">Dízimo (10%)</p>
                                            <p className="text-[10px] text-amber-600/70 uppercase tracking-wider">Primícias</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-xl text-amber-600">{formatCurrency(titheAmount)}</p>
                                </div>
                                <div className="pt-2 border-t border-amber-500/10">
                                    <SlideButton
                                        isConfirmed={isTithePaidState}
                                        onConfirm={async () => await handleToggleTithe(!isTithePaidState)}
                                        label="Arrastar para pagar"
                                        confirmedLabel="Pago"
                                        className={isTithePaidState ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {totalInvestment > 0 && (
                        <Card className="bg-blue-950/10 border-blue-500/20 shadow-sm">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/10 rounded-full"><Lock className="h-3.5 w-3.5 text-blue-500" /></div>
                                    <div>
                                        <p className="font-medium text-sm text-blue-400">Total Investimentos</p>
                                        <p className="text-[10px] text-blue-400/70 uppercase tracking-wider">Agregado</p>
                                    </div>
                                </div>
                                <p className="font-bold text-base text-blue-400">{formatCurrency(totalInvestment)}</p>
                            </CardContent>
                        </Card>
                    )}
                    {totalMisc > 0 && (
                        <Card className="bg-orange-950/10 border-orange-500/20 shadow-sm">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-500/10 rounded-full"><Lock className="h-3.5 w-3.5 text-orange-500" /></div>
                                    <div>
                                        <p className="font-medium text-sm text-orange-400">Total Gastos Avulsos</p>
                                        <p className="text-[10px] text-orange-400/70 uppercase tracking-wider">Agregado</p>
                                    </div>
                                </div>
                                <p className="font-bold text-base text-orange-400">{formatCurrency(totalMisc)}</p>
                            </CardContent>
                        </Card>
                    )}

                    <Droppable droppableId="expenses-mobile">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {expenses.map((expense, index) => {
                                    const total = Number(expense.totalAmount);
                                    const paid = Number(expense.paidAmount);
                                    const percentage = total > 0 ? (paid / total) * 100 : 0;

                                    return (
                                        <Draggable key={`mobile-${expense.id}`} draggableId={`mobile-${expense.id}`} index={index}>
                                            {(provided, snapshot) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={cn("bg-card border-none shadow-sm", snapshot.isDragging && "opacity-50")}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <CardContent className="p-3 space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground/50">
                                                                    <GripVertical className="h-3.5 w-3.5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium line-clamp-1 text-sm">{expense.description}</p>
                                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                                        <Calendar className="h-2.5 w-2.5" />
                                                                        <span>Dia {expense.dayOfMonth || "-"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="font-bold text-base text-rose-500">{formatCurrency(total)}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                                                                <span>Progresso</span>
                                                                <span>{Math.round(percentage)}%</span>
                                                            </div>
                                                            <Progress value={percentage} className="h-1.5" indicatorClassName={percentage >= 100 ? "bg-emerald-500" : "bg-primary"} />
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-3">
                                                            <div className="flex-1">
                                                                <SlideButton
                                                                    isConfirmed={Number(expense.paidAmount) >= Number(expense.totalAmount)}
                                                                    onConfirm={async () => await handleTogglePaid(expense.id, !(Number(expense.paidAmount) >= Number(expense.totalAmount)))}
                                                                    label="Arrastar para pagar"
                                                                    confirmedLabel="Pago"
                                                                    className={Number(expense.paidAmount) >= Number(expense.totalAmount) ? "bg-emerald-500/20" : "bg-muted/50"}
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
