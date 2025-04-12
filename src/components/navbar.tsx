import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-black mr-1">fusi</span>
            <span className="text-teal-500">●</span>
            <span className="text-black">n</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#what-we-do" className="text-gray-700 hover:text-teal-500 transition-colors">
            What we do
          </Link>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-teal-500 transition-colors">
              Our offerings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <Link href="#pricing" className="text-gray-700 hover:text-teal-500 transition-colors">
            Pricing
          </Link>
          <Link href="#blog" className="text-gray-700 hover:text-teal-500 transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-teal-500 transition-colors">
            Log in
          </Link>
          <Link
            href="/demo"
            className="bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center font-medium transition-colors border border-gray-200"
          >
            Get Demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
