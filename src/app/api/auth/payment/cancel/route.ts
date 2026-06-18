import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderCode } = await request.json();
    if (!orderCode) {
      return NextResponse.json({ success: false, message: "Missing orderCode" }, { status: 400 });
    }

    const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payment/cancel`;
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_code: orderCode }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`payment/cancel API responded with status ${response.status}:`, text);
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Exception in payment/cancel proxy route:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
