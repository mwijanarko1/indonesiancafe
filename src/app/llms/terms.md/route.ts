import { buildTermsMarkdown } from "@/lib/server/machine-readable";

export async function GET(): Promise<Response> {
  const body = buildTermsMarkdown();
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-robots-tag": "noindex, follow",
    },
  });
}
