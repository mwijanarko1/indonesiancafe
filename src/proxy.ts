import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getMarkdownBypassHeader } from "@/lib/server/markdown-renderer";

const isDev = process.env.NODE_ENV === "development";
const MARKDOWN_QUERY_VALUE = "md";

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

function shouldSkipMarkdownRewrite(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  return (
    request.headers.get(getMarkdownBypassHeader()) === "1" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/llms") ||
    pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(pathname.replace(/\.md$/i, ""))
  );
}

function wantsMarkdown(request: NextRequest): { canonicalPath: string; mode: string } | null {
  if (shouldSkipMarkdownRewrite(request)) {
    return null;
  }

  const url = request.nextUrl.clone();
  const accept = request.headers.get("accept") ?? "";
  const isRoot = url.pathname === "/";

  if (url.pathname.endsWith(".md")) {
    const canonicalPath = url.pathname.replace(/\.md$/i, "") || "/";
    return { canonicalPath: canonicalPath === "/index" ? "/" : canonicalPath, mode: "suffix" };
  }

  if (url.searchParams.get("format") === MARKDOWN_QUERY_VALUE) {
    return { canonicalPath: url.pathname, mode: "query" };
  }

  if (accept.includes("text/markdown")) {
    return { canonicalPath: isRoot ? "/" : url.pathname, mode: "accept-header" };
  }

  return null;
}

function buildMarkdownRewrite(request: NextRequest, canonicalPath: string, mode: string) {
  const url = request.nextUrl.clone();
  const cleanPath = canonicalPath === "/" ? "index" : canonicalPath.replace(/^\/+/, "");

  url.pathname = `/api/site-md/${cleanPath}`;
  url.searchParams.delete("format");
  url.searchParams.set("markdown-mode", mode);

  return url;
}

export function applyProxy(request: NextRequest) {
  const rewrite = wantsMarkdown(request);
  const response = rewrite
    ? NextResponse.rewrite(buildMarkdownRewrite(request, rewrite.canonicalPath, rewrite.mode))
    : NextResponse.next();

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.clerk.com https://*.clerk.accounts.dev https://clerk.indonesiancafe.co.uk`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://img.clerk.com https://*.convex.cloud",
    "media-src 'self' https://*.convex.cloud",
    "font-src 'self'",
    `connect-src ${connectSrcDirective()} https://*.clerk.com wss://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://clerk.indonesiancafe.co.uk wss://clerk.indonesiancafe.co.uk`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "frame-src 'self' https://www.google.com https://www.google.co.uk https://maps.google.com https://*.clerk.accounts.dev https://clerk.indonesiancafe.co.uk",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

/** The runtime middleware that Next.js invokes. Wraps `applyProxy` with Clerk auth context. */
export const proxy = clerkMiddleware((_auth, request) => applyProxy(request));

export default clerkMiddleware((_auth, request) => applyProxy(request));

export const config = {
  matcher: [
    "/__clerk/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|html|css|js|json|woff2?|ttf|otf|eot|csv|docx?|xlsx?|zip|webmanifest)$).*)",
  ],
};
