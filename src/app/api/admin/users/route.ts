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

        // Get all users with their month count
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        months: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Format response
        const formattedUsers = users.map((u) => ({
            id: u.id,
            clerkId: u.clerkId,
            email: u.email,
            name: u.name,
            isActive: u.isActive,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            monthsCount: u._count.months,
        }));

        return NextResponse.json({ users: formattedUsers });
    } catch (error) {
        console.error("[ADMIN_USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
