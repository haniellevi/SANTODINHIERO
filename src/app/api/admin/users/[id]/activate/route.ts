import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Reactivate user: set isActive to true
        const activatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: true },
        });

        return NextResponse.json(activatedUser);
    } catch (error) {
        console.error("[ADMIN_USER_ACTIVATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
