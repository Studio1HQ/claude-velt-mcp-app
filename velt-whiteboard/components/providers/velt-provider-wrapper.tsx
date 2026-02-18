"use client";

import { VeltProvider } from "@veltdev/react";

export function VeltProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY || "";

  return <VeltProvider apiKey={apiKey}>{children}</VeltProvider>;
}
