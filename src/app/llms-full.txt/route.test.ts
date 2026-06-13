import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/machine-readable", () => ({
  buildLlmsFullTxt: vi.fn(async () => "site: Indonesian Cafe\nfull: true"),
}));

import { buildLlmsFullTxt } from "@/lib/server/machine-readable";
import { GET } from "./route";

describe("/llms-full.txt route", () => {
  it("returns plain text for the expanded machine-readable index", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain; charset=utf-8");
    expect(response.headers.get("x-robots-tag")).toBeNull();
    await expect(response.text()).resolves.toBe("site: Indonesian Cafe\nfull: true");
    expect(buildLlmsFullTxt).toHaveBeenCalledTimes(1);
  });
});
