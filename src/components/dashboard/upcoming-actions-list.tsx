"use strict";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActionItem {
    id: string;
    type: "income" | "expense" | "investment";
    description: string;
    amount: number;
    dayOfMonth: number | null;
    status?: "pending" | "partial" | "paid";
}

interface UpcomingActionsListProps {
    actions: ActionItem[];
    currentMonth: number;
    currentYear: number;
}

export function UpcomingActionsList({ actions, currentMonth, currentYear }: UpcomingActionsListProps) {
    const sortedActions = [...actions].sort((a, b) => {
        const dayA = a.dayOfMonth || 32; // Put items without day at the end
        const dayB = b.dayOfMonth || 32;
        return dayA - dayB;
    });

    const getIcon = (type: ActionItem["type"]) => {
        switch (type) {
            case "income":
                return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />;
            case "expense":
                return <ArrowDownCircle className="h-4 w-4 text-rose-500" />;
            case "investment":
                return <TrendingUp className="h-4 w-4 text-blue-500" />;
        }
    };

    const getTypeLabel = (type: ActionItem["type"]) => {
        switch (type) {
            case "income":
                return "Entrada";
            case "expense":
                return "Saída";
            case "investment":
                return "Investimento";
        }
    };

    const getStatusBadge = (item: ActionItem) => {
        if (item.type === "expense") {
            if (item.status === "paid") return <Badge variant="outline" className="text-emerald-500 border-emerald-500">Pago</Badge>;
            if (item.status === "partial") return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Parcial</Badge>;
            return <Badge variant="outline" className="text-rose-500 border-rose-500">Pendente</Badge>;
        }
        return null; // No status for income/investment for now
    };

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Próximas Ações Previstas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedActions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ação prevista para este mês.</p>
                    ) : (
                        sortedActions.map((action) => (
                            <div
                                key={`${action.type}-${action.id}`}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-full bg-muted/50",
                                        action.type === "income" && "bg-emerald-500/10",
                                        action.type === "expense" && "bg-rose-500/10",
                                        action.type === "investment" && "bg-blue-500/10"
                                    )}>
                                        {getIcon(action.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{action.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{getTypeLabel(action.type)}</span>
                                            <span>•</span>
                                            <span>Dia {action.dayOfMonth || "?"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn("font-bold",
                                        action.type === "income" && "text-emerald-500",
                                        action.type === "expense" && "text-rose-500",
                                        action.type === "investment" && "text-blue-500"
                                    )}>
                                        {formatCurrency(action.amount)}
                                    </span>
                                    {getStatusBadge(action)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
