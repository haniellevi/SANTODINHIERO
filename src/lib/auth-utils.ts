import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


export async function getUserFromClerkId(clerkId: string) {
  // Use upsert to handle race conditions where user might be created between find and create
  const user = await db.user.upsert({
    where: { clerkId },
    update: {}, // No updates if exists
    create: {
      clerkId
    }
  });

  return user;
}

export function createAuthErrorResponse(message: string, status: number = 401) {
  return NextResponse.json(
    { error: message, success: false },
    { status }
  );
}

export async function validateUserAuthentication() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}
