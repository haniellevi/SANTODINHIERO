import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateMonth } from "@/lib/queries/finance";
import { getUserFromClerkId } from "@/lib/auth-utils";
import { IncomeList } from "@/components/dashboard/income-list";
import { AddIncomeDialog } from "@/components/dashboard/add-income-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Entradas - Santo Dinheiro",
    description: "Gerencie suas entradas mensais",
};

interface IncomesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function IncomesPage({ searchParams }: IncomesPageProps) {
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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Entradas</h1>
                <AddIncomeDialog monthId={currentMonth.id} />
            </div>

            <IncomeList incomes={currentMonth.incomes} />
        </div>
    );
}
