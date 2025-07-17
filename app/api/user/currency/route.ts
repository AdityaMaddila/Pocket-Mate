import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth(); // ✅ Fix here
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: userId } });
  return NextResponse.json({ currency: user?.currency ?? "INR" });
}

export async function POST(req: Request) {
  const { userId } = await auth(); // ✅ Fix here
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const currency = body.currency;

  await db.user.update({
    where: { id: userId },
    data: { currency },
  });

  return NextResponse.json({ success: true });
}
