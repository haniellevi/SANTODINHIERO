import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-utils";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Placeholder: Return default settings
        return NextResponse.json({
            featureCosts: {
                ai_text_chat: 1,
                ai_image_generation: 5,
            },
        });
    } catch (error) {
        console.error("[ADMIN_SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
