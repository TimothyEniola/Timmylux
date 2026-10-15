import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] p-8">
      <div className="relative flex items-center justify-center w-16 h-16 mb-6">
        {/* Faded Navy background track */}
        <div className="absolute inset-0 rounded-full border-4 border-[#011F5B]/10"></div>

        {/* Spinning Gold ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D4AF37] border-r-[#D4AF37]/50 animate-spin"></div>

        {/* Pulsing Navy center dot */}
        <div className="w-3 h-3 bg-[#011F5B] rounded-full animate-pulse shadow-sm"></div>
      </div>

      {/* Premium Typography */}
      <p className="text-[#011F5B] font-bold tracking-[0.2em] uppercase text-xs animate-pulse opacity-80">
        {text}
      </p>
    </div>
  );
}
