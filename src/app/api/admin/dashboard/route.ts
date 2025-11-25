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

        // Get basic stats
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({
            where: { isActive: true },
        });

        // Mock data for revenue charts (replace with real data when available)
        const mrrSeries = [
            { label: "Jan", value: 1200 },
            { label: "Fev", value: 1500 },
            { label: "Mar", value: 1800 },
            { label: "Abr", value: 2100 },
            { label: "Mai", value: 2400 },
            { label: "Jun", value: 2700 },
        ];

        const arrSeries = [
            { label: "Jan", value: 14400 },
            { label: "Fev", value: 18000 },
            { label: "Mar", value: 21600 },
            { label: "Abr", value: 25200 },
            { label: "Mai", value: 28800 },
            { label: "Jun", value: 32400 },
        ];

        const churnSeries = [
            { label: "Jan", value: 2.5 },
            { label: "Fev", value: 2.1 },
            { label: "Mar", value: 1.8 },
            { label: "Abr", value: 1.5 },
            { label: "Mai", value: 1.2 },
            { label: "Jun", value: 0.9 },
        ];

        const stats = {
            totalUsers,
            activeUsers,
            totalCredits: 0, // Placeholder
            usedCredits: 0, // Placeholder
            mrrSeries,
            arrSeries,
            churnSeries,
            recentActivity: [], // Placeholder
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("[ADMIN_DASHBOARD_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
