import { NextRequest } from "next/server";
import { translateText } from "@/utils/translateApi";

export async function POST(req: NextRequest) {
  const { targetLang, texts } = await req.json();
  try {
    if (!Array.isArray(texts) || !texts.length) {
      return Response.json([], { status: 200 });
    }
    const data = await translateText(texts, targetLang);
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}
