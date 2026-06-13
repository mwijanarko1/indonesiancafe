import "server-only";

const BYPASS_HEADER = "x-site-md-bypass";

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(text: string): string {
  return decodeEntities(text)
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function extractMainHtml(html: string): string {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch?.[1]) {
    return mainMatch[1];
  }

  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch?.[1]) {
    return bodyMatch[1];
  }

  return html;
}

function htmlFragmentToMarkdown(fragment: string): string {
  const stripped = stripTags(fragment)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h1>/gi, "\n\n")
    .replace(/<h1\b[^>]*>/gi, "\n# ")
    .replace(/<\/h2>/gi, "\n\n")
    .replace(/<h2\b[^>]*>/gi, "\n## ")
    .replace(/<\/h3>/gi, "\n\n")
    .replace(/<h3\b[^>]*>/gi, "\n### ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p\b[^>]*>/gi, "")
    .replace(/<\/(section|article|div|header|footer|aside|nav)>/gi, "\n\n")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, text: string) => {
      const linkText = cleanText(text.replace(/<[^>]+>/g, ""));
      return linkText ? `[${linkText}](${href})` : href;
    })
    .replace(/<[^>]+>/g, "");

  return cleanText(stripped);
}

function titleFromPath(pathname: string): string {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/").at(-1) || "home";
  return segment
    .split("-")
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export function getMarkdownBypassHeader(): string {
  return BYPASS_HEADER;
}

export async function renderFallbackMarkdown(
  requestUrl: string,
  canonicalPath: string,
): Promise<string> {
  const url = new URL(canonicalPath, requestUrl);
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      [BYPASS_HEADER]: "1",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to render markdown fallback for ${canonicalPath}: ${response.status}`);
  }

  const html = await response.text();
  const fragment = extractMainHtml(html);
  const body = htmlFragmentToMarkdown(fragment);
  const heading = body.match(/^# /m) ? body : `# ${titleFromPath(canonicalPath)}\n\n${body}`;

  return cleanText([
    heading.trim(),
    "",
    `Canonical page: ${new URL(canonicalPath, requestUrl).toString()}`,
  ].join("\n"));
}
