import { renderFallbackMarkdown } from "@/lib/server/markdown-renderer";
import { resolveMarkdownForPath } from "@/lib/server/machine-readable";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function markdownHeaders(source: "curated" | "rendered"): HeadersInit {
  return {
    "content-type": "text/markdown; charset=utf-8",
    vary: "Accept, User-Agent",
    "x-robots-tag": "noindex, follow",
    "x-content-source": source,
  };
}

export async function GET(request: Request, { params }: RouteContext): Promise<Response> {
  const { path } = await params;
  const resolved = await resolveMarkdownForPath(path);

  if (resolved) {
    return new Response(resolved.body, {
      status: 200,
      headers: markdownHeaders("curated"),
    });
  }

  const canonicalPath = `/${path.join("/")}`.replace(/^\/index$/, "/");
  const body = await renderFallbackMarkdown(request.url, canonicalPath);

  return new Response(body, {
    status: 200,
    headers: markdownHeaders("rendered"),
  });
}
