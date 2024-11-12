"use server";

import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createSupabaseServerClient(component: boolean = false) {
  (await cookies()).getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { cookies });
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          setCookie(name, value, { cookies, ...options });
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
          deleteCookie(name, { cookies, ...options });
        },
      },
    }
  );
}

export async function createSupabaseServerComponentClient() {
  (await cookies()).getAll();
  return createSupabaseServerClient(true);
}

export async function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  (await cookies()).getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { req, res });
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name: string, options: CookieOptions) {
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}
