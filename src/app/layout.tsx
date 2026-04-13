import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AgentShelf — AI Agent & Tool Directory",
  description:
    "AgentShelf is the curated directory of AI agents, tools, and assistants. Browse, review, and collect the best AI tools — all on one shelf.",
  keywords: [
    "AI tools",
    "AI agents",
    "AI directory",
    "LLM tools",
    "ChatGPT alternatives",
    "AI assistant",
  ],
  authors: [{ name: "AgentShelf" }],
  metadataBase: new URL("https://agentshelf.io"),
  openGraph: {
    title: "AgentShelf — AI Agent & Tool Directory",
    description:
      "The curated shelf for AI agents and tools. Browse top-rated AI tools, read community reviews, and save your favorites.",
    url: "https://agentshelf.io",
    siteName: "AgentShelf",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgentShelf — AI Agent & Tool Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentShelf — AI Agent & Tool Directory",
    description:
      "The curated shelf for AI agents and tools. Browse, review, and collect.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
