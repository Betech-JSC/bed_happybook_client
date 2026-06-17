import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer`;

export async function POST() {
  const session = await getSession();
  if (!session.access_token) {
    session.isLoggedIn = false;
    session.access_token = undefined;
    session.userInfo = undefined;
    await session.save();
    return Response.json({ message: "Success" }, { status: 200 });
  }
  try {
    // Attempt to notify the backend about logout
    await fetch(`${apiEndPoint}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (error) {
    // Ignore backend errors/exceptions since we must clear the client session
  }

  // Always clear the local session to prevent the user from being stuck logged in
  session.isLoggedIn = false;
  session.access_token = undefined;
  session.userInfo = undefined;
  await session.save();

  return Response.json({ message: "Success" }, { status: 200 });
}
