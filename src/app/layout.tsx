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
        <main className="flex-1 pt-20">{children}</main>
        <footer className="w-full bg-gray-900 text-gray-200 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-2 font-semibold text-lg">TFactorTx</div>
            <div className="mb-2 text-sm">A placeholder footer section for future content, links, and information.</div>
            <div className="mb-2">
              <span className="inline-block rounded-lg bg-gray-700 px-2 py-1 text-xs">
                Alpha v0.1.0
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-2">&copy; {new Date().getFullYear()} TFactorTx. All rights reserved.</div>
            <div className="text-xs text-gray-500">
              Built with ❤️ using <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Cursor AI</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
