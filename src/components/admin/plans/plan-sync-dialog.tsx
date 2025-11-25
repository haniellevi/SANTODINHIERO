"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SyncPreview } from "./types";

interface PlanSyncDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    syncPreview: SyncPreview | null;
    onConfirm: () => void;
    onCancel: () => void;
    isConfirming?: boolean;
}

export function PlanSyncDialog({
    isOpen,
    onOpenChange,
    syncPreview,
    onConfirm,
    onCancel,
    isConfirming,
}: PlanSyncDialogProps) {
    if (!syncPreview) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sincronizando...</DialogTitle>
                        <DialogDescription>
                            Buscando planos do Clerk...
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    const { previewItems, missing } = syncPreview;
    const newPlans = previewItems.filter((item) => !item.exists);
    const existingPlans = previewItems.filter((item) => item.exists);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Sincronizar Planos do Clerk</DialogTitle>
                    <DialogDescription>
                        Revise as mudanças antes de confirmar a sincronização.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {newPlans.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm mb-2">
                                Novos Planos ({newPlans.length})
                            </h4>
                            <div className="space-y-2">
                                {newPlans.map((item) => (
                                    <div
                                        key={item.plan.id}
                                        className="flex items-center justify-between p-3 border border-border rounded-md"
                                    >
                                        <span className="text-sm">{item.plan.name || item.plan.id}</span>
                                        <Badge variant="default">Novo</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {existingPlans.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm mb-2">
                                Planos Existentes ({existingPlans.length})
                            </h4>
                            <div className="space-y-2">
                                {existingPlans.map((item) => (
                                    <div
                                        key={item.plan.id}
                                        className="flex items-center justify-between p-3 border border-border rounded-md"
                                    >
                                        <span className="text-sm">{item.plan.name || item.plan.id}</span>
                                        <Badge variant="secondary">Atualizar</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {missing.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm mb-2 text-destructive">
                                Planos Removidos ({missing.length})
                            </h4>
                            <div className="space-y-2">
                                {missing.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 border border-destructive rounded-md"
                                    >
                                        <span className="text-sm">{item.name}</span>
                                        <Badge variant="destructive">Desativar</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={isConfirming}>
                        {isConfirming ? 'Sincronizando...' : 'Confirmar Sincronização'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
