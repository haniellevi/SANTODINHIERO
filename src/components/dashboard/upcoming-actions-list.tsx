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
        <Card className="col-span-1 border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                    Próximas Ações
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="space-y-2">
                    {sortedActions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                            <p className="text-sm text-muted-foreground">Nenhuma ação prevista.</p>
                        </div>
                    ) : (
                        sortedActions.map((action) => (
                            <div
                                key={`${action.type}-${action.id}`}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/50 p-3 transition-all hover:bg-card hover:border-border/80"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                                        action.type === "income" && "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20",
                                        action.type === "expense" && "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20",
                                        action.type === "investment" && "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
                                    )}>
                                        {getIcon(action.type)}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <p className="truncate text-sm font-semibold text-foreground/90">{action.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium text-emerald-500">Dia {action.dayOfMonth || "?"}</span>
                                            <span>•</span>
                                            <span>{getTypeLabel(action.type)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn("font-bold text-sm",
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
