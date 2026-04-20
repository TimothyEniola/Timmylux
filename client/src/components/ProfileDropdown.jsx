// import { useState, useRef, useEffect } from "react";
// import {
//   User,
//   Settings,
//   Package,
//   Truck,
//   LogOut,
//   HelpCircle,
//   Sparkles,
//   ChevronRight,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function ProfileDropdown() {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   // 🔥 Replace with real data later
//   const userName = "Yemitan Timothy";
//   const userPlan = "Free";
//   const profileImage = null;

//   // close on outside click
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       {/* TRIGGER BUTTON */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 transition"
//       >
//         <div className="w-9 h-9 rounded-full bg-yellow-600 flex items-center justify-center text-white text-sm font-semibold">
//           {userName
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .slice(0, 2)}
//         </div>

//         <div className="flex flex-col text-left">
//           <span className="text-sm font-medium truncate">
//             {userName}
//           </span>
//           <span className="text-xs text-gray-400">
//             {userPlan}
//           </span>
//         </div>
//       </button>

//       {/* FLOATING PANEL */}
//       {open && (
//         <div className="absolute bottom-full left-0 mb-2 w-72 bg-white text-black rounded-2xl shadow-2xl border border-gray-200 z-[999] overflow-hidden">

//           {/* HEADER */}
//           <div className="flex items-center justify-between px-4 py-3">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-semibold">
//                 {userName
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")
//                   .slice(0, 2)}
//               </div>

//               <div>
//                 <div className="text-sm font-semibold">
//                   {userName}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {userPlan}
//                 </div>
//               </div>
//             </div>

//             <ChevronRight size={16} className="text-gray-400" />
//           </div>

//           <div className="border-t" />

//           {/* MAIN LINKS */}
//           <div className="py-1">
//             <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100">
//               <Sparkles size={16} />
//               Upgrade for free
//             </button>

//             <Link
//               to="/profile"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
//             >
//               <User size={16} />
//               Profile
//             </Link>

//             <Link
//               to="/settings"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
//             >
//               <Settings size={16} />
//               Settings
//             </Link>

//             <Link
//               to="/orders"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
//             >
//               <Package size={16} />
//               Orders
//             </Link>

//             <Link
//               to="/track-order"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
//             >
//               <Truck size={16} />
//               Track Order
//             </Link>
//           </div>

//           <div className="border-t" />

//           {/* FOOTER LINKS */}
//           <div className="py-1">
//             <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100">
//               <HelpCircle size={16} />
//               Help
//             </button>

//             <button
//               onClick={() => {
//                 alert("Logout logic here");
//                 setOpen(false);
//               }}
//               className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-red-50 text-red-600"
//             >
//               <LogOut size={16} />
//               Log out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import {
  User, Settings, Package, Truck, LogOut,
  HelpCircle, Sparkles, ChevronRight, ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const userName = "Yemitan Timothy";
  const userPlan = "Free";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* FLOATING PANEL — renders above trigger */}
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-68 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden origin-bottom-left animate-slide-up">

          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-amber-50 to-yellow-100 border-b border-yellow-200 cursor-pointer hover:from-yellow-100 hover:to-amber-200 transition">
            <div className="w-10 h-10 rounded-full bg-yellow-700 border-2 border-yellow-400/50 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-yellow-300 rounded px-1.5 py-0.5 mt-0.5">
                <Sparkles size={9} /> {userPlan} plan
              </span>
            </div>
            <ChevronRight size={14} className="text-gray-400" />
          </div>

          {/* UPGRADE */}
          <div className="py-1">
            <button className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition">
              <Sparkles size={14} className="text-amber-500" />
              Upgrade for free
            </button>
          </div>

          <div className="border-t border-gray-100" />

          {/* MAIN LINKS */}
          <div className="py-1">
            {[
              { to: "/profile", icon: <User size={14} />, label: "Profile" },
              { to: "/settings", icon: <Settings size={14} />, label: "Settings" },
              { to: "/orders", icon: <Package size={14} />, label: "Orders" },
              { to: "/track-order", icon: <Truck size={14} />, label: "Track Order" },
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="text-gray-400">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100" />

          {/* FOOTER */}
          <div className="py-1">
            <button className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
              <HelpCircle size={14} className="text-gray-400" />
              Help
            </button>
            <button
              onClick={() => { alert("Logout logic here"); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* TRIGGER — never moves */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 transition"
      >
        <div className="w-9 h-9 rounded-full bg-yellow-700 border-2 border-yellow-500/40 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col text-left flex-1">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-gray-400">{userPlan}</span>
        </div>
        <ChevronUp
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}