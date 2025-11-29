import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, month, year } = await req.json();

        // Verify the user owns this request
        if (userId !== clerkUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check if month already exists
        const existingMonth = await prisma.month.findUnique({
            where: {
                userId_month_year: {
                    userId,
                    month,
                    year,
                },
            },
        });

        if (existingMonth) {
            return NextResponse.json({ error: "Month already exists" }, { status: 400 });
        }

        // Create empty month
        const newMonth = await prisma.month.create({
            data: {
                userId,
                month,
                year,
            },
        });

        return NextResponse.json({ success: true, month: newMonth });
    } catch (error) {
        console.error("Error creating empty month:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
