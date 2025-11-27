"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateUserSettings } from "@/actions/settings";
import { toast } from "sonner";
import { Crown, Bell } from "lucide-react";

interface GeneralSettingsProps {
    initialData: {
        isTitheEnabled: boolean;
        planningAlertDays: number;
    };
}

export function GeneralSettings({ initialData }: GeneralSettingsProps) {
    const [isTitheEnabled, setIsTitheEnabled] = useState(initialData.isTitheEnabled);
    const [planningAlertDays, setPlanningAlertDays] = useState(initialData.planningAlertDays);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSave() {
        setIsLoading(true);
        try {
            await updateUserSettings({
                isTitheEnabled,
                planningAlertDays: Number(planningAlertDays)
            });
            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar configurações.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        Dízimo Automático
                    </CardTitle>
                    <CardDescription>
                        Ative para gerar automaticamente os lançamentos de dízimo baseados nas suas entradas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Habilitar Dízimo</Label>
                        <p className="text-sm text-muted-foreground">
                            Se desativado, os dízimos não aparecerão nas suas listas e previsões.
                        </p>
                    </div>
                    <Switch
                        checked={isTitheEnabled}
                        onCheckedChange={setIsTitheEnabled}
                    />
                </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        Alertas de Planejamento
                    </CardTitle>
                    <CardDescription>
                        Receba lembretes para planejar o próximo mês.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="alert-days">Dias antes do fim do mês</Label>
                        <div className="flex gap-4">
                            <Input
                                id="alert-days"
                                type="number"
                                min={1}
                                max={10}
                                value={planningAlertDays}
                                onChange={(e) => setPlanningAlertDays(Number(e.target.value))}
                                className="w-24"
                            />
                            <p className="text-sm text-muted-foreground self-center">
                                dias de antecedência
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20">
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </div>
    );
}
