import Link from "next/link";

export function NavigationBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">TFactorTx</Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/database" className="text-gray-300 hover:text-white">
            Database
          </Link>
          <Link
            href="/documentation"
            className="text-gray-300 hover:text-white"
          >
            Documentation
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
