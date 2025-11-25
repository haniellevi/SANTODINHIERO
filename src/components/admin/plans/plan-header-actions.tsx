"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, DollarSign } from "lucide-react";

interface PlanHeaderActionsProps {
    onSyncClerk: () => void;
    onAddCustomPlan: () => void;
    onRefreshPricing: () => void;
    isSyncing?: boolean;
    isRefreshingPricing?: boolean;
}

export function PlanHeaderActions({
    onSyncClerk,
    onAddCustomPlan,
    onRefreshPricing,
    isSyncing,
    isRefreshingPricing,
}: PlanHeaderActionsProps) {
    return (
        <div className="flex items-center gap-2 mt-4">
            <Button
                variant="outline"
                onClick={onSyncClerk}
                disabled={isSyncing}
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sincronizar Clerk
            </Button>
            <Button
                variant="outline"
                onClick={onRefreshPricing}
                disabled={isRefreshingPricing}
            >
                <DollarSign className={`h-4 w-4 mr-2 ${isRefreshingPricing ? 'animate-spin' : ''}`} />
                Atualizar Preços
            </Button>
            <Button onClick={onAddCustomPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Plano Customizado
            </Button>
        </div>
    );
}
