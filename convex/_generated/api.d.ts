/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as admins from "../admins.js";
import type * as defaultGuestReviews from "../defaultGuestReviews.js";
import type * as defaultOpeningHours from "../defaultOpeningHours.js";
import type * as defaultSiteMenu from "../defaultSiteMenu.js";
import type * as http from "../http.js";
import type * as menu from "../menu.js";
import type * as menuPhotos from "../menuPhotos.js";
import type * as openingHours from "../openingHours.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as siteAdmin from "../siteAdmin.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  admins: typeof admins;
  defaultGuestReviews: typeof defaultGuestReviews;
  defaultOpeningHours: typeof defaultOpeningHours;
  defaultSiteMenu: typeof defaultSiteMenu;
  http: typeof http;
  menu: typeof menu;
  menuPhotos: typeof menuPhotos;
  openingHours: typeof openingHours;
  reviews: typeof reviews;
  seed: typeof seed;
  siteAdmin: typeof siteAdmin;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
