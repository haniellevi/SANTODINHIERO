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
        <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Entradas</h1>
                    <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
                </div>
                <AddIncomeDialog monthId={currentMonth.id} />
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-1">
                <IncomeList incomes={currentMonth.incomes} />
            </div>
        </div>
    );
}
