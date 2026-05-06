import { useState, useEffect } from "react";
import { User, Shield, Bell, Settings, Save } from "lucide-react";
import { toast } from "react-toastify";
import useNotificationStore from "../store/notificationStore";
import { getCurrentUser, setCurrentUser } from "../utils/userHelpers";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [policies, setPolicies] = useState({
    repairPolicy:
      "For repairs, please call our support team. We only provide repair services for goods purchased directly from us.",
    returnPolicy:
      "Items must be returned within 1-2 weeks after delivery. Contact our support team to arrange collection. We only accept returns for goods purchased from us.",
    returnDeadline: "1-2 weeks",
    warrantyInfo: "All furniture comes with a 1-year manufacturing defect warranty",
    supportPhone: "+234 814 083 8535",
    supportEmail: "support@timmyluxfurniture.com",
  });

  // Load saved data on mount
  useEffect(() => {
    const savedPolicies = localStorage.getItem("adminPolicies");
    if (savedPolicies) setPolicies(JSON.parse(savedPolicies));

    // Load profile: prefer adminProfile, fallback to currentUser
    const savedProfile = localStorage.getItem("adminProfile");
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else {
      const user = getCurrentUser();
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    }
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    // Persist to adminProfile and sync currentUser
    localStorage.setItem("adminProfile", JSON.stringify(formData));
    const existing = getCurrentUser() || {};
    setCurrentUser({ ...existing, name: formData.name, email: formData.email });
    toast.success("Profile updated successfully!");
  };

  const savePolicies = () => {
    localStorage.setItem("adminPolicies", JSON.stringify(policies));
    toast.success("Policies saved successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "policies", label: "Policies", icon: Settings },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-8">
          Admin Settings
        </h1>

        <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden">

          {/* Tabs */}
          <div className="border-b overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 sm:px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === id
                      ? "text-[#011F5B] border-b-2 border-[#011F5B]"
                      : "text-gray-500 hover:text-[#011F5B]"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-7">

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-5 max-w-lg">
                <h2 className="text-lg font-bold text-[#011F5B] flex items-center gap-2">
                  <User size={18} /> Profile Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your admin profile. Your name will appear in the sidebar and across the admin panel.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#011F5B] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0e2c5b] transition"
                >
                  <Save size={16} />
                  Save Profile
                </button>
              </form>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                <h2 className="text-lg font-bold text-[#011F5B] flex items-center gap-2">
                  <Shield size={18} /> Change Password
                </h2>
                <p className="text-sm text-gray-500">
                  Keep your account secure with a strong password.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Current Password", key: "currentPassword", placeholder: "Enter current password" },
                    { label: "New Password", key: "newPassword", placeholder: "Min. 6 characters" },
                    { label: "Confirm New Password", key: "confirmPassword", placeholder: "Repeat new password" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                      <input
                        type="password"
                        placeholder={placeholder}
                        value={passwordData[key]}
                        onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                        required
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#011F5B] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0e2c5b] transition"
                >
                  <Save size={16} />
                  Update Password
                </button>
              </form>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#011F5B] flex items-center gap-2">
                  <Bell size={18} /> Notification Preferences
                </h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  {Object.entries(notificationPrefs).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-[#011F5B] transition"
                    >
                      <span className="text-sm font-medium capitalize">{key} alerts</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() =>
                          setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[#011F5B] focus:ring-[#011F5B]"
                      />
                    </label>
                  ))}
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell size={17} className="text-[#011F5B]" />
                      <span className="font-semibold text-sm">Recent Notifications</span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#011F5B] hover:text-[#D4AF37] font-medium transition"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">No notifications yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-xl p-4 border ${
                            notif.read
                              ? "border-gray-200 bg-white"
                              : "border-[#D4AF37]/30 bg-amber-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1.5">
                                {new Date(notif.date).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="text-red-400 hover:text-red-600 text-xs font-medium flex-shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="mt-2 text-xs text-blue-600 hover:underline"
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

            {/* ── POLICIES TAB ── */}
            {activeTab === "policies" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#011F5B] flex items-center gap-2">
                    <Settings size={18} /> Company Policies & Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    These policies are displayed to customers on the Help Center page.
                  </p>
                </div>

                {/* Repair Policy */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                    Repair & Service Policy
                  </label>
                  <textarea
                    value={policies.repairPolicy}
                    onChange={(e) => setPolicies({ ...policies, repairPolicy: e.target.value })}
                    className="w-full border border-blue-200 p-3 rounded-lg min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm resize-none"
                  />
                </div>

                {/* Return Policy */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                    Return & Exchange Policy
                  </label>
                  <textarea
                    value={policies.returnPolicy}
                    onChange={(e) => setPolicies({ ...policies, returnPolicy: e.target.value })}
                    className="w-full border border-orange-200 p-3 rounded-lg min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm resize-none"
                  />
                </div>

                {/* Return Deadline */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                    Return Deadline (After Delivery)
                  </label>
                  <input
                    type="text"
                    value={policies.returnDeadline}
                    onChange={(e) => setPolicies({ ...policies, returnDeadline: e.target.value })}
                    className="w-full border border-red-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                    placeholder="e.g., 1-2 weeks, 14 days"
                  />
                </div>

                {/* Warranty */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-[#011F5B] mb-2">
                    Warranty Information
                  </label>
                  <textarea
                    value={policies.warrantyInfo}
                    onChange={(e) => setPolicies({ ...policies, warrantyInfo: e.target.value })}
                    className="w-full border border-green-200 p-3 rounded-lg min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm resize-none"
                  />
                </div>

                {/* Support Contact */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-[#011F5B] text-sm">Support Contact</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={policies.supportPhone}
                      onChange={(e) => setPolicies({ ...policies, supportPhone: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={policies.supportEmail}
                      onChange={(e) => setPolicies({ ...policies, supportEmail: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={savePolicies}
                  className="flex items-center gap-2 w-full sm:w-auto bg-[#011F5B] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#0e2c5b] transition"
                >
                  <Save size={16} />
                  Save All Policies
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
