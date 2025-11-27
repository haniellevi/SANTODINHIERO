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
import { Trash2, GripVertical, ShoppingCart, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteItem, updateItemOrder, toggleMiscExpensePaid } from "@/actions/finance";
import { toast } from "sonner";
import { MonthWithDetails } from "@/lib/queries/finance";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { EditMiscExpenseDialog } from "./edit-misc-expense-dialog";
import { cn } from "@/lib/utils";
import { TransactionSummaryCard } from "./transaction-summary-card";
import { SlideButton } from "@/components/ui/slide-button";

type SerializedMiscExpense = Omit<MonthWithDetails["miscExpenses"][number], "amount"> & { amount: number; isPaid: boolean };

interface MiscExpenseListProps {
    miscExpenses: SerializedMiscExpense[];
}

export function MiscExpenseList({ miscExpenses: initialMiscExpenses }: MiscExpenseListProps) {
    const [miscExpenses, setMiscExpenses] = useState(initialMiscExpenses);
    const currentDay = new Date().getDate();

    const totalUpToToday = miscExpenses
        .filter(m => (m.dayOfMonth || 32) <= currentDay)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalPaid = miscExpenses
        .filter(m => m.isPaid)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalOverall = miscExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

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

    async function handleTogglePaid(id: string, currentStatus: boolean) {
        const previousMiscExpenses = miscExpenses;
        const updatedMiscExpenses = miscExpenses.map(m => {
            if (m.id === id) {
                return { ...m, isPaid: !currentStatus };
            }
            return m;
        });
        setMiscExpenses(updatedMiscExpenses);

        try {
            await toggleMiscExpensePaid(id, !currentStatus);
            toast.success(currentStatus ? "Marcado como não pago" : "Marcado como pago");
        } catch (error) {
            setMiscExpenses(previousMiscExpenses);
            toast.error("Erro ao atualizar status");
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
        <div className="space-y-6">
            <TransactionSummaryCard
                currentDay={currentDay}
                totalUpToToday={totalUpToToday}
                totalMarked={totalPaid}
                totalOverall={totalOverall}
                type="misc"
            />

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
                        <Droppable droppableId="miscExpenses-desktop">
                            {(provided) => (
                                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                    {miscExpenses.map((miscExpense, index) => (
                                        <Draggable key={miscExpense.id} draggableId={miscExpense.id} index={index}>
                                            {(provided, snapshot) => (
                                                <TableRow
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all border-none rounded-xl shadow-sm group ${snapshot.isDragging ? "opacity-50 shadow-lg ring-2 ring-yellow-500/20" : "hover:shadow-md hover:ring-1 hover:ring-white/5"}`}
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
                                                    <TableCell className="font-medium border-y border-white/5 whitespace-normal min-w-[150px] text-foreground/90">{miscExpense.description}</TableCell>
                                                    <TableCell className="border-y border-white/5">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                            <span>{miscExpense.dayOfMonth || "-"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-lg border-y border-white/5">
                                                        <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
                                                            {formatCurrency(Number(miscExpense.amount))}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="rounded-r-xl border-y border-r border-white/5 pr-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant={miscExpense.isPaid ? "default" : "outline"}
                                                                size="icon"
                                                                className={`h-8 w-8 rounded-full transition-all ${miscExpense.isPaid
                                                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 border-transparent"
                                                                    : "text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5"
                                                                    }`}
                                                                onClick={() => handleTogglePaid(miscExpense.id, miscExpense.isPaid)}
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </Button>
                                                            <EditMiscExpenseDialog miscExpense={miscExpense} />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg"
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

                <div className="md:hidden space-y-4 pb-24">
                    <Droppable droppableId="miscExpenses-mobile">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {miscExpenses.map((miscExpense, index) => (
                                    <Draggable key={`mobile-${miscExpense.id}`} draggableId={`mobile-${miscExpense.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "bg-card/80 backdrop-blur-xl border-white/5 shadow-sm overflow-hidden transition-all",
                                                    "border-l-[3px] border-l-yellow-500",
                                                    snapshot.isDragging ? "opacity-50 scale-95 ring-2 ring-yellow-500/20" : "active:scale-[0.98]"
                                                )}
                                                style={provided.draggableProps.style}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent pointer-events-none" />
                                                <CardContent className="p-4 space-y-3 relative">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-muted-foreground/50 text-xs font-medium w-6">{index + 1}</span>
                                                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/5 rounded text-muted-foreground/40">
                                                                <GripVertical className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground/90 line-clamp-1">{miscExpense.description}</p>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>Dia {miscExpense.dayOfMonth || "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-lg text-yellow-500">{formatCurrency(Number(miscExpense.amount))}</p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-3">
                                                        <div className="flex-1">
                                                            <SlideButton
                                                                isConfirmed={miscExpense.isPaid}
                                                                onConfirm={async () => await handleTogglePaid(miscExpense.id, miscExpense.isPaid)}
                                                                label="Arrastar para pagar"
                                                                confirmedLabel="Pago"
                                                                variant="misc"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <EditMiscExpenseDialog miscExpense={miscExpense} />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                                                onClick={() => handleDelete(miscExpense.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
        </div>
    );
}
