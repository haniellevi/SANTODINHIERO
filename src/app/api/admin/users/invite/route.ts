import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { email } = await req.json();

        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_INVITE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
