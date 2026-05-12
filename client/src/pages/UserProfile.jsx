import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser, setCurrentUser } from "../utils/userHelpers";

export default function UserProfile() {
  const storedUser = getCurrentUser();

  const [user, setUser] = useState({
    name: storedUser?.name || "John Doe",
    email: storedUser?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Customer",
    created_at: "2024-01-15T00:00:00.000Z",
    profileImage:
      storedUser?.profileImage ||
      localStorage.getItem("userProfileImage") ||
      null,
  });

  const [addresses] = useState([
    {
      houseNumber: "12A",
      street: "Luxury Lane",
      lga: "Premium District",
      state: "California",
    },
  ]);

  const isLoadingAddresses = false;

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;

        localStorage.setItem("userProfileImage", imageData);

        setUser((prev) => ({
          ...prev,
          profileImage: imageData,
        }));

        const existingUser = getCurrentUser() || {};

        setCurrentUser({
          ...existingUser,
          name: existingUser.name || user.name,
          email: existingUser.email || user.email,
          profileImage: imageData,
        });

        window.dispatchEvent(new Event("userDataChanged"));
        alert("Profile picture updated successfully!");
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-[#011F5B] rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={50} className="text-white" />
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-[#D4AF37] p-3 rounded-full cursor-pointer hover:bg-[#b8942a] transition-colors shadow-lg">
                <Upload size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </label>
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

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#D4AF37]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold mb-2">Security</h3>
              <p className="text-xs text-gray-500 mb-3">
                Last login: Just now
              </p>

              <Link
                to="/settings"
                className="text-sm text-[#011F5B] hover:text-[#D4AF37]"
              >
                Manage Password & Security →
              </Link>
            </div>
          </div>

          {/* Addresses */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-[#011F5B] mb-4">
              Addresses
            </h3>

            {addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <MapPin size={18} />
                      <div>
                        <h4 className="font-medium">
                          {index === 0
                            ? "Main Address"
                            : `Address ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {addr.houseNumber}, {addr.street}
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
              <p>No address yet</p>
            )}
          </div>

          {/* Navigation */}
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            <Link to="/orders">
              <div className="bg-gray-50 p-6 rounded-lg hover:bg-[#011F5B] hover:text-white transition">
                Order History
              </div>
            </Link>

            <Link to="/settings">
              <div className="bg-gray-50 p-6 rounded-lg hover:bg-[#011F5B] hover:text-white transition">
                Account Settings
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}