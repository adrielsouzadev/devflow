import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "devflow_session";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_IN_SECONDS,
  });
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}