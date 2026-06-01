import { getSession } from "@/lib/session";

const apiEndPoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}`;

export async function POST(req: Request) {
  const formData = await req.formData();
  const session = await getSession();

  if (!session.access_token) {
    return Response.json({ message: "Error" }, { status: 401 });
  }

  try {
    const response = await fetch(`${apiEndPoint}/users/change-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data?.status === "fail") {
      return Response.json(
        { message: data.message ?? "Không thể cập nhật ảnh đại diện" },
        { status: response.status }
      );
    }

    session.userInfo = {
      ...(session.userInfo ?? {}),
      avatar: data?.data?.avatar ?? session.userInfo?.avatar,
      avatar_url: data?.data?.avatar_url ?? session.userInfo?.avatar_url,
    };
    await session.save();

    return Response.json(
      {
        message: data.message,
        user_info: session.userInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
