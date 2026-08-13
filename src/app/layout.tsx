import type { Metadata } from "next";
import {
  Inter,
  Permanent_Marker,
  Caveat,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x-algorithm-explained-ten.vercel.app"),
  title: "Why am I seeing this? — The X algorithm, explained",
  description:
    "A short, visual guide to how X decides what goes in your For You feed — drawn from xAI's open-source x-algorithm repository. Unofficial.",
  openGraph: {
    title: "Why am I seeing this? — The X algorithm, explained",
    description:
      "A short, visual guide to how X decides what goes in your For You feed. Unofficial explainer of the open-source x-algorithm repo.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why am I seeing this? — The X algorithm, explained",
    description:
      "A short, visual guide to how X picks your For You feed. Unofficial.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${permanentMarker.variable} ${caveat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* the scroll reveals are an enhancement; without scripting the page
            simply arrives already drawn */}
        <noscript>
          <style>{`.rise{opacity:1;transform:none}.ink-path{stroke-dashoffset:0}.swipe-draw::before{clip-path:polygon(1% 6%,99% 0%,100% 88%,97% 100%,3% 96%,0% 40%)}`}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
