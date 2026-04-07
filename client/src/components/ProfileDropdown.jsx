import { useState } from "react";
import { ChevronDown, User, Settings, Package, Truck, LogOut, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const profilePages = [
  {
    name: "Profile",
    path: "/profile",
    icon: User,
    description: "View and edit your profile information",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    description: "Manage your account settings",
  },
  {
    name: "Orders",
    path: "/orders",
    icon: Package,
    description: "View your order history",
  },
  {
    name: "Track Order",
    path: "/track-order",
    icon: Truck,
    description: "Track your current orders",
  },
];

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const currentPage = profilePages.find(
    (page) => page.path === location.pathname
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <User size={20} className="text-[#011F5B]" />

        <span className="font-medium text-[#011F5B]">
          {currentPage ? currentPage.name : "Profile"}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#011F5B] text-lg">
                    Account Pages
                  </h3>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  {profilePages.map((page) => {
                    const Icon = page.icon;
                    const isActive =
                      location.pathname === page.path;

                    return (
                      <Link
                        key={page.path}
                        to={page.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-start gap-3 p-4 rounded-lg transition-colors border ${
                          isActive
                            ? "bg-[#011F5B] text-white border-[#011F5B]"
                            : "hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={
                            isActive
                              ? "text-white"
                              : "text-[#011F5B]"
                          }
                        />

                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              isActive
                                ? "text-white"
                                : "text-[#011F5B]"
                            }`}
                          >
                            {page.name}
                          </div>

                          <div
                            className={`text-sm mt-1 ${
                              isActive
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            {page.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Auth Actions */}
                <div className="border-t pt-3 mt-3 space-y-2">
                  <button
                    onClick={() => {
                      alert("Sign out functionality - Frontend only");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-300"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span className="font-medium">Sign Out</span>
                  </button>

                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <LogIn size={16} className="text-blue-600" />
                    <span className="font-medium">Sign In Again</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}