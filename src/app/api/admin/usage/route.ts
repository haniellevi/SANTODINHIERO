import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";

export async function GET(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Mock data for usage history
        const mockData = Array.from({ length: 20 }).map((_, i) => ({
            id: `usage-${i}`,
            user: {
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`
            },
            operationType: i % 2 === 0 ? "AI_TEXT_CHAT" : "AI_IMAGE_GENERATION",
            creditsUsed: Math.floor(Math.random() * 10) + 1,
            details: { model: "gpt-4", tokens: 150 },
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }));

        return NextResponse.json({
            data: mockData,
            total: 20,
            page: 1,
            pageSize: 25
        });
    } catch (error) {
        console.error("[ADMIN_USAGE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
