"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const client = useMemo(() => (url ? new ConvexReactClient(url) : null), [url]);
  if (!client) {
    return children;
  }
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
