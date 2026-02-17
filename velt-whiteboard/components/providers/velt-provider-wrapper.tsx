"use client";

import { VeltProvider } from "@veltdev/react";

export function VeltProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY || "hnbXx3OVUnYwsPsmATqe";

  return <VeltProvider apiKey={apiKey}>{children}</VeltProvider>;
}
