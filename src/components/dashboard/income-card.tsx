import { ArrowUpCircle } from "lucide-react";

interface IncomeCardProps {
    total: number;
}

export function IncomeCard({ total }: IncomeCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <ArrowUpCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Entradas</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-500">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
            </div>
        </div>
    );
}
