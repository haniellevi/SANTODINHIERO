import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Revoke invitation in Clerk
        await clerkClient.invitations.revokeInvitation(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_INVITATION_REVOKE_POST]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
