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
    <div className="min-h-screen bg-[#0d0a0a] flex items-center justify-center relative overflow-hidden font-mono">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ff3b3b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Red glow blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] rounded-full bg-red-700 opacity-[0.07] blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-10">
        {/* Header badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-orange-500 opacity-60" />
            <span className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <span className="text-slate-600 text-xs tracking-widest uppercase">
            system_crash.log
          </span>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <p className="text-red-600 text-xs tracking-[0.4em] uppercase mb-1">
            Critical Error Detected
          </p>
          <h1
            className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 leading-none"
            style={{ textShadow: "0 0 60px rgba(255,50,50,0.2)" }}
          >
            500
          </h1>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-red-800/60 via-red-500/30 to-transparent mb-6" />

        {/* Error message box */}
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-xs tracking-widest uppercase mb-2 opacity-60">
            Exception Message
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{errorMessage}</p>
        </div>

        {/* Diagnostic table */}
        <div className="bg-black/40 border border-slate-800 rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 text-xs tracking-widest uppercase">
              Diagnostics
            </span>
            <span className="text-slate-600 text-xs">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="divide-y divide-slate-900">
            {diagnostics.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
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