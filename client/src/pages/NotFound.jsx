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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative font-mono">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#00f5ff22 1px, transparent 1px), linear-gradient(90deg, #00f5ff22 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-cyan-500 opacity-5 blur-[120px]" />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)",
        }}
      />

      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto select-none">
        {/* 404 Number */}
        <div className="relative mb-2">
          <h1
            className={`text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 transition-all duration-100 ${
              glitchActive ? "translate-x-1 opacity-80" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "3px 0 #ff005c, -3px 0 #00f5ff"
                : "0 0 80px rgba(0,245,255,0.3)",
              fontFamily: "'Courier New', monospace",
            }}
          >
            404
          </h1>

          {/* Glitch duplicate layers */}
          {glitchActive && (
            <>
              <h1
                className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-[#ff005c] opacity-60 translate-x-2"
                style={{ fontFamily: "'Courier New', monospace", clipPath: "inset(20% 0 60% 0)" }}
                aria-hidden
              >
                404
              </h1>
              <h1
                className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-[#00f5ff] opacity-60 -translate-x-2"
                style={{ fontFamily: "'Courier New', monospace", clipPath: "inset(60% 0 20% 0)" }}
                aria-hidden
              >
                404
              </h1>
            </>
          )}
        </div>

        {/* Terminal-style label */}
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase">
            Page Not Found
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-base md:text-lg mb-2 leading-relaxed">
          The route you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-slate-600 text-sm mb-10 tracking-widest">
          <span className="text-cyan-700">{">"}</span> ERROR_CODE: ROUTE_UNDEFINED
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="group relative inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3.5 rounded text-sm tracking-widest uppercase transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10">← Go Home</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </a>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 font-medium px-8 py-3.5 rounded text-sm tracking-widest uppercase transition-all duration-200"
          >
            ↩ Go Back
          </button>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex items-center gap-4 justify-center opacity-30">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500" />
          <span className="text-cyan-700 text-xs tracking-widest">SYS://NULL</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500" />
        </div>
      </div>
    </div>
  );
}