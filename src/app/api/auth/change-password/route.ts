import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer`;

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getSession();
  if (!session.access_token) {
    return Response.json({ message: "Error" }, { status: 401 });
  }
  try {
    const response = await fetch(`${apiEndPoint}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { message: data.errors },
        { status: response.status }
      );
    }
    session.isLoggedIn = false;
    session.access_token = undefined;
    session.userInfo = undefined;
    await session.save();
    return Response.json({ message: data.message }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
