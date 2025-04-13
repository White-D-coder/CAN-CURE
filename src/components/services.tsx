import { ServiceCard } from "./service-card";

// SVG components for the service cards
const FlowCytometryIcon = () => (
  <div className="relative w-24 h-24">
    <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-teal-400 border-dashed opacity-20 animate-spin-slow" />
    <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-teal-300 border-dashed opacity-40 animate-spin-slow-reverse" />
    <div className="absolute top-8 left-8 w-12 h-12 rounded-full border-4 border-teal-200 border-dashed opacity-60 animate-spin-slow" />
  </div>
);

const MolecularGeneticsIcon = () => (
  <div className="relative w-24 h-24">
    <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-blue-400/20 animate-pulse" />
    <div className="absolute top-10 left-10 w-10 h-10 rounded-full bg-teal-400/30 animate-pulse" style={{ animationDelay: "300ms" }} />
    <div className="absolute top-4 left-12 w-8 h-8 rounded-full bg-indigo-400/20 animate-pulse" style={{ animationDelay: "600ms" }} />
  </div>
);

export function Services() {
  return (
    <section className="w-full px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Immunotherapy */}
        <ServiceCard
          title="Immunotherapy"
          description="Harnessing the power of the immune system to fight cancer with cutting-edge treatments."
          icon={<FlowCytometryIcon />}
          variant="horizontal"
          className="bg-white"
        />

        {/* Clinical Trials */}
        <ServiceCard
          title="Clinical Trials"
          description="Providing access to innovative cancer treatments through our specialized clinical trials."
          image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2xpbmljYWwlMjBUcmlhbHN8ZW58MHx8MHx8fDA%3D" 
          variant="horizontal"
          className="bg-white"
        />

        {/* Genetic Testing */}
        <ServiceCard
          title="Genetic Testing"
          description="Comprehensive genetic testing to identify cancer risks and personalize treatment plans."
          icon={<MolecularGeneticsIcon />}
          variant="horizontal"
          className="bg-white"
        />

        {/* Radiation Therapy */}
        <ServiceCard
          title="Radiation Therapy"
          description="Advanced radiation therapy techniques to target and destroy cancer cells effectively."
          image="https://plus.unsplash.com/premium_photo-1702598456138-f5ddd6a96679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UmFkaWF0aW9uJTIwVGhlcmFweXxlbnwwfHwwfHx8MA%3D%3D" // Replaced with a video
          variant="horizontal"
          className="bg-white"
        />
      </div>
    </section>
  );
}
