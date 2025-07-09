import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let { targetLang, texts } = await req.json();
  try {
    if (!texts.length) {
      return Response.json([], { status: 200 });
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    const payload = [[texts, "vi", targetLang], "te"];
    const url = `https://translate-pa.googleapis.com/v1/translateHtml`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "x-goog-api-key": `${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return Response.json(data[0] ?? [], { status: 200 });
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}
