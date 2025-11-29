"use server";

import { db as prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { FeedbackType, Permission } from "@prisma/client";

export async function updateUserSettings(data: { isTitheEnabled?: boolean; planningAlertDays?: number }) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) throw new Error("User not found");

    await prisma.user.update({
        where: { id: dbUser.id },
        data: {
            ...data
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/expenses");
}

export async function inviteCollaborator(email: string, permission: Permission) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        include: { collaborators: true } // To check limit
    });
    if (!dbUser) throw new Error("User not found");

    // Check Plan Limits (Mock logic for now, or fetch Plan)
    // TODO: Fetch user plan and check maxCollaborators
    const MAX_COLLABORATORS = 1; // Default for now
    if (dbUser.collaborators.length >= MAX_COLLABORATORS) {
        throw new Error("Limite de colaboradores atingido. Faça upgrade do seu plano.");
    }

    // Check if already invited
    const existingInvite = await prisma.collaborator.findUnique({
        where: {
            ownerId_email: {
                ownerId: dbUser.id,
                email: email
            }
        }
    });

    if (existingInvite) throw new Error("Este e-mail já foi convidado.");

    // Create Invite
    const newCollaborator = await prisma.collaborator.create({
        data: {
            ownerId: dbUser.id,
            email,
            permission,
            status: "PENDING"
        }
    });

    // Send Email
    try {
        const { sendCollaboratorInvite } = await import('@/lib/email');

        // Generate invite link (você pode personalizar isso)
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=collaborators&invite=${newCollaborator.id}`;

        await sendCollaboratorInvite({
            to: email,
            ownerName: dbUser.name || user.firstName || 'Um usuário',
            inviteLink,
            permission
        });
    } catch (emailError) {
        console.error('Failed to send invite email:', emailError);
        // Não falha a operação se o email não for enviado
        // O convite ainda é criado no banco
    }

    revalidatePath("/dashboard/settings");
}

export async function removeCollaborator(collaboratorId: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) throw new Error("User not found");

    await prisma.collaborator.delete({
        where: {
            id: collaboratorId,
            ownerId: dbUser.id // Security check
        }
    });

    revalidatePath("/dashboard/settings");
}

export async function createFeedback(type: FeedbackType, message: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) throw new Error("User not found");

    await prisma.feedback.create({
        data: {
            userId: dbUser.id,
            type,
            message
        }
    });
}
