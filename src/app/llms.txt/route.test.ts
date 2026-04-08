import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/machine-readable", () => ({
  buildLlmsTxt: vi.fn(() => "site: Indonesian Cafe"),
}));

import { buildLlmsTxt } from "@/lib/server/machine-readable";
import { GET } from "./route";

describe("/llms.txt route", () => {
  it("returns plain text without noindex robots header", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain; charset=utf-8");
    expect(response.headers.get("x-robots-tag")).toBeNull();
    await expect(response.text()).resolves.toBe("site: Indonesian Cafe");
    expect(buildLlmsTxt).toHaveBeenCalledTimes(1);
  });
});
