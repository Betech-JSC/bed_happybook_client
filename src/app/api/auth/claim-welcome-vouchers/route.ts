import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/claim-welcome-vouchers`;

export async function POST() {
  const session = await getSession();
  if (!session.access_token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ message: data.message || "Failed to claim vouchers" }, { status: response.status });
    }

    return Response.json({ message: data.message, data: data.data }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
