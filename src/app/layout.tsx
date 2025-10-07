import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationBar } from "@/components/NavigationBar";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TFactorTx",
  description: "Transcription Factor Database",
  icons: [
    { rel: "icon", url: "/250903_TFactorTx_favicon.svg", type: "image/svg+xml" },
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
        <footer className="w-full bg-gray-100 text-gray-700 py-2">
          <div className="container mx-auto px-4 text-center text-xs">
            <div className="mb-1 flex justify-center">
              <Image
                src="/250904_TFactorTx_Logo_v3_Path.svg"
                alt="TFactorTx"
                width={160}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <div className="mb-1">
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <span className="text-xs align-middle">TFactorTx is marked with</span>
                <a href="https://creativecommons.org/publicdomain/zero/1.0/?ref=chooser-v1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-xs align-middle inline-flex items-center" style={{ marginLeft: '2px' }}>
                  <span className="text-xs align-middle">CC0 1.0</span>
                  <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="Creative Commons" className="inline w-5 h-5 align-middle" style={{ marginLeft: '2px' }} />
                  <img src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1" alt="CC0" className="inline w-5 h-5 align-middle" style={{ marginLeft: '2px' }} />
                </a>
                <span className="text-xs align-middle mx-2">|</span>
                <span className="text-xs align-middle">Version history on GitHub</span>
                <a href="https://github.com/git-phaeb/TFactorTx" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="/github-mark.png" alt="GitHub" width="16" height="16" className="inline-block" /></a>
                <span className="text-xs align-middle mx-2">|</span>
                <span className="text-xs align-middle">Follow TFactorTx</span>
                <a href="https://www.linkedin.com/company/tfactortx/" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="/LI-In-Bug.png" alt="LinkedIn" width="16" height="16" className="inline-block" /></a>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Built with <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Cursor</a> by Dr. Fabian Fischer <a href="https://orcid.org/0000-0002-4159-3178" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID" width="16" height="16" className="inline-block" /></a> <a href="https://www.linkedin.com/in/dr-fabian-fischer/" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="/LI-In-Bug.png" alt="LinkedIn" width="16" height="16" className="inline-block" /></a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
