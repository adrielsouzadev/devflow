import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./session-cookie";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_IN_SECONDS,
  });
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}