import { ArrowUp, ArrowDown, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

// Define a unified transaction type for display
export type Transaction = {
    id: string;
    type: "income" | "expense" | "investment" | "misc";
    description: string;
    amount: number;
    date?: Date;
};

interface RecentTransactionsListProps {
    transactions: Transaction[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
    const getIcon = (type: Transaction["type"]) => {
        switch (type) {
            case "income": return <ArrowUp className="text-emerald-500" />;
            case "expense": return <ArrowDown className="text-red-500" />;
            case "investment": return <TrendingUp className="text-blue-400" />;
            case "misc": return <Receipt className="text-yellow-400" />;
        }
    };

    const getAmountColor = (type: Transaction["type"]) => {
        switch (type) {
            case "income": return "text-emerald-500";
            case "expense": return "text-red-500";
            case "investment": return "text-blue-400";
            case "misc": return "text-yellow-400";
        }
    };

    const getAmountPrefix = (type: Transaction["type"]) => {
        return type === "income" ? "+ " : "- ";
    };

    return (
        <div className="flex flex-col">
            <h3 className="mb-4 text-lg font-bold text-white">Transações Recentes</h3>
            <div className="flex flex-col gap-2">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-card/50 p-3 transition-all hover:bg-card hover:border-white/10"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-muted",
                                tx.type === "income" && "bg-emerald-500/10 group-hover:bg-emerald-500/20",
                                tx.type === "expense" && "bg-red-500/10 group-hover:bg-red-500/20",
                                tx.type === "investment" && "bg-blue-500/10 group-hover:bg-blue-500/20",
                                tx.type === "misc" && "bg-yellow-500/10 group-hover:bg-yellow-500/20"
                            )}>
                                {getIcon(tx.type)}
                            </div>
                            <div className="flex flex-col truncate">
                                <p className="truncate text-sm font-semibold text-white/90">{tx.description}</p>
                                <p className="text-xs text-muted-foreground capitalize">{tx.type === "misc" ? "Outros" : tx.type === "income" ? "Entrada" : tx.type === "expense" ? "Saída" : "Investimento"}</p>
                            </div>
                        </div>
                        <p className={cn("whitespace-nowrap font-bold text-sm", getAmountColor(tx.type))}>
                            {getAmountPrefix(tx.type)}{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(tx.amount))}
                        </p>
                    </div>
                ))}
                {transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
                        <p className="text-sm text-muted-foreground">Nenhuma transação recente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
