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
            case "income": return <ArrowUp className="!text-accent-green" />;
            case "expense": return <ArrowDown className="!text-accent-red" />;
            case "investment": return <TrendingUp className="!text-blue-400" />;
            case "misc": return <Receipt className="!text-yellow-400" />;
        }
    };

    const getAmountColor = (type: Transaction["type"]) => {
        switch (type) {
            case "income": return "!text-accent-green";
            case "expense": return "!text-accent-red";
            case "investment": return "!text-blue-400";
            case "misc": return "!text-yellow-400";
        }
    };

    const getAmountPrefix = (type: Transaction["type"]) => {
        return type === "income" ? "+ " : "- ";
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Transações Recentes</h3>
            <div className="flex flex-col gap-3">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4">
                        <div className="flex shrink-0 size-10 items-center justify-center rounded-full bg-muted">
                            {getIcon(tx.type)}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">{tx.description}</p>
                        </div>
                        <p className={cn("font-bold text-base", getAmountColor(tx.type))}>
                            {getAmountPrefix(tx.type)}{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(tx.amount))}
                        </p>
                    </div>
                ))}
                {transactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhuma transação recente.
                    </div>
                )}
            </div>
        </div>
    );
}
