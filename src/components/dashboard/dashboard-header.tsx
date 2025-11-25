interface DashboardHeaderProps {
    userFirstName?: string | null;
}

export function DashboardHeader({ userFirstName }: DashboardHeaderProps) {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
                Olá, {userFirstName || "Visitante"} 👋
            </h1>
            <p className="text-muted-foreground capitalize">
                Visão geral de {monthName} de {year}
            </p>
        </div>
    );
}
