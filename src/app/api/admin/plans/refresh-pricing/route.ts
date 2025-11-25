import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST() {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch plans from Clerk
        let clerkPlans: any[] = [];
        try {
            const plansResponse = await clerkClient.subscriptionPlans.list();
            clerkPlans = plansResponse.data || [];
        } catch (error) {
            console.warn("[ADMIN_REFRESH_PRICING] Clerk plans not available:", error);
            // Continue even if Clerk doesn't have plans configured
        }

        let updated = 0;
        let missingInDb = 0;

        // Update pricing for existing plans
        for (const clerkPlan of clerkPlans) {
            const existingPlan = await prisma.plan.findUnique({
                where: { clerkId: clerkPlan.id },
            });

            if (existingPlan) {
                // Extract pricing from Clerk plan
                const monthlyPrice = clerkPlan.prices?.find(
                    (p: any) => p.recurring?.interval === 'month' && p.recurring?.interval_count === 1
                );
                const yearlyPrice = clerkPlan.prices?.find(
                    (p: any) => p.recurring?.interval === 'year' && p.recurring?.interval_count === 1
                );

                await prisma.plan.update({
                    where: { clerkId: clerkPlan.id },
                    data: {
                        priceMonthlyCents: monthlyPrice?.unit_amount ?? null,
                        priceYearlyCents: yearlyPrice?.unit_amount ?? null,
                        currency: monthlyPrice?.currency || yearlyPrice?.currency || 'brl',
                        clerkName: clerkPlan.name || existingPlan.clerkName,
                    },
                });

                updated++;
            } else {
                missingInDb++;
            }
        }

        return NextResponse.json({
            success: true,
            updated,
            missingInDb,
            message: `Preços atualizados: ${updated} planos. ${missingInDb} planos do Clerk não encontrados no DB.`,
        });
    } catch (error) {
        console.error("[ADMIN_REFRESH_PRICING_POST]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
