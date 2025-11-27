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


    const totals = calculateTotals(currentMonth);

    const currentDay = new Date().getDate();

    // Predicted Balance:
    // "O saldo do dia é o previsto para aquela data levando em consideração o dia de cada ação"
    // Sum of Incomes (scheduled <= today) - Sum of Outflows (scheduled <= today)
    // Regardless of paid status, as it is a "prediction" based on schedule.

    const predictedIncomes = currentMonth.incomes
      .filter(i => (i.dayOfMonth || 32) <= currentDay)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const predictedExpenses = currentMonth.expenses
      .filter(e => (e.dayOfMonth || 32) <= currentDay && (e.type === "STANDARD" || e.type === "TITHE"))
      .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    const predictedInvestments = currentMonth.investments
      .filter(i => (i.dayOfMonth || 32) <= currentDay)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const predictedMisc = currentMonth.miscExpenses
      .filter(m => (m.dayOfMonth || 32) <= currentDay)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const predictedBalance = predictedIncomes - (predictedExpenses + predictedInvestments + predictedMisc);

    // Combine transactions - use updatedAt to show recent pay/receive actions
    const transactions: Transaction[] = [
      ...currentMonth.incomes.map(i => ({ id: i.id, type: "income" as const, description: i.description, amount: Number(i.amount), date: i.updatedAt })),
      ...currentMonth.expenses.map(e => ({ id: e.id, type: "expense" as const, description: e.description, amount: Number(e.totalAmount), date: e.updatedAt })),
      ...currentMonth.investments.map(i => ({ id: i.id, type: "investment" as const, description: i.description, amount: Number(i.amount), date: i.updatedAt })),
      ...currentMonth.miscExpenses.map(m => ({ id: m.id, type: "misc" as const, description: m.description, amount: Number(m.amount), date: m.updatedAt })),
    ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 10); // Show last 10

    const currentDate = new Date(year, month - 1);

    return (
      <div className="flex min-h-screen flex-col gap-6 pb-32 pt-4 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <MonthNavigationHeader currentDate={currentDate} availableMonths={availableMonths} />

        <div className="flex flex-col items-center justify-center py-8">
          <h1 className={`text-5xl font-bold tracking-tighter ${totals.balance > 0 ? "text-emerald-500" : totals.balance < 0 ? "text-red-500" : "text-foreground"}`}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.balance)}
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">Saldo do Mês</p>

          <div className={`mt-6 px-6 py-3 rounded-full border backdrop-blur-sm ${predictedBalance >= 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
            <p className="text-sm font-semibold tracking-wide">
              HOJE É DIA {currentDay} — SEU SALDO PREVISTO É {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(predictedBalance)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <IncomeCard total={totals.totalIncome} />
          <ExpenseCard total={totals.totalExpense} />
        </div>

        <div className="w-full">
          <MonthPlanningAlert currentYear={year} currentMonth={month} userId={dbUser.id} />
        </div>

        <div className="mt-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/20 p-1 rounded-xl">
              <TabsTrigger
                value="upcoming"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all"
              >
                Próximas
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all"
              >
                Recentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-2">
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

            <TabsContent value="pending" className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-2">
              <RecentTransactionsList transactions={transactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }