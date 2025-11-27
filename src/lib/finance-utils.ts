import { MonthWithDetails } from "./queries/finance";

export type FinancialTotals = {
    totalIncome: number;
    totalExpense: number;
    totalInvestment: number;
    totalMisc: number;
    balance: number;
    titheAmount: number;
};

export function calculateTotals(month: MonthWithDetails | null): FinancialTotals {
    if (!month) {
        return {
            totalIncome: 0,
            totalExpense: 0,
            totalInvestment: 0,
            totalMisc: 0,
            balance: 0,
            titheAmount: 0,
        };
    }

    const totalIncome = month.incomes.reduce((acc, item) => acc + Number(item.amount), 0);

    // Calculate specific totals
    const totalInvestment = month.investments.reduce((acc, item) => acc + Number(item.amount), 0);
    const totalMisc = month.miscExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

    // Calculate expenses based on type to avoid double counting if we have aggregate rows
    // But usually, we sum all expenses in the list. 
    // If TITHE, INVESTMENT_TOTAL, MISC_TOTAL are actual rows in the expense table, we sum them.
    // However, INVESTMENT_TOTAL and MISC_TOTAL are aggregates of other tables.
    // The PRD says: "O total investido aparece automaticamente como uma despesa no quadro principal."
    // So we should sum the 'STANDARD' expenses + Tithe + Investment Total + Misc Total.

    // Let's sum the expenses that are explicitly in the expenses table.
    // Assuming the backend/frontend syncs the aggregate rows, or we calculate them on the fly.
    // For now, let's sum what's in the expenses array.
    const expensesSum = month.expenses.reduce((acc, item) => acc + Number(item.totalAmount), 0);

    // Total Expense for the dashboard should include EVERYTHING that goes out
    // Expenses (Standard + Tithe) + Investments + Misc
    // Note: If 'expenses' array ALREADY includes rows for Investment Total and Misc Total, we would be double counting.
    // Based on previous context, we are REMOVING those aggregate rows from the UI list, so they might not be in the DB as 'Expense' rows anymore, 
    // OR we are just hiding them. 
    // If they are in the DB, we should filter them out or sum carefully.
    // Looking at the schema, ExpenseType has INVESTMENT_TOTAL and MISC_TOTAL.
    // If we rely on the 'expenses' array having these, we sum them. 
    // BUT the plan says "O conta somatoria da saida no dashboard deve ser SAIDA TOTAL (Saida+Investimentos+gastos avulsos)".
    // This implies we should sum them explicitly if they are separate entities.
    // Let's assume 'expenses' contains STANDARD and TITHE. 
    // We should check if 'expenses' contains INVESTMENT_TOTAL or MISC_TOTAL and exclude them if we are adding totalInvestment and totalMisc separately.

    const standardAndTitheExpenses = month.expenses
        .filter(e => e.type === "STANDARD" || e.type === "TITHE")
        .reduce((acc, item) => acc + Number(item.totalAmount), 0);

    const titheAmount = totalIncome * 0.1;
    const totalExpense = standardAndTitheExpenses + totalInvestment + totalMisc + titheAmount;

    const balance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        totalInvestment,
        totalMisc,
        balance,
        titheAmount,
    };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}
