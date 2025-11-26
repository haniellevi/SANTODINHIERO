import { ArrowDownCircle } from "lucide-react";

interface ExpenseCardProps {
    total: number;
}

export function ExpenseCard({ total }: ExpenseCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <ArrowDownCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Saídas</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-500">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
            </div>
        </div>
    );
}
