import { ArrowUpCircle } from "lucide-react";

interface IncomeCardProps {
    total: number;
}

export function IncomeCard({ total }: IncomeCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl !bg-accent-green p-4 shadow-sm">
            <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 !text-white" />
                <span className="text-sm font-medium !text-white/90">Entradas</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold !text-white">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
            </div>
        </div>
    );
}
