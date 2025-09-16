"use client";

import Link from "next/link";
import Image from "next/image";

export function NavigationBar() {


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white py-4 px-2 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-6">
            <div className="text-gray-900 text-lg font-bold">
              <Link href="/">
                <Image
                  src="/250904_TFactorTx_Logo_v3_Path.svg"
                  alt="TFactorTx"
                  width={160}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            {/* Navigation links */}
            <div className="space-x-4 flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900 inline-flex items-center">
                <span>Home</span>
              </Link>
              <Link href="/database" className="text-gray-700 hover:text-gray-900 inline-flex items-center">
                <span>Database</span>
              </Link>
              <Link
                href="/documentation"
                className="text-gray-700 hover:text-gray-900 inline-flex items-center"
              >
                <span>Documentation</span>
              </Link>
            </div>
          </div>
          {/* Right: Last Updated + Beta Badge + Mobile Notice + Contact */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Last Updated: 16.09.2025</div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg bg-white px-2 py-0.5 text-xs border border-gray-200 text-gray-700">Beta v0.2.0-beta.2</span>
              <div className="text-xs text-gray-500">
                Not Optimized for Mobile
              </div>
            </div>
            <button 
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
              title="Contact us"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/*
Stored nav SVG icons for optional restoration:

Home icon:
<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
</svg>

Database icon:
<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
</svg>

Documentation icon:
<svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
  <rect x="4" y="2" width="12" height="16" rx="2" />
  <rect x="7" y="6" width="6" height="1.2" rx="0.6" fill="currentColor"/>
  <rect x="7" y="10" width="6" height="1.2" rx="0.6" fill="currentColor"/>
  <rect x="7" y="14" width="6" height="1.2" rx="0.6" fill="currentColor"/>
</svg>
*/
