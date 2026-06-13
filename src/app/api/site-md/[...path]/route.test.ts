import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

vi.mock("@/lib/server/machine-readable", () => ({
  resolveMarkdownForPath: vi.fn(async (path: string[]) => {
    if (path.join("/") === "menu") {
      return { body: "# Menu - Indonesian Cafe", source: "curated" as const };
    }
    return null;
  }),
}));

import { GET } from "./route";

describe("/api/site-md/[...path] route", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("returns curated markdown when the path has a dedicated generator", async () => {
    const response = await GET(new Request("https://www.indonesiancafe.co.uk/api/site-md/menu"), {
      params: Promise.resolve({ path: ["menu"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown; charset=utf-8");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(response.headers.get("x-content-source")).toBe("curated");
    await expect(response.text()).resolves.toContain("# Menu - Indonesian Cafe");
  });

  it("falls back to rendered markdown when there is no curated generator", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("<html><body><main><h1>Contact</h1><p>Generic text.</p></main></body></html>", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );

    const response = await GET(new Request("https://www.indonesiancafe.co.uk/api/site-md/contact"), {
      params: Promise.resolve({ path: ["contact"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("x-content-source")).toBe("rendered");
    await expect(response.text()).resolves.toContain("# Contact");
  });
});
