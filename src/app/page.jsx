import { Hero } from "@/components/hero.jsx";
import { Services } from "@/components/Services.jsx";
import { Footer } from "@/components/Footer.jsx";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-8 space-y-8">
          <Hero />
          <Services />
        
        </div>
        <Footer />
      </div>
    </main>
  );
}
