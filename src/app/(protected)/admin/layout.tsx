import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const dbUser = await db.user.findUnique({
        where: { clerkId: user.id },
    });

    if (!dbUser) {
        redirect("/dashboard");
    }

    // Check if admin
    const userIsAdmin = isAdmin({
        role: dbUser.role,
        clerkId: dbUser.clerkId,
        email: dbUser.email
    });

    if (!userIsAdmin) {
        redirect("/dashboard");
    }

    // If user is super admin via env but not in DB, update DB
    if (userIsAdmin && dbUser.role !== "ADMIN") {
        await db.user.update({
            where: { id: dbUser.id },
            data: { role: "ADMIN" }
        });
    }

    return (
        <div className="flex min-h-screen flex-col">
            {children}
        </div>
    );
}
