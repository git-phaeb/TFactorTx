import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationBar } from "@/components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TFactorTx",
  description: "Transcription Factor Database",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <NavigationBar />
        <main className="p-4 flex-1 pt-20">{children}</main>
        <footer className="w-full bg-gray-900 text-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-2 font-semibold text-lg">TFactorTx Platform</div>
            <div className="mb-2 text-sm">A placeholder footer section for future content, links, and information.</div>
            <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} TFactorTx. All rights reserved.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
