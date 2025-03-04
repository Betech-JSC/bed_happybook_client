import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer`;

export async function POST() {
  const session = await getSession();
  if (!session.access_token) {
    return Response.json({ message: "Success" }, { status: 200 });
  }
  try {
    const response = await fetch(`${apiEndPoint}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Internal server error");
    }

    session.isLoggedIn = false;
    session.access_token = undefined;
    session.userInfo = undefined;
    await session.save();

    return Response.json({}, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
