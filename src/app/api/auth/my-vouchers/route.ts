import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/my-vouchers`;

export async function GET() {
  const session = await getSession();
  if (!session.access_token) {
    return Response.json({ data: [] }, { status: 200 });
  }
  try {
    const response = await fetch(apiEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`my-vouchers API responded with status ${response.status}:`, text);
      return Response.json({ data: [] }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ data: data.data || [] }, { status: 200 });
  } catch (error) {
    console.error("Exception in my-vouchers proxy route:", error);
    return Response.json({ data: [] }, { status: 500 });
  }
}
