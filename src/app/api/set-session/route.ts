import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession(req, res, sessionOptions);
  const body = await req.json();
  Object.assign(session, body);
  await session.save();
  return res;
}
