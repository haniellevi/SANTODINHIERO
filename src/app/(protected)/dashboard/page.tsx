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
import { ReceiptSummary } from "@/components/dashboard/receipt-summary";
import { getNextMonth, getMonthName } from "@/lib/month-utils";
import { ExpenseType } from "@prisma/client";

import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard Financeiro",
  description: "Visão geral das suas finanças",
};

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  console.log("--- DEBUG LOG INÍCIO ---");
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const dbUser = await getUserFromClerkId(clerkUser.id);
  console.log('[Dashboard] User found:', dbUser.id);

  const params = await searchParams;

  const now = new Date();
  console.log(`[Dashboard Debug] Raw Date: ${now.toISOString()}`);
  console.log(`[Dashboard Debug] now.getMonth(): ${now.getMonth()}`);
  console.log(`[Dashboard Debug] now.getFullYear(): ${now.getFullYear()}`);
  const monthParam = params?.month;
  const yearParam = params?.year;
  console.log(`[Dashboard Debug] monthParam: ${monthParam}`);
  console.log(`[Dashboard Debug] yearParam: ${yearParam}`);

  const month = monthParam ? parseInt(monthParam as string) : now.getMonth() + 1;
  const year = yearParam ? parseInt(yearParam as string) : now.getFullYear();
  console.log(`[Dashboard Debug] Resolved Month: ${month}`);
  console.log(`[Dashboard Debug] Resolved Year: ${year}`);

  // Get all available months for navigation
  console.log('[Dashboard] Fetching user months...');
  const availableMonths = await getUserMonths(dbUser.id);
  console.log('[Dashboard] Available months:', availableMonths.length);
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

  // Check if requested month exists
  console.log(`[Dashboard] Fetching month ${month}/${year}...`);
  const currentMonth = await getMonthByDate(dbUser.id, month, year);
  console.log('[Dashboard] Month found:', !!currentMonth);

  // If month doesn't exist, check if it's the current real-time month
  if (!currentMonth) {
    const isCurrentRealTimeMonth = month === now.getMonth() + 1 && year === now.getFullYear();

    if (isCurrentRealTimeMonth) {
      console.log('[Dashboard] Current month missing. Attempting auto-duplication...');

      // Calculate previous month
      const prevMonthDate = month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year: year };

      // Check if previous month exists
      const prevMonth = await prisma.month.findUnique({
        where: {
          userId_month_year: {
            userId: dbUser.id,
            month: prevMonthDate.month,
            year: prevMonthDate.year,
          },
        },
        include: {
          incomes: true,
          expenses: { where: { type: ExpenseType.STANDARD } },
          investments: true,
        },
      });

      if (prevMonth) {
        console.log('[Dashboard] Previous month found. Duplicating...');
        // Duplicate previous month
        await prisma.month.create({
          data: {
            userId: dbUser.id,
            month: month,
            year: year,
            incomes: {
              create: prevMonth.incomes.map((income) => ({
                description: income.description,
                amount: income.amount,
                dayOfMonth: income.dayOfMonth,
                order: income.order,
                isReceived: false, // Reset status
                isTithePaid: false, // Reset status
              })),
            },
            expenses: {
              create: prevMonth.expenses.map((expense) => ({
                description: expense.description,
                totalAmount: expense.totalAmount,
                paidAmount: 0, // Reset paid amount
                dayOfMonth: expense.dayOfMonth,
                type: expense.type,
                order: expense.order,
                isPaid: false, // Reset status
              })),
            },
            investments: {
              create: prevMonth.investments.map((investment) => ({
                description: investment.description,
                amount: investment.amount,
                dayOfMonth: investment.dayOfMonth,
                order: investment.order,
                isPaid: false, // Reset status
              })),
            },
          },
        });
      } else {
        console.log('[Dashboard] Previous month not found. Creating empty month...');
        // Create empty month
        await prisma.month.create({
          data: {
            userId: dbUser.id,
            month: month,
            year: year,
          },
        });
      }

      // Redirect to self to load the new data
      redirect(`/dashboard?month=${month}&year=${year}`);
    } else {
      // If it's not the current month, redirect to the most recent existing month
      const latestMonth = availableMonths[availableMonths.length - 1];
      redirect(`/dashboard?month=${latestMonth.month}&year=${latestMonth.year}`);
    }
  }

  // Check if next month exists for planning alert logic
  const nextMonthDate = getNextMonth(year, month);
  const nextMonthExists = await prisma.month.findFirst({
    where: {
      userId: dbUser.id,
      month: nextMonthDate.month,
      year: nextMonthDate.year
    }
  });

  // Ensure current month is in availableMonths (for dialog and navigation consistency)
  if (currentMonth) {
    const isInList = availableMonths.some(m => m.month === month && m.year === year);
    if (!isInList) {
      availableMonths.push({ month, year });
      // Re-sort availableMonths
      availableMonths.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
    }
  }

  const totals = calculateTotals(currentMonth);

  const currentDay = new Date().getDate();

  // Predicted Balance:
  // "O saldo do dia é o previsto para aquela data levando em consideração o dia de cada ação"
  // Sum of Incomes (scheduled <= today) - Sum of Outflows (scheduled <= today)
  // Regardless of paid status, as it is a "prediction" based on schedule.

  const predictedIncomes = currentMonth.incomes
    .filter(i => (i.dayOfMonth || 32) <= currentDay || i.isReceived)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const predictedExpenses = currentMonth.expenses
    .filter(e => ((e.dayOfMonth || 32) <= currentDay || Number(e.paidAmount) > 0) && (e.type === "STANDARD" || e.type === "TITHE"))
    .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

  const predictedInvestments = currentMonth.investments
    .filter(i => (i.dayOfMonth || 32) <= currentDay || i.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const predictedMisc = currentMonth.miscExpenses
    .filter(m => (m.dayOfMonth || 32) <= currentDay || m.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const predictedBalance = predictedIncomes - (predictedExpenses + predictedInvestments + predictedMisc);

  // Cálculos detalhados para o ReceiptSummary
  const incomesReceived = currentMonth.incomes
    .filter(i => i.isReceived)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const incomesRemainingTotal = currentMonth.incomes
    .filter(i => !i.isReceived && (i.dayOfMonth || 32) > currentDay)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expensesPaid = currentMonth.expenses
    .filter(e => (e.dayOfMonth || 32) <= currentDay && (e.type === "STANDARD" || e.type === "TITHE"))
    .reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
  const expensesRemainingTotal = currentMonth.expenses
    .filter(e => (e.dayOfMonth || 32) > currentDay && (e.type === "STANDARD" || e.type === "TITHE"))
    .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

  const investmentsPaid = currentMonth.investments
    .filter(i => i.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const investmentsRemainingTotal = currentMonth.investments
    .filter(i => !i.isPaid && (i.dayOfMonth || 32) > currentDay)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const miscPaid = currentMonth.miscExpenses
    .filter(m => m.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const miscRemainingTotal = currentMonth.miscExpenses
    .filter(m => !m.isPaid && (m.dayOfMonth || 32) > currentDay)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Cálculos para a aba de Resumo do Dia
  const titheAmount = totals.titheAmount;

  // Incomes - valores até hoje, recebidos e restantes
  const totalIncomesReceived = currentMonth.incomes
    .filter(i => i.isReceived)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalIncomesRemaining = predictedIncomes - totalIncomesReceived;
  const totalIncomesOverall = currentMonth.incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Expenses - valores até hoje, pagos e restantes (incluindo dízimo)
  const totalExpensesPaidOnly = currentMonth.expenses
    .filter(e => (e.dayOfMonth || 32) <= currentDay)
    .reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
  const totalExpensesRemaining = (predictedExpenses + titheAmount) - (totalExpensesPaidOnly + (currentMonth.isTithePaid ? titheAmount : 0));
  const totalExpensesOverall = currentMonth.expenses.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

  // Investments - valores até hoje, pagos e restantes
  const totalInvestmentsPaid = currentMonth.investments
    .filter(i => (i.dayOfMonth || 32) <= currentDay && i.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalInvestmentsRemaining = predictedInvestments - totalInvestmentsPaid;
  const totalInvestmentsOverall = currentMonth.investments.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Misc Expenses - valores até hoje, pagos e restantes
  const totalMiscPaid = currentMonth.miscExpenses
    .filter(m => (m.dayOfMonth || 32) <= currentDay && m.isPaid)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalMiscRemaining = predictedMisc - totalMiscPaid;
  const totalMiscOverall = currentMonth.miscExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const nextUpcomingIncome = currentMonth.incomes
    .filter(i => (i.dayOfMonth || 0) > currentDay && !i.isReceived)
    .sort((a, b) => (a.dayOfMonth || 32) - (b.dayOfMonth || 32))
    .at(0); // get the first one

  // Combine transactions - use updatedAt to show recent pay/receive actions
  const transactions: Transaction[] = [
    ...currentMonth.incomes.map(i => ({ id: i.id, type: "income" as const, description: i.description, amount: Number(i.amount), date: i.updatedAt })),
    ...currentMonth.expenses.map(e => ({ id: e.id, type: "expense" as const, description: e.description, amount: Number(e.totalAmount), date: e.updatedAt })),
    ...currentMonth.investments.map(i => ({ id: i.id, type: "investment" as const, description: i.description, amount: Number(i.amount), date: i.updatedAt })),
    ...currentMonth.miscExpenses.map(m => ({ id: m.id, type: "misc" as const, description: m.description, amount: Number(m.amount), date: m.updatedAt })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-center space-y-2">
        <div className="flex items-center space-x-2">
          <MonthNavigationHeader
            currentMonth={month}
            currentYear={year}
            availableMonths={availableMonths}
            userId={dbUser.id}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <IncomeCard total={totals.totalIncome} />
        <ExpenseCard total={totals.totalExpense} />
      </div>

      <div className="w-full">
        <MonthPlanningAlert
          currentYear={year}
          currentMonth={month}
          userId={dbUser.id}
          planningAlertDays={dbUser.planningAlertDays}
          nextMonthExists={!!nextMonthExists}
        />
      </div>

      <div className="mt-2">
        <Tabs defaultValue="prediction" className="w-full flex flex-col items-center">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/20 p-1 rounded-xl md:w-auto md:inline-flex md:mx-auto">
            <TabsTrigger
              value="prediction"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all px-6"
            >
              Resumo do Dia
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all px-6"
            >
              Próximas
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all px-6"
            >
              Recentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-2">
            <ReceiptSummary
              userName={dbUser.name?.split(" ")[0] || "Usuário"}
              currentDay={currentDay}
              incomesUpToToday={predictedIncomes}
              incomesReceived={incomesReceived}
              incomesRemaining={incomesRemainingTotal}
              expensesUpToToday={predictedExpenses}
              expensesPaid={expensesPaid}
              expensesRemaining={expensesRemainingTotal}
              investmentsUpToToday={predictedInvestments}
              investmentsPaid={investmentsPaid}
              investmentsRemaining={investmentsRemainingTotal}
              miscUpToToday={predictedMisc}
              miscPaid={miscPaid}
              miscRemaining={miscRemainingTotal}
              balance={predictedBalance}
              nextUpcomingIncome={nextUpcomingIncome ? { dayOfMonth: nextUpcomingIncome.dayOfMonth, amount: Number(nextUpcomingIncome.amount) } : undefined}
            />
          </TabsContent>

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
