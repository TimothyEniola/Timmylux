import { useState } from "react";
import { User, Shield, Bell } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false,
  });

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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-8">
          Account Settings
        </h1>

        <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">

          {/* Responsive Tabs */}
          <div className="border-b overflow-x-auto">
            <div className="flex min-w-max">
              {["profile", "address", "security", "notifications"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === tab
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
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(notificationPrefs).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
                      <span className="text-sm font-medium capitalize">{key} alerts</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() =>
                          setNotificationPrefs((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[#011F5B] focus:ring-[#011F5B]"
                      />
                    </label>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell size={18} />
                      <span className="font-semibold">Recent Notifications</span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-[#011F5B] hover:text-[#7d7218]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-2xl p-4 border ${notif.read ? "border-gray-200 bg-white" : "border-[#D4AF37]/20 bg-[#fdf6e0]"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{new Date(notif.date).toLocaleString()}</p>
                            </div>
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="mt-3 text-xs text-blue-600 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}