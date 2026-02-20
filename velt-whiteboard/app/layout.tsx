import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VeltProviderWrapper } from "@/components/providers/velt-provider-wrapper";
import { VeltAuthenticator } from "@/components/providers/velt-authenticator";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collaborative Whiteboard - Velt + ReactFlow",
  description:
    "Real-time collaborative whiteboard with Velt CRDT and ReactFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VeltProviderWrapper>
            <VeltAuthenticator>{children}</VeltAuthenticator>
          </VeltProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
