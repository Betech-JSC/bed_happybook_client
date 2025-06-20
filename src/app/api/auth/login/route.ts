import { getServerLang, getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer`;

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const language = await getServerLang();
    const response = await fetch(`${apiEndPoint}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        language: language,
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      return Response.json({ message: data.message }, { status: 401 });
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.access_token = data?.data?.token;
    session.userInfo = {
      id: data?.data?.user_info?.id,
      name: data?.data?.user_info?.name,
      email: data?.data?.user_info?.email,
      phone: data?.data?.user_info?.phone,
      gender: data?.data?.user_info?.gender,
      created_at: data?.data?.user_info?.created_at,
    };
    await session.save();

    return Response.json(
      { message: data.message, user_info: data?.data?.user_info },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
