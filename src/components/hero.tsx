import Link from "next/link";

export function Hero() {
  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col relative z-10">
        <div className="max-w-2xl">
            <h1
              className="text-5xl font-bold text-gray-800 mb-6 leading-tight opacity-0.5 animate-fade-in-fast"
              style={{ animation: "fadeIn 0.2s forwards" }}
            >
              The future of<br />
              Leveraging science
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-xl">
            Together, we are advancing groundbreaking research and innovative solutions to bring hope and healing to those affected by cancer.
            </p>
          <Link
            href="#proposition"
            className="flex items-center bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium transition-colors w-fit"
          >
            Explore our proposition
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
              className="ml-2 h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Background gradient elements */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <div className="absolute right-0 top-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-teal-200 to-teal-400/30 blur-sm opacity-70" />
        <div className="absolute right-40 top-10 w-40 h-40 rounded-full bg-teal-300/30 blur-md" />
        <div className="absolute right-60 bottom-20 w-60 h-60 rounded-full bg-gradient-to-tr from-teal-100 to-teal-300/20 blur-sm" />
      </div>
    </section>
    
  );
}
