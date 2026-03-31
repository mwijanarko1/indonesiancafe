import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV === "development";

/** Convex + any explicit deployment URL; without this, default-src blocks wss/https to Convex on mobile Safari. */
function connectSrcDirective(): string {
  const sources = new Set<string>(["'self'"]);
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (convexUrl) {
    try {
      const u = new URL(convexUrl);
      sources.add(`${u.protocol}//${u.host}`);
      sources.add(u.protocol === "https:" ? `wss://${u.host}` : `ws://${u.host}`);
    } catch {
      /* ignore bad env */
    }
  }
  sources.add("https://*.convex.cloud");
  sources.add("wss://*.convex.cloud");
  sources.add("https://*.convex.site");
  sources.add("wss://*.convex.site");
  return [...sources].join(" ");
}

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary);
}

export function proxy(request: NextRequest) {
  const nonce = randomNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const scriptParts = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? (["'unsafe-eval'"] as const) : []),
  ];

  const csp = [
    "default-src 'self'",
    `script-src ${scriptParts.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrcDirective()}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "frame-src 'self' https://www.google.com https://www.google.co.uk https://maps.google.com",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
