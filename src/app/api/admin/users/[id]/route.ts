import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;
        const body = await req.json();

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                isActive: body.isActive ?? undefined,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[ADMIN_USER_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Soft delete: set isActive to false
        const deactivatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json(deactivatedUser);
    } catch (error) {
        console.error("[ADMIN_USER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
