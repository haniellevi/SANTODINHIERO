"use client";

import { Package } from "lucide-react";

export function PlanEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum plano configurado
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
                Sincronize planos do Clerk ou crie um plano customizado para começar.
            </p>
        </div>
    );
}
