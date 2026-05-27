import { useState, useEffect } from "react";

export default function ErrorPage({ error, resetErrorBoundary }) {
  const [progress, setProgress] = useState(0);

  // Animate a "diagnostic" progress bar on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const errorMessage =
    error?.message || "An unexpected error occurred. Our system hit a wall it didn't see coming.";

  const diagnostics = [
    { label: "Component Tree", status: "CORRUPTED", color: "text-red-400" },
    { label: "State Manager", status: "UNSTABLE", color: "text-orange-400" },
    { label: "Runtime", status: "HALTED", color: "text-red-500" },
    { label: "Recovery Mode", status: "AVAILABLE", color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gold glow blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-[#D4AF37] opacity-5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-10">
        {/* Error code */}
        <div className="mb-8 text-center">
          <h1 className="text-7xl md:text-8xl font-black text-[#011F5B] leading-none mb-2">
            500
          </h1>
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase font-bold">
            System Error
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-8" />

        {/* Error message box */}
        <div className="bg-[#011F5B]/5 border border-[#D4AF37]/30 rounded-2xl p-6 mb-8">
          <p className="text-[#011F5B] text-xs tracking-widest uppercase font-bold mb-2">
            Error Details
          </p>
          <p className="text-[#011F5B] text-base leading-relaxed">{errorMessage}</p>
        </div>

        {/* Diagnostic info */}
        <div className="bg-[#011F5B]/3 border border-[#D4AF37]/20 rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#D4AF37]/20">
            <span className="text-[#011F5B] text-xs tracking-widest uppercase font-bold">
              System Status
            </span>
          </div>
          <div className="divide-y divide-[#D4AF37]/10">
            {diagnostics.map((d, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3">
                <span className="text-[#011F5B] text-xs font-semibold">{d.label}</span>
                <span className={`text-xs font-bold tracking-widest uppercase ${d.color}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 bg-[#D4AF37]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#011F5B] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center justify-center gap-2 bg-[#011F5B] hover:bg-[#0d2f7a] text-white font-bold px-8 py-3 rounded-xl transition-all"
          >
            ← Go to Home
          </button>
          <button
            onClick={() => resetErrorBoundary && resetErrorBoundary()}
            className="flex items-center justify-center gap-2 border-2 border-[#D4AF37] text-[#011F5B] hover:bg-[#D4AF37]/5 font-bold px-8 py-3 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
                <span className="text-slate-500 text-xs">{d.label}</span>
                <span className={`text-xs font-bold tracking-widest ${d.color}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1.5">
            <span className="text-slate-600 text-xs tracking-wider">
              Recovery scan
            </span>
            <span className="text-slate-500 text-xs">{progress}%</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-orange-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {resetErrorBoundary ? (
            <button
              onClick={resetErrorBoundary}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded text-sm tracking-widest uppercase transition-colors duration-200"
            >
              ↺ Try Again
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded text-sm tracking-widest uppercase transition-colors duration-200"
            >
              ↺ Reload Page
            </button>
          )}

          <a
            href="/"
            className="flex-1 text-center border border-slate-700 hover:border-red-800 text-slate-400 hover:text-red-400 font-medium py-3 px-6 rounded text-sm tracking-widest uppercase transition-all duration-200"
          >
            ← Go Home
          </a>
        </div>

        {/* Footer note */}
        <p className="text-slate-700 text-xs text-center mt-8 tracking-wider">
          If this keeps happening, please contact support.
        </p>
      </div>
    </div>
  );
}