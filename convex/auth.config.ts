/* eslint-disable */
/**
 * Clerk JWT authentication for Convex.
 *
 * Required setup:
 * 1. In Clerk Dashboard → JWT Templates, create a template named "convex"
 *    with an issuer URL like `https://<YOUR_CLERK_DOMAIN>.clerk.accounts.dev`
 * 2. Set CLERK_JWT_ISSUER environment variable in Convex dashboard
 *    to the same issuer URL.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER!,
      applicationID: "convex",
    },
  ],
};
