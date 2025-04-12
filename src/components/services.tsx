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
        {/* Flow Cytometry */}
        <ServiceCard
          title="Flow Cytometry"
          description="We offer the fastest flow cytometry capabilities at all of our locations."
          icon={<FlowCytometryIcon />}
          variant="horizontal"
          className="bg-white"
        />

        {/* Clinical Trials */}
        <ServiceCard
          title="Clinical Trials"
          description="Our mission is to assist pharma companies in their clinical trials with our specialized services."
          image="/scientist-lab.jpg"
          variant="horizontal"
          className="bg-white"
        />

        {/* Molecular Genetics */}
        <ServiceCard
          title="Molecular Genetics"
          description="We offer a variety of test across our facilities for molecular genetic analysis."
          icon={<MolecularGeneticsIcon />}
          variant="horizontal"
          className="bg-white"
        />

        {/* Histology */}
        <ServiceCard
          title="Histology"
          description="Specimens received are processed, sectioned, and stained for microscopic evaluation."
          image="/histology-colors.jpg"
          variant="horizontal"
          className="bg-white"
        />
      </div>
    </section>
  );
}
