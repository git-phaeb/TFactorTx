import Link from "next/link";

export function NavigationBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-2 z-50 shadow-lg">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Left: Logo */}
          <div className="text-white text-lg font-bold">
            <Link href="/">TFactorTx</Link>
          </div>
          {/* Center: Beta badge, absolutely centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="inline-block rounded-lg bg-gray-700 px-2 py-1 text-xs text-gray-200">
              Beta v0.2.0-beta.1
            </div>
          </div>
          {/* Right: Navigation links */}
          <div className="space-x-4 flex items-center">
            <Link href="/" className="text-gray-300 hover:text-white inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>Home</span>
            </Link>
            <Link href="/database" className="text-gray-300 hover:text-white inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              <span>Database</span>
            </Link>
            <Link
              href="/documentation"
              className="text-gray-300 hover:text-white inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <rect x="4" y="2" width="12" height="16" rx="2" />
                <rect x="7" y="6" width="6" height="1.2" rx="0.6" fill="black"/>
                <rect x="7" y="10" width="6" height="1.2" rx="0.6" fill="black"/>
                <rect x="7" y="14" width="6" height="1.2" rx="0.6" fill="black"/>
              </svg>
              <span>Documentation</span>
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
