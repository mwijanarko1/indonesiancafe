import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { applyProxy } from "./proxy";

function getRewriteTarget(response: Response): string | null {
  return response.headers.get("x-middleware-rewrite");
}

describe("proxy markdown negotiation", () => {
  it("rewrites .md requests to the internal markdown handler", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/menu.md");
    const response = applyProxy(request);

    expect(getRewriteTarget(response)).toContain("/api/site-md/menu");
  });

  it("rewrites format=md requests to the internal markdown handler", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/menu?format=md");
    const response = applyProxy(request);

    expect(getRewriteTarget(response)).toContain("/api/site-md/menu");
  });

  it("rewrites Accept: text/markdown requests to the internal markdown handler", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/menu", {
      headers: { accept: "text/markdown, text/plain;q=0.8" },
    });
    const response = applyProxy(request);

    expect(getRewriteTarget(response)).toContain("/api/site-md/menu");
  });

  it("does not rewrite standard HTML requests", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/menu", {
      headers: { accept: "text/html,application/xhtml+xml" },
    });
    const response = applyProxy(request);

    expect(getRewriteTarget(response)).toBeNull();
  });

  it("allows Clerk custom domain in CSP directives", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/");
    const response = applyProxy(request);
    const csp = response.headers.get("Content-Security-Policy");

    expect(csp).toContain("https://clerk.indonesiancafe.co.uk");
    // script-src should have it
    expect(csp).toMatch(/script-src[^;]*https:\/\/clerk\.indonesiancafe\.co\.uk/);
    // connect-src should have both https and wss
    expect(csp).toMatch(/connect-src[^;]*https:\/\/clerk\.indonesiancafe\.co\.uk/);
    expect(csp).toMatch(/connect-src[^;]*wss:\/\/clerk\.indonesiancafe\.co\.uk/);
    // frame-src should have it
    expect(csp).toMatch(/frame-src[^;]*https:\/\/clerk\.indonesiancafe\.co\.uk/);
  });

  it("allows blob workers for Clerk via worker-src directive", () => {
    const request = new NextRequest("https://www.indonesiancafe.co.uk/");
    const response = applyProxy(request);
    const csp = response.headers.get("Content-Security-Policy");

    expect(csp).toMatch(/worker-src 'self' blob:/);
  });
});
