import { MonthWithDetails } from "./queries/finance";
import { ExpenseType } from "@prisma/client";

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
    const totalExpense = month.expenses.reduce((acc, item) => acc + Number(item.totalAmount), 0);

    const balance = totalIncome - totalExpense;
    const titheAmount = totalIncome * 0.1;

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
