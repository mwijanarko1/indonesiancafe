import { buildMenuMarkdown } from "@/lib/server/machine-readable";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const body = await buildMenuMarkdown();
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-robots-tag": "noindex, follow",
    },
  });
}
