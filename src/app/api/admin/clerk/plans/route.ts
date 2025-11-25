import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch plans from Clerk
        // Note: Clerk's API for plans may vary depending on your setup
        // This is a basic implementation that may need adjustment
        const plans = await clerkClient.subscriptionPlans.list();

        const normalizedPlans = plans.data.map((plan: any) => ({
            id: plan.id,
            name: plan.name || plan.slug,
            slug: plan.slug,
            prices: plan.prices?.map((price: any) => ({
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                recurring: price.recurring ? {
                    interval: price.recurring.interval,
                    interval_count: price.recurring.interval_count,
                } : null,
            })) || [],
        }));

        return NextResponse.json({ plans: normalizedPlans });
    } catch (error) {
        console.error("[ADMIN_CLERK_PLANS_GET]", error);

        // If Clerk doesn't have subscription plans configured, return empty array
        if (error instanceof Error && error.message.includes("not found")) {
            return NextResponse.json({ plans: [] });
        }

        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
