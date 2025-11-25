import { ArrowDownCircle } from "lucide-react";

interface ExpenseCardProps {
    total: number;
}

export function ExpenseCard({ total }: ExpenseCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl !bg-accent-red p-4 shadow-sm">
            <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 !text-white" />
                <span className="text-sm font-medium !text-white/90">Saídas</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold !text-white">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
            </div>
        </div>
    );
}
