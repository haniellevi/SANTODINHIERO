import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const plans = await prisma.plan.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Parse features JSON
        const formattedPlans = plans.map((plan) => ({
            ...plan,
            features: plan.features ? JSON.parse(plan.features) : null,
        }));

        return NextResponse.json({ plans: formattedPlans });
    } catch (error) {
        console.error("[ADMIN_PLANS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const plan = await prisma.plan.create({
            data: {
                clerkId: body.clerkId || null,
                billingSource: body.billingSource || 'clerk',
                name: body.name,
                clerkName: body.clerkName || null,
                currency: body.currency || 'brl',
                priceMonthlyCents: body.priceMonthlyCents || null,
                priceYearlyCents: body.priceYearlyCents || null,
                description: body.description || null,
                features: body.features ? JSON.stringify(body.features) : null,
                badge: body.badge || null,
                highlight: body.highlight ?? false,
                ctaType: body.ctaType || 'checkout',
                ctaLabel: body.ctaLabel || null,
                ctaUrl: body.ctaUrl || null,
                active: body.active ?? true,
            },
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error("[ADMIN_PLANS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
