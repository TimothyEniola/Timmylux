import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserProfile() {
  // Static user data (frontend demo)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Customer",
    created_at: "2024-01-15T00:00:00.000Z",
  };

  // Mock address state
  const [addresses] = useState([
    {
      houseNumber: "12A",
      street: "Luxury Lane",
      lga: "Premium District",
      state: "California",
    },
  ]);

  const isLoadingAddresses = false;

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-[#011F5B] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#011F5B]">
                {user.name}
              </h2>
              <p className="text-gray-600 font-medium capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* Info + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-xs font-semibold text-blue-800 uppercase mb-1">
                    Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <p className="text-blue-900 font-bold">Active</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h3 className="text-xs font-semibold text-amber-800 uppercase mb-1">
                    Role
                  </h3>
                  <p className="text-amber-900 font-bold capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Security
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Last login: Just now
                </p>
                <Link
                  to="/settings"
                  className="text-sm text-[#011F5B] hover:text-[#D4AF37] font-medium"
                >
                  Manage Password & Security →
                </Link>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#011F5B]">
                Addresses
              </h3>
              <Link
                to="/settings"
                className="text-sm text-[#D4AF37] font-semibold hover:underline"
              >
                + Add New
              </Link>
            </div>

            {isLoadingAddresses ? (
              <p className="text-gray-500 text-sm">
                Loading addresses...
              </p>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="text-gray-400 mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="font-medium text-[#011F5B]">
                          {index === 0
                            ? "Main Address"
                            : `Address ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {[addr.houseNumber && `House ${addr.houseNumber}`, addr.street]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.lga}, {addr.state}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                <MapPin
                  className="mx-auto text-gray-300 mb-2"
                  size={32}
                />
                <p className="text-gray-500">
                  No addresses saved yet.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <Link to="/order-history" className="block group">
              <div className="bg-gray-50 hover:bg-[#011F5B] p-6 rounded-lg transition">
                <h3 className="text-lg font-bold text-[#011F5B] group-hover:text-white mb-2">
                  Order History
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300">
                  View your past orders and status.
                </p>
              </div>
            </Link>

            <Link to="/track-order" className="block group">
              <div className="bg-gray-50 hover:bg-[#011F5B] p-6 rounded-lg transition">
                <h3 className="text-lg font-bold text-[#011F5B] group-hover:text-white mb-2">
                  Track Orders
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300">
                  Check shipment location in real-time.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}