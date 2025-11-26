import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateMonth } from "@/lib/queries/finance";
import { getUserFromClerkId } from "@/lib/auth-utils";
import { ExpenseList } from "@/components/dashboard/expense-list";
import { AddExpenseDialog } from "@/components/dashboard/add-expense-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Saídas - Santo Dinheiro",
    description: "Gerencie suas saídas mensais",
};

interface ExpensesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/sign-in");
    }

    const dbUser = await getUserFromClerkId(clerkUser.id);
    const params = await searchParams;

    const now = new Date();
    const monthParam = params?.month;
    const yearParam = params?.year;

    const month = monthParam ? parseInt(monthParam as string) : now.getMonth() + 1;
    const year = yearParam ? parseInt(yearParam as string) : now.getFullYear();

    const currentMonth = await getOrCreateMonth(dbUser.id, month, year);

    // Calculate totals for virtual rows
    const totalIncome = currentMonth.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const titheAmount = totalIncome * 0.1;

    // Calculate total and paid amounts for investments
    const totalInvestment = currentMonth.investments.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalInvestmentPaid = currentMonth.investments
        .filter(i => i.isPaid)
        .reduce((sum, i) => sum + Number(i.amount), 0);

    // Calculate total and paid amounts for misc expenses
    const totalMisc = currentMonth.miscExpenses.reduce((sum, m) => sum + Number(m.amount), 0);
    const totalMiscPaid = currentMonth.miscExpenses
        .filter(m => m.isPaid)
        .reduce((sum, m) => sum + Number(m.amount), 0);

    // Convert Decimal to number for Client Component
    const serializedExpenses = currentMonth.expenses.map(expense => ({
        ...expense,
        totalAmount: Number(expense.totalAmount),
        paidAmount: Number(expense.paidAmount),
    }));

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Saídas</h1>
                    <p className="text-muted-foreground mt-1">Gerencie seus gastos mensais</p>
                </div>
                <AddExpenseDialog monthId={currentMonth.id} />
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-1">
                <ExpenseList
                    expenses={serializedExpenses}
                    titheAmount={titheAmount}
                    totalInvestment={totalInvestment}
                    totalInvestmentPaid={totalInvestmentPaid}
                    totalMisc={totalMisc}
                    totalMiscPaid={totalMiscPaid}
                    isTithePaid={currentMonth.isTithePaid}
                    monthId={currentMonth.id}
                />
            </div>
        </div>
    );
}
