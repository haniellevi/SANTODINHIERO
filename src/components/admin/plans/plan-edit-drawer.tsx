"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { BillingPlan, ClerkPlan } from "./types";

interface PlanEditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    plan: BillingPlan | null;
    clerkPlanDetails?: ClerkPlan;
    onSave: (plan: BillingPlan) => void;
    isSaving?: boolean;
}

export function PlanEditDrawer({
    isOpen,
    onClose,
    plan,
    clerkPlanDetails,
    onSave,
    isSaving,
}: PlanEditDrawerProps) {
    const [editedPlan, setEditedPlan] = useState<BillingPlan | null>(null);

    useEffect(() => {
        if (plan) {
            setEditedPlan({ ...plan });
        }
    }, [plan]);

    if (!editedPlan) return null;

    const handleSave = () => {
        onSave(editedPlan);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {editedPlan.isNew ? 'Novo Plano' : 'Editar Plano'}
                    </SheetTitle>
                    <SheetDescription>
                        Configure os detalhes do plano de assinatura.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Plano</Label>
                            <Input
                                id="name"
                                value={editedPlan.name}
                                onChange={(e) =>
                                    setEditedPlan({ ...editedPlan, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="credits">Créditos Mensais</Label>
                            <Input
                                id="credits"
                                type="number"
                                value={editedPlan.credits}
                                onChange={(e) =>
                                    setEditedPlan({
                                        ...editedPlan,
                                        credits: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={editedPlan.description || ''}
                                onChange={(e) =>
                                    setEditedPlan({ ...editedPlan, description: e.target.value })
                                }
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Preços</h3>

                        <div>
                            <Label htmlFor="currency">Moeda</Label>
                            <Select
                                value={editedPlan.currency || 'brl'}
                                onValueChange={(value) =>
                                    setEditedPlan({ ...editedPlan, currency: value })
                                }
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="brl">BRL (R$)</SelectItem>
                                    <SelectItem value="usd">USD ($)</SelectItem>
                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="monthlyPrice">Preço Mensal (centavos)</Label>
                            <Input
                                id="monthlyPrice"
                                type="number"
                                value={editedPlan.priceMonthlyCents || ''}
                                onChange={(e) =>
                                    setEditedPlan({
                                        ...editedPlan,
                                        priceMonthlyCents: parseInt(e.target.value) || null,
                                    })
                                }
                                placeholder="Ex: 9900 para R$ 99,00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="yearlyPrice">Preço Anual (centavos)</Label>
                            <Input
                                id="yearlyPrice"
                                type="number"
                                value={editedPlan.priceYearlyCents || ''}
                                onChange={(e) =>
                                    setEditedPlan({
                                        ...editedPlan,
                                        priceYearlyCents: parseInt(e.target.value) || null,
                                    })
                                }
                                placeholder="Ex: 99000 para R$ 990,00"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Plano Ativo</Label>
                            <p className="text-sm text-muted-foreground">
                                Planos inativos não aparecem na página de preços
                            </p>
                        </div>
                        <Switch
                            checked={editedPlan.active !== false}
                            onCheckedChange={(checked) =>
                                setEditedPlan({ ...editedPlan, active: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Destacar Plano</Label>
                            <p className="text-sm text-muted-foreground">
                                Planos destacados aparecem com visual diferenciado
                            </p>
                        </div>
                        <Switch
                            checked={editedPlan.highlight || false}
                            onCheckedChange={(checked) =>
                                setEditedPlan({ ...editedPlan, highlight: checked })
                            }
                        />
                    </div>

                    {/* Badge */}
                    <div>
                        <Label htmlFor="badge">Badge (opcional)</Label>
                        <Input
                            id="badge"
                            value={editedPlan.badge || ''}
                            onChange={(e) =>
                                setEditedPlan({ ...editedPlan, badge: e.target.value || null })
                            }
                            placeholder="Ex: Mais Popular"
                        />
                    </div>

                    {/* CTA */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Call to Action</h3>

                        <div>
                            <Label htmlFor="ctaType">Tipo de CTA</Label>
                            <Select
                                value={editedPlan.ctaType || 'checkout'}
                                onValueChange={(value) =>
                                    setEditedPlan({
                                        ...editedPlan,
                                        ctaType: value as 'checkout' | 'contact',
                                    })
                                }
                            >
                                <SelectTrigger id="ctaType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="checkout">Checkout</SelectItem>
                                    <SelectItem value="contact">Contato</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="ctaLabel">Texto do Botão</Label>
                            <Input
                                id="ctaLabel"
                                value={editedPlan.ctaLabel || ''}
                                onChange={(e) =>
                                    setEditedPlan({ ...editedPlan, ctaLabel: e.target.value || null })
                                }
                                placeholder="Ex: Assinar Agora"
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
