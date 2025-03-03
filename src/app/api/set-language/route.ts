import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { arrLanguages } from "@/constants/language";

export async function POST(req: NextRequest) {
  let { language } = await req.json();

  if (!language) {
    return NextResponse.json(
      { error: "Language is required" },
      { status: 400 }
    );
  }

  const session = await getSession();

  if (!arrLanguages.includes(language)) language = "vi";

  session.language = language;
  await session.save();

  return NextResponse.json({ message: "Updated Language", language });
}
