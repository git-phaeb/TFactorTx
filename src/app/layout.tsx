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
        <main className="pt-20">{children}</main>
        <footer className="w-full bg-gray-100 text-gray-700 py-2 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-xs">
            <div className="mb-1 font-semibold text-base text-gray-900">TFactorTx</div>
            <div className="mb-1 text-xs">A placeholder footer section for future content, links, and information.</div>
            <div className="mb-1">
              <span className="inline-block rounded-lg bg-white px-2 py-0.5 text-xs border border-gray-200 text-gray-700">Beta v0.2.0-beta.2</span>
            </div>
            <div className="mb-1 text-xs text-gray-500">
              Not Optimized for Mobile
            </div>
            <div className="text-xs text-gray-500 mb-1 flex items-center justify-center" style={{ display: 'inline', width: 'auto' }}>
              <span className="text-xs align-middle">TFactorTx is marked with</span>
              <a href="https://creativecommons.org/publicdomain/zero/1.0/?ref=chooser-v1" target="_blank" rel="noopener noreferrer" className="text-xs align-middle hover:underline inline-flex items-center" style={{ marginLeft: '2px' }}>
                <span className="text-xs align-middle">CC0 1.0</span>
                <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="Creative Commons" className="inline w-5 h-5 align-middle" style={{ marginLeft: '2px' }} />
                <img src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1" alt="CC0" className="inline w-5 h-5 align-middle" style={{ marginLeft: '2px' }} />
              </a>
            </div>
            <div className="text-xs text-gray-500">
              Built with <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Cursor</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
