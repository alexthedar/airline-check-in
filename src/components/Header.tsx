import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Airline Check-In
            </Link>
          </div>
          <div aria-label="main-nav" className="flex space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Check-In
            </Link>
            <Link
              href="/status"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Check Status
            </Link>
            <Link
              href="/admin"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
