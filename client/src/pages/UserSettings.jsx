import { useState } from "react";
import { User, Shield, Bell } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addressData, setAddressData] = useState({
    street: "",
    lga: "",
    state: "",
    houseNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated (frontend only)");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">
            Account Settings
          </h1>
          <ProfileDropdown />
        </div>

        <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">
          
          {/* Responsive Tabs */}
          <div className="border-b overflow-x-auto">
            <div className="flex min-w-max">
              {["profile", "address", "security", "notifications"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                        : "text-gray-600 hover:text-[#011F5B]"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <User size={18} /> Profile Information
                </h2>

                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg"
                  />
                </div>

                <button className="btn-primary w-full sm:w-auto" disabled>
                  Update Profile (Disabled)
                </button>
              </form>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <form className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold">
                  Address Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Street"
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        street: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="House Number"
                    value={addressData.houseNumber}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        houseNumber: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="LGA"
                    value={addressData.lga}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        lga: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        state: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-lg"
                  />
                </div>

                <button className="btn-primary w-full sm:w-auto" disabled>
                  Save Address (Disabled)
                </button>
              </form>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-md w-full"
              >
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Shield size={18} /> Change Password
                </h2>

                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                  required
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                  required
                />

                <button type="submit" className="btn-primary w-full">
                  Update Password
                </button>
              </form>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                <Bell size={18} />
                Notification settings coming soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}