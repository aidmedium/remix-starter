import { Cookie, createCookie } from "@remix-run/node";

import { config } from "@/lib/config";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const authCookie = createCookie(config.AUTH_COOKIE_NAME, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: MAX_AGE,
});

type AuthHeaders = { authorization: string } | Record<string, never>;

/**
 * Retrieves the auth token from the request headers.
 *
 * @param request The request object.
 * @returns The auth token.
 */
export const getAuthHeaders = async (request: Partial<Request>): Promise<AuthHeaders> => {
  if (!request.headers) {
    throw Error("No request provided for getting auth headers");
  }

  const token = await getCookie(request.headers, authCookie);

  if (!token) {
    return {};
  }

  return { authorization: `Bearer ${token}` };
};

/**
 * A higher-order function that adds auth headers to a Fetch API request.
 *
 * @param asyncFn The function to wrap.
 * @returns The wrapped function.
 */
export const withAuthHeaders = <TArgs extends Array<any> = any[], TReturn = any>(
  asyncFn: (request: Request, authHeaders: AuthHeaders, ...args: TArgs) => TReturn
) => {
  return async (request: Request, ...args: TArgs): Promise<Awaited<TReturn>> => {
    // Retrieve the auth headers before calling the wrapped function
    const authHeaders = await getAuthHeaders(request);

    // Call the original function with the auth headers injected
    return await asyncFn(request, authHeaders, ...args);
  };
};

// Remix cookie helpers

export async function setCookie(headers: Headers, cookie: Cookie | string, value: string) {
  return headers.append(
    "set-cookie",
    typeof cookie === "string"
      ? `${cookie}=${value}; Max-Age=${MAX_AGE}; path=/;`
      : await cookie.serialize(value)
  );
}

export async function destroyCookie(headers: Headers, cookie: Cookie | string) {
  return headers.append(
    "set-cookie",
    typeof cookie === "string"
      ? `${cookie}=; Max-Age=0; path=/;`
      : await cookie.serialize("", { maxAge: 0, path: "/" })
  );
}

export async function getCookie(headers: Headers, cookie: Cookie | string) {
  return typeof cookie === "string"
    ? (parseCookie(headers.get("Cookie"))[cookie] as string)
    : ((await cookie.parse(headers.get("Cookie"))) as string);
}

export function parseCookie(str: string | null) {
  if (!str) return {};
  return (str || "")
    .split(";")
    .map((v) => v.split("="))
    .reduce(
      (acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      },
      {} as Record<string, string>
    );
}

// Medusa cookie helpers

export const setAuthToken = async (headers: Headers, token: string) => {
  setCookie(headers, authCookie, token);
};

export const removeAuthToken = (headers: Headers) => {
  destroyCookie(headers, authCookie);
};

export const getCartId = (headers: Headers) => {
  return getCookie(headers, "_medusa_cart_id");
};

export const getSelectedRegionId = (headers: Headers) => {
  return getCookie(headers, "_medusa_region_id");
};

export const setSelectedRegionId = async (headers: Headers, regionId: string) => {
  await setCookie(headers, "_medusa_region_id", regionId);
};

export const setCartId = async (headers: Headers, cartId: string) => {
  await setCookie(headers, "_medusa_cart_id", cartId);
};

export const removeCartId = async (headers: Headers) => {
  await destroyCookie(headers, "_medusa_cart_id");
};
