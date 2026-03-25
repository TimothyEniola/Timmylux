import { useState } from "react";
import { User, Shield, Bell } from "lucide-react";

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
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
          Account Settings
        </h1>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b flex">
            {["profile", "address", "security", "notifications"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium ${
                    activeTab === tab
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <form className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User size={18} /> Profile Information
                </h2>

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

                <button className="btn-primary" disabled>
                  Update Profile (Disabled)
                </button>
              </form>
            )}

            {activeTab === "address" && (
              <form className="space-y-4">
                <h2 className="text-xl font-bold">
                  Address Information
                </h2>

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

                <button className="btn-primary" disabled>
                  Save Address (Disabled)
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-md"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
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

            {activeTab === "notifications" && (
              <div className="flex items-center gap-2 text-gray-600">
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