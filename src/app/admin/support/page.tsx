import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminSupportPage() {
    const user = await currentUser();

    if (!user || !(await isAdmin(user.id))) {
        redirect("/dashboard");
    }

    const feedbacks = await db.feedback.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Suporte e Feedback</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie as mensagens enviadas pelos usuários.
                </p>
            </div>

            <div className="grid gap-4">
                {feedbacks.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            Nenhum feedback recebido ainda.
                        </CardContent>
                    </Card>
                ) : (
                    feedbacks.map((feedback) => (
                        <Card key={feedback.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-medium">
                                        {feedback.user.name || "Usuário sem nome"}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {feedback.user.email}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={feedback.type === 'BUG' ? 'destructive' : 'default'}>
                                        {feedback.type}
                                    </Badge>
                                    <Badge variant="outline">
                                        {feedback.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mt-2 whitespace-pre-wrap">{feedback.message}</p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Enviado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(feedback.createdAt)}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
