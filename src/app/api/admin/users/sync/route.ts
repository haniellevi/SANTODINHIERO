import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { isAdmin } from "@/lib/admin-utils";
import { prisma } from "@/lib/db";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !(await isAdmin(user.id))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            syncUsers = true,
            syncPlans = false,
            setCredits = false,
            overrideCredits,
            pageSize = 100,
            maxPages = 50,
            debug = false,
        } = body;

        let processed = 0;
        let createdUsers = 0;
        let updatedUsers = 0;
        let pagesProcessed = 0;
        let hasMore = true;
        let lastUserId: string | undefined;

        // Sync users from Clerk
        if (syncUsers) {
            while (hasMore && pagesProcessed < maxPages) {
                const response = await clerkClient.users.getUserList({
                    limit: pageSize,
                    ...(lastUserId && { offset: pagesProcessed * pageSize }),
                });

                const users = response.data;

                for (const clerkUser of users) {
                    try {
                        const existingUser = await prisma.user.findUnique({
                            where: { clerkId: clerkUser.id },
                        });

                        const userData = {
                            email: clerkUser.emailAddresses[0]?.emailAddress || null,
                            name: clerkUser.firstName && clerkUser.lastName
                                ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
                                : clerkUser.firstName || clerkUser.lastName || null,
                            isActive: true,
                        };

                        if (existingUser) {
                            await prisma.user.update({
                                where: { clerkId: clerkUser.id },
                                data: userData,
                            });
                            updatedUsers++;
                        } else {
                            await prisma.user.create({
                                data: {
                                    clerkId: clerkUser.id,
                                    ...userData,
                                },
                            });
                            createdUsers++;
                        }

                        processed++;
                    } catch (error) {
                        console.error(`Error syncing user ${clerkUser.id}:`, error);
                    }
                }

                hasMore = users.length === pageSize;
                pagesProcessed++;

                if (users.length > 0) {
                    lastUserId = users[users.length - 1].id;
                }
            }
        }

        const result: any = {
            processed,
            createdUsers,
            updatedUsers,
        };

        if (debug) {
            result.debug = {
                pagesProcessed,
                pageSize,
                maxPages,
            };
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("[ADMIN_USERS_SYNC_POST]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
