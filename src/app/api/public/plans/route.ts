import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { priceMonthlyCents: 'asc' },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("[PLANS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
