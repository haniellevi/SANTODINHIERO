import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get pending invitations from Clerk
        const invitations = await clerkClient.invitations.getInvitationList({
            status: "pending",
        });

        return NextResponse.json({
            invitations: invitations.data.map((inv) => ({
                id: inv.id,
                emailAddress: inv.emailAddress,
                status: inv.status,
                createdAt: inv.createdAt,
                updatedAt: inv.updatedAt,
            })),
        });
    } catch (error) {
        console.error("[ADMIN_INVITATIONS_GET]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
