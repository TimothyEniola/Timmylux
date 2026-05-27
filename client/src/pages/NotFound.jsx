import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden relative">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#D4AF3722 1px, transparent 1px), linear-gradient(90deg, #D4AF3722 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#D4AF37] opacity-8 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto select-none">
        {/* 404 Number */}
        <div className="relative mb-2">
          <h1
            className={`text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#011F5B] transition-all duration-100 ${
              glitchActive ? "translate-x-1 opacity-80" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "3px 0 #011F5B, -3px 0 #D4AF37"
                : "0 0 80px rgba(212, 175, 55, 0.3)",
            }}
          >
            404
          </h1>

          {/* Glitch duplicate layers */}
          {glitchActive && (
            <>
              <h1
                className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-[#011F5B] opacity-60 translate-x-2"
                style={{ clipPath: "inset(20% 0 60% 0)" }}
                aria-hidden
              >
                404
              </h1>
              <h1
                className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-[#D4AF37] opacity-60 -translate-x-2"
                style={{ clipPath: "inset(60% 0 20% 0)" }}
                aria-hidden
              >
                404
              </h1>
            </>
          )}
        </div>

        {/* Label */}
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[#011F5B] text-sm tracking-[0.3em] uppercase font-bold">
            Page Not Found
          </span>
        </div>

        {/* Description */}
        <p className="text-[#011F5B] text-lg md:text-xl font-semibold mb-2">
          We couldn't find what you're looking for.
        </p>
        <p className="text-[#011F5B]/60 text-base mb-10">
          The page you requested doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#011F5B] hover:bg-[#0d2f7a] text-white font-bold px-8 py-4 rounded-xl text-base transition-all"
          >
            ← Back to Home
          </a>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border-2 border-[#D4AF37] text-[#011F5B] hover:bg-[#D4AF37]/5 font-bold px-8 py-4 rounded-xl text-base transition-all"
          >
            ↩ Go Back
          </button>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex items-center gap-4 justify-center opacity-30">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs tracking-widest">LUXURY FURNITURE</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
      </div>
    </div>
  );
}