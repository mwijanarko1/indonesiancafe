import { buildLlmsTxt } from "@/lib/server/machine-readable";

export async function GET(): Promise<Response> {
  const body = buildLlmsTxt();
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
