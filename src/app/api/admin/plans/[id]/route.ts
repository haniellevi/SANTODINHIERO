import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = context.params;
        const body = await req.json();

        // Update plan
        const updatedPlan = await prisma.plan.update({
            where: { id },
            data: {
                clerkId: body.clerkId ?? undefined,
                billingSource: body.billingSource ?? undefined,
                name: body.name ?? undefined,
                clerkName: body.clerkName ?? undefined,
                currency: body.currency ?? undefined,
                priceMonthlyCents: body.priceMonthlyCents ?? undefined,
                priceYearlyCents: body.priceYearlyCents ?? undefined,
                description: body.description ?? undefined,
                features: body.features ? JSON.stringify(body.features) : undefined,
                badge: body.badge ?? undefined,
                highlight: body.highlight ?? undefined,
                ctaType: body.ctaType ?? undefined,
                ctaLabel: body.ctaLabel ?? undefined,
                ctaUrl: body.ctaUrl ?? undefined,
                active: body.active ?? undefined,
            },
        });

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error("[ADMIN_PLAN_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = context.params;

        // Delete plan
        await prisma.plan.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_PLAN_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
