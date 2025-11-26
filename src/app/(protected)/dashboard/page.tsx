import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMonthByDate, getUserMonths } from "@/lib/queries/finance";
import { calculateTotals } from "@/lib/finance-utils";
import { getUserFromClerkId } from "@/lib/auth-utils";
import { MonthNavigationHeader } from "@/components/dashboard/month-navigation-header";
import { IncomeCard } from "@/components/dashboard/income-card";
import { ExpenseCard } from "@/components/dashboard/expense-card";
import { MonthPlanningAlert } from "@/components/dashboard/month-planning-alert";
import { RecentTransactionsList, Transaction } from "@/components/dashboard/recent-transactions-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingActionsList } from "@/components/dashboard/upcoming-actions-list";

import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard Financeiro",
  description: "Visão geral das suas finanças",
};

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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

  // Get all available months for navigation
  const availableMonths = await getUserMonths(dbUser.id);

  // Check if requested month exists
  const currentMonth = await getMonthByDate(dbUser.id, month, year);

  // If no months exist at all, create ONLY the current month
  if (availableMonths.length === 0) {
    const currentMonthNow = now.getMonth() + 1;
    const currentYearNow = now.getFullYear();

    await prisma.month.create({
      data: {
        userId: dbUser.id,
        month: currentMonthNow,
        year: currentYearNow,
      },
    });

    // Redirect to current month
    redirect(`/dashboard?month=${currentMonthNow}&year=${currentYearNow}`);
  }

  // If month doesn't exist, redirect to the most recent month
  if (!currentMonth) {
    const latestMonth = availableMonths[availableMonths.length - 1];
    redirect(`/dashboard?month=${latestMonth.month}&year=${latestMonth.year}`);
  }

  const totals = calculateTotals(currentMonth);

  // Combine transactions
  const transactions: Transaction[] = [
    ...currentMonth.incomes.map(i => ({ id: i.id, type: "income" as const, description: i.description, amount: Number(i.amount), date: i.createdAt })),
    ...currentMonth.expenses.map(e => ({ id: e.id, type: "expense" as const, description: e.description, amount: Number(e.totalAmount), date: e.createdAt })),
    ...currentMonth.investments.map(i => ({ id: i.id, type: "investment" as const, description: i.description, amount: Number(i.amount), date: i.createdAt })),
    ...currentMonth.miscExpenses.map(m => ({ id: m.id, type: "misc" as const, description: m.description, amount: Number(m.amount), date: m.createdAt })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 10); // Show last 10

  const currentDate = new Date(year, month - 1);

  return (
    <div className="flex flex-col pb-32 px-4">
      <MonthNavigationHeader currentDate={currentDate} availableMonths={availableMonths} />

      <div className="text-center pt-6 pb-3">
        <h1 className={`text-[40px] font-bold tracking-tight leading-tight ${totals.balance > 0 ? "text-emerald-500" : totals.balance < 0 ? "text-red-500" : ""}`}>
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.balance)}
        </h1>
        <p className="text-muted-foreground text-sm font-normal leading-normal pt-1">Saldo do Mês</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6">
        <IncomeCard total={totals.totalIncome} />
        <ExpenseCard total={totals.totalExpense} />
      </div>

      <div className="mt-4">
        <MonthPlanningAlert currentYear={year} currentMonth={month} userId={dbUser.id} />
      </div>

      <div className="pt-6 pb-28">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Próximas Ações Previstas</TabsTrigger>
            <TabsTrigger value="pending">Transações Recentes</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <UpcomingActionsList
              actions={[
                ...currentMonth.incomes.map(i => ({
                  id: i.id,
                  type: "income" as const,
                  description: i.description,
                  amount: Number(i.amount),
                  dayOfMonth: i.dayOfMonth
                })),
                ...currentMonth.expenses
                  .filter(e => Number(e.paidAmount) < Number(e.totalAmount)) // Only pending/partial expenses
                  .map(e => ({
                    id: e.id,
                    type: "expense" as const,
                    description: e.description,
                    amount: Number(e.totalAmount) - Number(e.paidAmount), // Remaining amount
                    dayOfMonth: e.dayOfMonth,
                    status: Number(e.paidAmount) > 0 ? "partial" as const : "pending" as const
                  })),
                ...currentMonth.investments.map(i => ({
                  id: i.id,
                  type: "investment" as const,
                  description: i.description,
                  amount: Number(i.amount),
                  dayOfMonth: i.dayOfMonth
                }))
              ]}
              currentMonth={month}
              currentYear={year}
            />
          </TabsContent>

          <TabsContent value="pending">
            <RecentTransactionsList transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}