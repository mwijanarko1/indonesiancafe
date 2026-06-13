/**
 * HTTP router.
 *
 * Admin routes were migrated to authenticated Convex query/mutation
 * functions using Clerk JWT tokens. No bearer-secret routes remain.
 */
import { httpRouter } from "convex/server";

const http = httpRouter();

// No routes currently. Admin operations use Convex query/mutation
// functions authenticated via Clerk JWT + admins table.
// Add HTTP routes here for webhooks or other non-admin use cases.

export default http;
