import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialTotals, formatCurrency } from "@/lib/finance-utils";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, WalletIcon } from "lucide-react";

interface SummaryCardsProps {
    totals: FinancialTotals;
}

export function SummaryCards({ totals }: SummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card de Receita - borda verde */}
            <Card className="border-accent-green/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <ArrowUpIcon className="h-4 w-4 text-accent-green" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-accent-green">{formatCurrency(totals.totalIncome)}</div>
                    <p className="text-xs text-muted-foreground">
                        +0% em relação ao mês passado
                    </p>
                </CardContent>
            </Card>

            {/* Card de Despesa - borda vermelha */}
            <Card className="border-accent-red/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
                    <ArrowDownIcon className="h-4 w-4 text-accent-red" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-accent-red">{formatCurrency(totals.totalExpense)}</div>
                    <p className="text-xs text-muted-foreground">
                        Inclui investimentos e gastos avulsos
                    </p>
                </CardContent>
            </Card>

            {/* Card de Investimentos - borda azul */}
            <Card className="border-accent-blue/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
                    <DollarSignIcon className="h-4 w-4 text-accent-blue" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-accent-blue">{formatCurrency(totals.totalInvestment)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total investido este mês
                    </p>
                </CardContent>
            </Card>

            {/* Card de Saldo - borda roxa */}
            <Card className="border-purple-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
                    <WalletIcon className="h-4 w-4 text-purple-primary" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-purple-primary' : 'text-accent-red'}`}>
                        {formatCurrency(totals.balance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Disponível após despesas
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
