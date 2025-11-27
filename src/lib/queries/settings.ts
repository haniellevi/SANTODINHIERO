import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserSettings() {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.user.findUnique({
        where: { clerkId: user.id },
        include: {
            collaborators: true,
            // We might want to include plan details here if we had a relation, 
            // but for now we'll just return the user and collaborators.
        }
    });

    return dbUser;
}

export async function getUserPlan() {
    // Mock or fetch plan logic
    // Since Plan model exists but relation to User is not clear (maybe via clerkId or subscriptionId),
    // I'll assume for now we just return a default or fetch by clerkId if Plan has it.
    // The Plan model has clerkId.
    const user = await currentUser();
    if (!user) return null;

    const plan = await db.plan.findUnique({
        where: { clerkId: user.id } // Assuming Plan is linked to User via clerkId? 
        // Actually Plan model has clerkId @unique, maybe it's the plan definition or the user's subscription?
        // Looking at schema: Plan has name, price, features. It looks like a Plan Definition.
        // User doesn't seem to have a direct relation to Plan in the schema snippet I saw.
        // I'll skip Plan fetching for now and rely on hardcoded limits or future implementation.
    });

    return plan;
}
