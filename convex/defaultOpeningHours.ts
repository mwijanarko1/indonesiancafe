/** Default weekly hours — mirrors `src/lib/site.ts` until Convex is seeded. */
export const defaultSiteOpeningHoursRow = {
  key: "default" as const,
  hours: [
    { day: "Monday", time: "10 am–8 pm" },
    { day: "Tuesday", time: "Closed" },
    { day: "Wednesday", time: "10 am–8 pm" },
    { day: "Thursday", time: "10 am–8 pm" },
    { day: "Friday", time: "10 am–8 pm" },
    { day: "Saturday", time: "10 am–8 pm" },
    { day: "Sunday", time: "10 am–8 pm" },
  ],
  footnote: "Bank holiday hours may differ. Check Google Maps before you travel.",
};
