import { getServerLang, getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer`;

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getSession();

  if (!session.access_token) {
    return Response.json({ message: "Error" }, { status: 401 });
  }

  try {
    const language = await getServerLang();
    const response = await fetch(`${apiEndPoint}/update-birthday`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        language,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data?.status === "fail") {
      return Response.json(
        { message: data.message ?? "Invalid data" },
        { status: response.status }
      );
    }

    session.userInfo = {
      ...(session.userInfo ?? {}),
      ...data?.data?.user_info,
      birthday: data?.data?.user_info?.birthday ?? undefined,
    };
    await session.save();

    return Response.json(
      {
        message: data.message,
        user_info: data?.data?.user_info,
        needs_birthday_update: data?.data?.needs_birthday_update ?? false,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
