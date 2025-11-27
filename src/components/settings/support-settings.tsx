"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createFeedback } from "@/actions/settings";
import { toast } from "sonner";
import { HelpCircle, Send } from "lucide-react";

export function SupportSettings() {
    const [type, setType] = useState("OTHER");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit() {
        if (!message.trim()) {
            toast.error("Por favor, descreva sua solicitação.");
            return;
        }

        setIsLoading(true);
        try {
            await createFeedback(type as any, message);
            toast.success("Feedback enviado! Agradecemos sua contribuição.");
            setMessage("");
            setType("OTHER");
        } catch (error) {
            toast.error("Erro ao enviar feedback.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-green-500" />
                        Suporte e Feedback
                    </CardTitle>
                    <CardDescription>
                        Encontrou um erro ou tem uma sugestão? Nos conte!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo de Solicitação</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUG">Reportar Erro (Bug)</SelectItem>
                                <SelectItem value="FEATURE_REQUEST">Sugestão de Melhoria</SelectItem>
                                <SelectItem value="OTHER">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                            id="message"
                            placeholder="Descreva detalhadamente o que aconteceu ou sua ideia..."
                            className="min-h-[150px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                            <Send className="h-4 w-4 mr-2" />
                            {isLoading ? "Enviando..." : "Enviar Feedback"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
