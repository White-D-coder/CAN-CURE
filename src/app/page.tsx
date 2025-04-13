import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="px-4 py-8 space-y-8">
          <Hero />
          <Services />
        </div>
      </div>
    </main>
  );
}
