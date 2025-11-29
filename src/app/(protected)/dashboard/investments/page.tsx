import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateMonth } from "@/lib/queries/finance";
import { getUserFromClerkId } from "@/lib/auth-utils";
import { InvestmentList } from "@/components/dashboard/investment-list";
import { AddInvestmentDialog } from "@/components/dashboard/add-investment-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Investimentos - Santo Dinheiro",
    description: "Gerencie seus investimentos mensais",
};

interface InvestmentsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvestmentsPage({ searchParams }: InvestmentsPageProps) {
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

    // Serialize Decimal objects to numbers for client components
    const serializedInvestments = currentMonth.investments.map(inv => ({
        ...inv,
        amount: Number(inv.amount),
    }));

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
                    <p className="text-muted-foreground">Gerencie seus investimentos mensais</p>
                </div>
                <AddInvestmentDialog monthId={currentMonth.id} />
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-1">
                <InvestmentList investments={serializedInvestments} />
            </div>
        </div>
    );
}
