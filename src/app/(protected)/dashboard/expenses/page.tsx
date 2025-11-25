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
    const totalInvestment = currentMonth.investments.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalMisc = currentMonth.miscExpenses.reduce((sum, m) => sum + Number(m.amount), 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Saídas</h1>
                <AddExpenseDialog monthId={currentMonth.id} />
            </div>

            <ExpenseList
                expenses={currentMonth.expenses}
                titheAmount={titheAmount}
                totalInvestment={totalInvestment}
                totalMisc={totalMisc}
            />
        </div>
    );
}
