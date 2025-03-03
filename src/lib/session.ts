import { IronSession, SessionOptions, getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export interface SessionData {
  language: string;
  isLoggedIn: boolean;
  access_token?: string;
  userInfo?: {
    name: string;
    email: string;
  };
}

export const defaultSession: SessionData = {
  language: "vi",
  isLoggedIn: false,
  access_token: undefined,
  userInfo: undefined,
};

export const sessionOptions: SessionOptions = {
  cookieName: "myapp_session",
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl: 60 * 60 * 24,
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.access_token = defaultSession.access_token;
    session.userInfo = defaultSession.userInfo;
  }
  if (!session.language) {
    session.language = defaultSession.language;
  }
  return session;
}

export async function setSession(
  req: NextRequest,
  newSessionData: Partial<SessionData>
) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  Object.assign(session, newSessionData);
  await session.save();

  return res;
}

export const getServerLang = async (): Promise<string> => {
  const session = await getSession();

  return session.language || "vi";
};
