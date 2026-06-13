import { describe, expect, it } from "vitest";
import nextConfig from "../next.config.mjs";

describe("next.config.mjs CORS headers", () => {
  it("sets Access-Control-Allow-Origin to the canonical domain, not wildcard", async () => {
    const headersResult = await nextConfig.headers();
    const pathStar = headersResult.find((h) => h.source === "/:path*");
    expect(pathStar).toBeDefined();

    const corsHeader = pathStar!.headers.find(
      (h) => h.key === "Access-Control-Allow-Origin",
    );
    expect(corsHeader).toBeDefined();
    expect(corsHeader!.value).toBe("https://www.indonesiancafe.co.uk");
    expect(corsHeader!.value).not.toBe("*");
  });
});
