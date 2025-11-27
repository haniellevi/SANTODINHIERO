"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, Mail } from "lucide-react";
import { useState } from "react";
import { inviteCollaborator, removeCollaborator } from "@/actions/settings";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Collaborator {
    id: string;
    email: string;
    status: string; // PENDING, ACCEPTED, REJECTED
    permission: string; // VIEWER, EDITOR, ADMIN
    user?: {
        name: string | null;
        image: string | null;
    } | null;
}

interface CollaboratorsSettingsProps {
    collaborators: Collaborator[];
    maxCollaborators: number;
}

export function CollaboratorsSettings({ collaborators, maxCollaborators }: CollaboratorsSettingsProps) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [invitePermission, setInvitePermission] = useState("VIEWER");
    const [isLoading, setIsLoading] = useState(false);

    async function handleInvite() {
        setIsLoading(true);
        try {
            await inviteCollaborator(inviteEmail, invitePermission as any);
            toast.success("Convite enviado com sucesso!");
            setIsInviteOpen(false);
            setInviteEmail("");
        } catch (error: any) {
            toast.error(error.message || "Erro ao enviar convite.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemove(id: string) {
        if (!confirm("Tem certeza que deseja remover este colaborador?")) return;
        try {
            await removeCollaborator(id);
            toast.success("Colaborador removido.");
        } catch (error) {
            toast.error("Erro ao remover colaborador.");
        }
    }

    const usagePercentage = (collaborators.length / (maxCollaborators || 1)) * 100;

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                Colaboradores
                            </CardTitle>
                            <CardDescription>
                                Gerencie quem tem acesso à sua conta.
                            </CardDescription>
                        </div>
                        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                            <DialogTrigger asChild>
                                <Button disabled={collaborators.length >= maxCollaborators} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Convidar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Convidar Colaborador</DialogTitle>
                                    <DialogDescription>
                                        Envie um convite por e-mail para alguém acessar sua conta.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">E-mail</Label>
                                        <Input
                                            id="email"
                                            placeholder="exemplo@email.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="permission">Permissão</Label>
                                        <Select value={invitePermission} onValueChange={setInvitePermission}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VIEWER">Visualizador (Apenas vê)</SelectItem>
                                                <SelectItem value="EDITOR">Editor (Pode alterar)</SelectItem>
                                                <SelectItem value="ADMIN">Admin (Acesso total)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleInvite} disabled={isLoading}>
                                        {isLoading ? "Enviando..." : "Enviar Convite"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between text-sm font-medium text-muted-foreground">
                            <span>Uso do Plano</span>
                            <span>{collaborators.length} de {maxCollaborators} colaboradores</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all duration-500"
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {collaborators.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>Nenhum colaborador ainda.</p>
                            </div>
                        ) : (
                            collaborators.map((collab) => (
                                <div key={collab.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={collab.user?.image || undefined} />
                                            <AvatarFallback>{collab.email[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{collab.user?.name || collab.email}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {collab.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={collab.status === 'ACCEPTED' ? 'default' : 'secondary'}>
                                            {collab.status === 'PENDING' ? 'Pendente' : collab.status}
                                        </Badge>
                                        <Badge variant="outline">{collab.permission}</Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500"
                                            onClick={() => handleRemove(collab.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
