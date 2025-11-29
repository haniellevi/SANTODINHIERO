import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

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

        // Get all pending invitations and find the one we need
        const allPendingInvitations = await clerkClient.invitations.getInvitationList({ status: 'pending' });
        const invitation = allPendingInvitations.data.find(inv => inv.id === id);

        if (!invitation) {
            return new NextResponse("Invitation not found or not pending", { status: 404 });
        }

        if (!invitation.emailAddress) {
            return new NextResponse("Invalid invitation", { status: 400 });
        }

        // Revoke old invitation and create a new one
        await clerkClient.invitations.revokeInvitation(id);

        const newInvitation = await clerkClient.invitations.createInvitation({
            emailAddress: invitation.emailAddress,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
        });

        return NextResponse.json({
            success: true,
            invitation: {
                id: newInvitation.id,
                emailAddress: newInvitation.emailAddress,
                status: newInvitation.status,
            },
        });
    } catch (error) {
        console.error("[ADMIN_INVITATION_RESEND_POST]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
