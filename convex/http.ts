/**
 * Site content admin over HTTPS only. Base URL: `CONVEX_SITE_URL` (…convex.site).
 * Header: `Authorization: Bearer <MENU_ADMIN_SECRET>` (Convex dashboard env, never in client bundles).
 *
 * POST `/admin/menu/replace` — JSON body: disclaimer, footerTagline, foodMenuImageUrl, drinksMenuImageUrl, categories
 * POST `/admin/menu/priced-availability` — { itemId, isAvailable }
 * POST `/admin/menu/drink-availability` — { itemId, isAvailable }
 * POST `/admin/reviews/replace` — { reviews, featuredAuthorOrder }
 * POST `/admin/reviews/seed-defaults` — empty body
 */
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { assertBearerSiteAdmin } from "./siteAdmin";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function unauthorizedResponse(): Response {
  return new Response("Unauthorized", { status: 401 });
}

function badRequestResponse(): Response {
  return new Response("Bad request", { status: 400 });
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

const http = httpRouter();

http.route({
  path: "/admin/menu/replace",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      assertBearerSiteAdmin(request.headers.get("Authorization"));
    } catch {
      return unauthorizedResponse();
    }
    const body = await readJson(request);
    if (body === null || typeof body !== "object") {
      return badRequestResponse();
    }
    try {
      // Convex validates args at runtime; JSON body is untyped at the HTTP boundary.
      await ctx.runMutation(internal.menu.replaceInternal, body as never);
    } catch {
      return badRequestResponse();
    }
    return new Response(null, { status: 204 });
  }),
});

http.route({
  path: "/admin/menu/priced-availability",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      assertBearerSiteAdmin(request.headers.get("Authorization"));
    } catch {
      return unauthorizedResponse();
    }
    const body = await readJson(request);
    if (body === null || typeof body !== "object") {
      return badRequestResponse();
    }
    try {
      await ctx.runMutation(internal.menu.setPricedItemAvailableInternal, body as never);
    } catch {
      return badRequestResponse();
    }
    return new Response(null, { status: 204 });
  }),
});

http.route({
  path: "/admin/menu/drink-availability",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      assertBearerSiteAdmin(request.headers.get("Authorization"));
    } catch {
      return unauthorizedResponse();
    }
    const body = await readJson(request);
    if (body === null || typeof body !== "object") {
      return badRequestResponse();
    }
    try {
      await ctx.runMutation(internal.menu.setDrinkItemAvailableInternal, body as never);
    } catch {
      return badRequestResponse();
    }
    return new Response(null, { status: 204 });
  }),
});

http.route({
  path: "/admin/reviews/replace",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      assertBearerSiteAdmin(request.headers.get("Authorization"));
    } catch {
      return unauthorizedResponse();
    }
    const body = await readJson(request);
    if (body === null || typeof body !== "object") {
      return badRequestResponse();
    }
    try {
      const result = await ctx.runMutation(internal.reviews.replaceInternal, body as never);
      return jsonResponse({ status: result }, 200);
    } catch {
      return badRequestResponse();
    }
  }),
});

http.route({
  path: "/admin/reviews/seed-defaults",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      assertBearerSiteAdmin(request.headers.get("Authorization"));
    } catch {
      return unauthorizedResponse();
    }
    try {
      const result = await ctx.runMutation(internal.reviews.applyDefaultSeed, {});
      return jsonResponse({ status: result }, 200);
    } catch {
      return badRequestResponse();
    }
  }),
});

export default http;
