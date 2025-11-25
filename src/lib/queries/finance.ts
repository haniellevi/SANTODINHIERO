import { prisma } from "@/lib/db";
import { Month, Income, Expense, Investment, MiscExpense } from "../../../prisma/generated/client";

export type MonthWithDetails = Month & {
    incomes: Income[];
    expenses: Expense[];
    investments: Investment[];
    miscExpenses: MiscExpense[];
};

export async function getMonthByDate(userId: string, month: number, year: number) {
    return await prisma.month.findUnique({
        where: {
            userId_month_year: {
                userId,
                month,
                year,
            },
        },
        include: {
            incomes: { orderBy: { order: "asc" } },
            expenses: { orderBy: { order: "asc" } },
            investments: { orderBy: { order: "asc" } },
            miscExpenses: { orderBy: { order: "asc" } },
        },
    });
}

export async function getCurrentMonth(userId: string) {
    const now = new Date();
    return getMonthByDate(userId, now.getMonth() + 1, now.getFullYear());
}

export async function createMonth(userId: string, month: number, year: number) {
    return await prisma.month.create({
        data: {
            userId,
            month,
            year,
        },
        include: {
            incomes: true,
            expenses: true,
            investments: true,
            miscExpenses: true,
        },
    });
}

export async function getOrCreateCurrentMonth(userId: string) {
    const now = new Date();
    return getOrCreateMonth(userId, now.getMonth() + 1, now.getFullYear());
}

export async function getOrCreateMonth(userId: string, month: number, year: number) {
    const existing = await getMonthByDate(userId, month, year);
    if (existing) return existing;

    return await createMonth(userId, month, year);
}

export async function getUserMonths(userId: string) {
    return await prisma.month.findMany({
        where: { userId },
        select: {
            month: true,
            year: true,
        },
        orderBy: [
            { year: "asc" },
            { month: "asc" },
        ],
    });
}
