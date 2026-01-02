import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration to make it look nice */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      
      <div className="z-10 text-center mb-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4 font-sans">
          Liquid Navigation
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          A smooth, organic bottom navigation bar with elastic morphing effects.
        </p>
      </div>

      <div className="z-10 scale-125 transform origin-top">
        <Navbar />
      </div>
      
      <div className="absolute bottom-10 text-sm text-gray-400">
        Built with React + Framer Motion
      </div>
    </div>
  );
}
