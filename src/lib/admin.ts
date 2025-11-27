import { UserRole } from "@prisma/client";

export function isSuperAdmin(userId: string, email?: string | null) {
    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    if (adminUserIds.includes(userId)) return true;
    if (email && adminEmails.includes(email)) return true;

    return false;
}

export function isAdmin(user: { role: UserRole; clerkId: string; email?: string | null }) {
    if (user.role === "ADMIN") return true;
    return isSuperAdmin(user.clerkId, user.email);
}
