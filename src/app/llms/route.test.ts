import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/machine-readable", () => ({
  buildHomeMarkdown: vi.fn(async () => "# home"),
  buildMenuMarkdown: vi.fn(async () => "# menu"),
  buildReviewsMarkdown: vi.fn(async () => "# reviews"),
  buildVisitMarkdown: vi.fn(async () => "# visit"),
  buildFaqMarkdown: vi.fn(async () => "# faq"),
  buildPrivacyMarkdown: vi.fn(() => "# privacy"),
  buildTermsMarkdown: vi.fn(() => "# terms"),
}));

import {
  buildHomeMarkdown,
  buildMenuMarkdown,
  buildFaqMarkdown,
  buildPrivacyMarkdown,
  buildReviewsMarkdown,
  buildTermsMarkdown,
  buildVisitMarkdown,
} from "@/lib/server/machine-readable";
import { GET as getFaq } from "./faq.md/route";
import { GET as getHome } from "./home.md/route";
import { GET as getMenu } from "./menu.md/route";
import { GET as getPrivacy } from "./privacy.md/route";
import { GET as getReviews } from "./reviews.md/route";
import { GET as getTerms } from "./terms.md/route";
import { GET as getVisit } from "./visit.md/route";

async function expectMarkdownResponse(response: Response, expectedBody: string) {
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/markdown; charset=utf-8");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
  await expect(response.text()).resolves.toBe(expectedBody);
}

describe("llms markdown routes", () => {
  it("home route uses shared generator and markdown headers", async () => {
    const response = await getHome();
    await expectMarkdownResponse(response, "# home");
    expect(buildHomeMarkdown).toHaveBeenCalledTimes(1);
  });

  it("menu route uses shared generator and markdown headers", async () => {
    const response = await getMenu();
    await expectMarkdownResponse(response, "# menu");
    expect(buildMenuMarkdown).toHaveBeenCalledTimes(1);
  });

  it("reviews route uses shared generator and markdown headers", async () => {
    const response = await getReviews();
    await expectMarkdownResponse(response, "# reviews");
    expect(buildReviewsMarkdown).toHaveBeenCalledTimes(1);
  });

  it("visit route uses shared generator and markdown headers", async () => {
    const response = await getVisit();
    await expectMarkdownResponse(response, "# visit");
    expect(buildVisitMarkdown).toHaveBeenCalledTimes(1);
  });

  it("faq route uses shared generator and markdown headers", async () => {
    const response = await getFaq();
    await expectMarkdownResponse(response, "# faq");
    expect(buildFaqMarkdown).toHaveBeenCalledTimes(1);
  });

  it("privacy route uses shared generator and markdown headers", async () => {
    const response = await getPrivacy();
    await expectMarkdownResponse(response, "# privacy");
    expect(buildPrivacyMarkdown).toHaveBeenCalledTimes(1);
  });

  it("terms route uses shared generator and markdown headers", async () => {
    const response = await getTerms();
    await expectMarkdownResponse(response, "# terms");
    expect(buildTermsMarkdown).toHaveBeenCalledTimes(1);
  });
});
