import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/is-first-time`;

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session.access_token) {
    return Response.json({ is_first_time: true }, { status: 200 });
  }
  try {
    const response = await fetch(apiEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Internal server error");
    }

    const resData = await response.json();
    const isFirstTime = resData.data?.is_first_time ?? false;

    return Response.json({ is_first_time: isFirstTime }, { status: 200 });
  } catch (error) {
    return Response.json({ is_first_time: false }, { status: 200 });
  }
}
