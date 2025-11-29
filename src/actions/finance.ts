"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ExpenseType } from "@prisma/client";
import { z } from "zod";

// Schemas for validation
const IncomeSchema = z.object({
    monthId: z.string(),
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

const ExpenseSchema = z.object({
    monthId: z.string(),
    description: z.string().min(1, "Descrição é obrigatória"),
    totalAmount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    paidAmount: z.coerce.number().default(0),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
    type: z.nativeEnum(ExpenseType).default(ExpenseType.STANDARD),
});

const InvestmentSchema = z.object({
    monthId: z.string(),
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

const MiscExpenseSchema = z.object({
    monthId: z.string(),
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

export async function createIncome(formData: FormData) {
    const rawData = {
        monthId: formData.get("monthId"),
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = IncomeSchema.parse(rawData);

    await prisma.income.create({
        data: {
            monthId: validated.monthId,
            description: validated.description,
            amount: validated.amount,
            dayOfMonth: validated.dayOfMonth,
        },
    });

    revalidatePath("/dashboard");
}

export async function createExpense(formData: FormData) {
    const rawData = {
        monthId: formData.get("monthId"),
        description: formData.get("description"),
        totalAmount: formData.get("amount"), // Using 'amount' field name from form for totalAmount
        paidAmount: formData.get("paidAmount") || 0,
        dayOfMonth: formData.get("dayOfMonth") || undefined,
        type: formData.get("type") || ExpenseType.STANDARD,
    };

    const validated = ExpenseSchema.parse(rawData);

    await prisma.expense.create({
        data: {
            monthId: validated.monthId,
            description: validated.description,
            totalAmount: validated.totalAmount,
            paidAmount: validated.paidAmount,
            dayOfMonth: validated.dayOfMonth,
            type: validated.type,
        },
    });

    revalidatePath("/dashboard");
}

export async function createInvestment(formData: FormData) {
    const rawData = {
        monthId: formData.get("monthId"),
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = InvestmentSchema.parse(rawData);

    await prisma.investment.create({
        data: {
            monthId: validated.monthId,
            description: validated.description,
            amount: validated.amount,
            dayOfMonth: validated.dayOfMonth,
        },
    });

    revalidatePath("/dashboard");
}

export async function createMiscExpense(formData: FormData) {
    const rawData = {
        monthId: formData.get("monthId"),
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = MiscExpenseSchema.parse(rawData);

    await prisma.miscExpense.create({
        data: {
            monthId: validated.monthId,
            description: validated.description,
            amount: validated.amount,
            dayOfMonth: validated.dayOfMonth,
        },
    });

    revalidatePath("/dashboard");
}

export async function deleteItem(id: string, type: 'income' | 'expense' | 'investment' | 'misc') {
    switch (type) {
        case 'income':
            await prisma.income.delete({ where: { id } });
            break;
        case 'expense':
            await prisma.expense.delete({ where: { id } });
            break;
        case 'investment':
            await prisma.investment.delete({ where: { id } });
            break;
        case 'misc':
            await prisma.miscExpense.delete({ where: { id } });
            break;
    }
    revalidatePath("/dashboard");
}

export async function updateItemOrder(
    items: { id: string; order: number }[],
    type: 'income' | 'expense' | 'investment' | 'misc'
) {
    const updates = items.map((item) => {
        switch (type) {
            case 'income':
                return prisma.income.update({
                    where: { id: item.id },
                    data: { order: item.order },
                });
            case 'expense':
                return prisma.expense.update({
                    where: { id: item.id },
                    data: { order: item.order },
                });
            case 'investment':
                return prisma.investment.update({
                    where: { id: item.id },
                    data: { order: item.order },
                });
            case 'misc':
                return prisma.miscExpense.update({
                    where: { id: item.id },
                    data: { order: item.order },
                });
        }
    });

    await prisma.$transaction(updates);
    revalidatePath("/dashboard");
}

// Update schemas (without monthId since we're updating existing items)
const UpdateIncomeSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

const UpdateExpenseSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    totalAmount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    paidAmount: z.coerce.number().default(0),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

const UpdateInvestmentSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

const UpdateMiscExpenseSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
});

// Update actions
export async function updateIncome(id: string, formData: FormData) {
    const rawData = {
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = UpdateIncomeSchema.parse(rawData);

    await prisma.income.update({
        where: { id },
        data: validated,
    });

    revalidatePath("/dashboard");
}

export async function updateExpense(id: string, formData: FormData) {
    const rawData = {
        description: formData.get("description"),
        totalAmount: formData.get("totalAmount"),
        paidAmount: formData.get("paidAmount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = UpdateExpenseSchema.parse(rawData);

    await prisma.expense.update({
        where: { id },
        data: validated,
    });

    revalidatePath("/dashboard");
}

export async function updateInvestment(id: string, formData: FormData) {
    const rawData = {
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = UpdateInvestmentSchema.parse(rawData);

    await prisma.investment.update({
        where: { id },
        data: validated,
    });

    revalidatePath("/dashboard");
}

export async function updateMiscExpense(id: string, formData: FormData) {
    const rawData = {
        description: formData.get("description"),
        amount: formData.get("amount"),
        dayOfMonth: formData.get("dayOfMonth") || undefined,
    };

    const validated = UpdateMiscExpenseSchema.parse(rawData);

    await prisma.miscExpense.update({
        where: { id },
        data: validated,
    });

    revalidatePath("/dashboard");
}

const DuplicateMonthSchema = z.object({
    userId: z.string(),
    sourceMonth: z.coerce.number().min(1).max(12),
    sourceYear: z.coerce.number(),
});

export async function duplicateMonth(formData: FormData) {
    const rawData = {
        userId: formData.get("userId"),
        sourceMonth: formData.get("sourceMonth"),
        sourceYear: formData.get("sourceYear"),
    };

    const validated = DuplicateMonthSchema.parse(rawData);

    // Calculate next month
    const nextMonth = validated.sourceMonth === 12 ? 1 : validated.sourceMonth + 1;
    const nextYear = validated.sourceMonth === 12 ? validated.sourceYear + 1 : validated.sourceYear;

    // Check if next month already exists
    const existingMonth = await prisma.month.findUnique({
        where: {
            userId_month_year: {
                userId: validated.userId,
                month: nextMonth,
                year: nextYear,
            },
        },
    });

    if (existingMonth) {
        throw new Error("O próximo mês já foi criado!");
    }

    // Get source month with all data
    const sourceMonthData = await prisma.month.findUnique({
        where: {
            userId_month_year: {
                userId: validated.userId,
                month: validated.sourceMonth,
                year: validated.sourceYear,
            },
        },
        include: {
            incomes: true,
            expenses: { where: { type: ExpenseType.STANDARD } }, // Only copy standard expenses
            investments: true,
            miscExpenses: false, // Don't copy misc expenses
        },
    });

    if (!sourceMonthData) {
        throw new Error("Mês de origem não encontrado!");
    }

    // Create new month with duplicated data
    await prisma.month.create({
        data: {
            userId: validated.userId,
            month: nextMonth,
            year: nextYear,
            incomes: {
                create: sourceMonthData.incomes.map((income) => ({
                    description: income.description,
                    amount: income.amount,
                    dayOfMonth: income.dayOfMonth,
                    order: income.order,
                })),
            },
            expenses: {
                create: sourceMonthData.expenses.map((expense) => ({
                    description: expense.description,
                    totalAmount: expense.totalAmount,
                    paidAmount: 0, // Reset paid amount
                    dayOfMonth: expense.dayOfMonth,
                    type: expense.type,
                    order: expense.order,
                })),
            },
            investments: {
                create: sourceMonthData.investments.map((investment) => ({
                    description: investment.description,
                    amount: investment.amount,
                    dayOfMonth: investment.dayOfMonth,
                    order: investment.order,
                })),
            },
        },
    });

    revalidatePath("/dashboard");
}


// Toggle status actions
export async function toggleIncomeReceived(id: string, isReceived: boolean) {
    await prisma.income.update({
        where: { id },
        data: { isReceived },
    });
    revalidatePath("/dashboard");
}

export async function toggleExpensePaid(id: string, isPaid: boolean) {
    // Get the expense to access totalAmount
    const expense = await prisma.expense.findUnique({
        where: { id },
        select: { totalAmount: true, paidAmount: true },
    });

    if (!expense) {
        throw new Error("Despesa não encontrada");
    }

    // When marking as paid, set paidAmount to totalAmount
    // When unmarking, set paidAmount to 0
    await prisma.expense.update({
        where: { id },
        data: {
            isPaid,
            paidAmount: isPaid ? expense.totalAmount : 0,
        },
    });
    revalidatePath("/dashboard");
}

export async function toggleTithePaid(monthId: string, isPaid: boolean) {
    const month = await prisma.month.findUnique({
        where: { id: monthId },
        include: { incomes: true }
    });

    if (!month) throw new Error("Mês não encontrado");

    const totalIncome = month.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const titheAmount = totalIncome * 0.1;

    await prisma.month.update({
        where: { id: monthId },
        data: {
            isTithePaid: isPaid,
            tithePaidAmount: isPaid ? titheAmount : 0
        }
    });

    revalidatePath("/dashboard");
}

export async function toggleInvestmentPaid(id: string, isPaid: boolean) {
    await prisma.investment.update({
        where: { id },
        data: { isPaid },
    });
    revalidatePath("/dashboard");
}

export async function toggleMiscExpensePaid(id: string, isPaid: boolean) {
    await prisma.miscExpense.update({
        where: { id },
        data: { isPaid },
    });
    revalidatePath("/dashboard");
}


export async function toggleIncomeTithePaid(incomeId: string, isTithePaid: boolean) {
    await prisma.income.update({
        where: { id: incomeId },
        data: { isTithePaid },
    });
    revalidatePath("/dashboard");
}

export async function deleteMonth(formData: FormData) {
    const userId = formData.get("userId") as string;
    const month = parseInt(formData.get("month") as string);
    const year = parseInt(formData.get("year") as string);

    if (!userId || !month || !year) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.month.delete({
            where: {
                userId_month_year: {
                    userId,
                    month,
                    year,
                },
            },
        });

        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error deleting month:", error);
        throw new Error("Failed to delete month");
    }
}
