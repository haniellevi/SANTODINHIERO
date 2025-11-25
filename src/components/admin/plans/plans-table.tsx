"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { BillingPlan } from "./types";
import { formatCurrency } from "./utils";

interface PlansTableProps {
    plans: Record<string, BillingPlan>;
    loading?: boolean;
    onEdit: (planId: string, plan: BillingPlan) => void;
    onDelete: (planId: string) => void;
    onToggleActive: (planId: string) => void;
}

export function PlansTable({
    plans,
    loading,
    onEdit,
    onDelete,
    onToggleActive,
}: PlansTableProps) {
    const planEntries = Object.entries(plans);

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Nome
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Fonte
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Créditos
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Preço Mensal
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Status
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {planEntries.map(([planId, plan]) => (
                        <tr key={planId} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{plan.name}</span>
                                    {plan.clerkName && plan.clerkName !== plan.name && (
                                        <span className="text-xs text-muted-foreground">
                                            Clerk: {plan.clerkName}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <Badge variant={plan.billingSource === 'clerk' ? 'default' : 'secondary'}>
                                    {plan.billingSource === 'clerk' ? 'Clerk' : 'Manual'}
                                </Badge>
                            </td>
                            <td className="py-3 px-4 text-foreground">{plan.credits}</td>
                            <td className="py-3 px-4 text-foreground">
                                {formatCurrency(plan.priceMonthlyCents, plan.currency || 'brl')}
                            </td>
                            <td className="py-3 px-4">
                                <Badge variant={plan.active !== false ? 'default' : 'outline'}>
                                    {plan.active !== false ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleActive(planId)}
                                    >
                                        {plan.active !== false ? (
                                            <ToggleRight className="h-4 w-4" />
                                        ) : (
                                            <ToggleLeft className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(planId, plan)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm('Tem certeza que deseja excluir este plano?')) {
                                                onDelete(planId);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
