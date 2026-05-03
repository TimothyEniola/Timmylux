import { useState, useEffect } from "react";
import { User, Shield, Bell, Settings } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [policies, setPolicies] = useState({
    repairPolicy: "For repairs, please call our support team. We only provide repair services for goods purchased directly from us.",
    returnPolicy: "Items must be returned within 1-2 weeks after delivery. Contact our support team to arrange collection. We only accept returns for goods purchased from us.",
    returnDeadline: "1-2 weeks",
    warrantyInfo: "All furniture comes with a 1-year manufacturing defect warranty",
    supportPhone: "+234 814 083 8535",
    supportEmail: "support@timmyluxfurniture.com",
  });

  useEffect(() => {
    const savedPolicies = localStorage.getItem("adminPolicies");
    if (savedPolicies) {
      setPolicies(JSON.parse(savedPolicies));
    }
  }, []);

  const savePolicies = () => {
    localStorage.setItem("adminPolicies", JSON.stringify(policies));
    alert("Policies saved successfully!");
  };

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
          Admin Settings
        </h1>

        <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">

          {/* Responsive Tabs */}
          <div className="border-b overflow-x-auto">
            <div className="flex min-w-max">
              {["profile", "security", "notifications", "policies"].map(
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
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
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

            {/* POLICIES TAB */}
            {activeTab === "policies" && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Settings size={18} /> Company Policies & Information
                </h2>

                <p className="text-sm text-gray-600">
                  Update these policies which will be displayed to customers on the Help Center page.
                </p>

                <div className="space-y-6">
                  {/* Repair Policy */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                      Repair & Service Policy
                    </label>
                    <textarea
                      value={policies.repairPolicy}
                      onChange={(e) =>
                        setPolicies({ ...policies, repairPolicy: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      placeholder="Enter repair policy details..."
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      ℹ️ Remember to mention: Only for goods purchased from us, how to contact support, what's covered
                    </p>
                  </div>

                  {/* Return Policy */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                      Return & Exchange Policy
                    </label>
                    <textarea
                      value={policies.returnPolicy}
                      onChange={(e) =>
                        setPolicies({ ...policies, returnPolicy: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      placeholder="Enter return policy details..."
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      ℹ️ Important: Include the return deadline to ensure customers understand the 1-2 week window
                    </p>
                  </div>

                  {/* Return Deadline */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                      Return Deadline (After Delivery)
                    </label>
                    <input
                      type="text"
                      value={policies.returnDeadline}
                      onChange={(e) =>
                        setPolicies({ ...policies, returnDeadline: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      placeholder="e.g., 1-2 weeks, 14 days, 30 days"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      ⚠️ This is critical - after this period, we do not collect items
                    </p>
                  </div>

                  {/* Warranty Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                      Warranty Information
                    </label>
                    <textarea
                      value={policies.warrantyInfo}
                      onChange={(e) =>
                        setPolicies({ ...policies, warrantyInfo: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      placeholder="Enter warranty details..."
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      ℹ️ Example: 1-year manufacturing defect warranty, what's covered, what's not
                    </p>
                  </div>

                  {/* Support Contact Information */}
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-[#011F5B]">Support Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Phone Number
                      </label>
                      <input
                        type="tel"
                        value={policies.supportPhone}
                        onChange={(e) =>
                          setPolicies({ ...policies, supportPhone: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                        placeholder="+234 814 083 8535"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        value={policies.supportEmail}
                        onChange={(e) =>
                          setPolicies({ ...policies, supportEmail: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                        placeholder="support@timmyluxfurniture.com"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={savePolicies} 
                    className="w-full bg-[#011F5B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0e2c5b] transition"
                  >
                    Save All Policies
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Tip:</strong> These policies will be displayed to customers on the Help Center. Make sure they are clear and complete to avoid customer confusion.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}