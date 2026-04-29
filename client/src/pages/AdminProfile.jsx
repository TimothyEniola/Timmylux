import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, Edit, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  // Static admin data (frontend demo)
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@timmyluxe.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    created_at: "2024-01-01T00:00:00.000Z",
    bio: "Furniture store administrator responsible for managing products and orders.",
    permissions: ["manage_products", "manage_orders", "manage_users", "view_analytics"],
    profileImage: localStorage.getItem("adminProfileImage") || null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...admin });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdmin(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...admin });
    setIsEditing(false);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        localStorage.setItem("adminProfileImage", imageData);
        setAdmin(prev => ({ ...prev, profileImage: imageData }));
        window.dispatchEvent(new Event("adminProfileImageUpdated"));
        alert("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">Admin Profile</h1>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2 text-white"
              >
                <Edit size={20} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-2 text-white"
                >
                  <Save size={20} /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#011F5B] rounded-full flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0 overflow-hidden">
                {admin.profileImage ? (
                  <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#D4AF37] p-3 rounded-full cursor-pointer hover:bg-[#b8942a] transition-colors shadow-lg">
                <Upload size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  title="Upload profile picture"
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#011F5B] truncate">
                {admin.name}
              </h2>
              <p className="text-gray-600 font-medium capitalize">
                {admin.role}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(admin.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={20} className="text-gray-400" />
                    <span>{admin.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-gray-400" />
                    <span>{admin.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-gray-400" />
                    <span>{admin.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Role
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-400" />
                  <span className="capitalize">{admin.role}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{admin.bio}</p>
                </div>
              )}
            </div>

            {/* Permissions Section */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Admin Permissions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {admin.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-800 capitalize">
                      {permission.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/products"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <User size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">Manage Products</span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Phone size={20} className="text-green-600" />
                <span className="font-medium text-green-900">View Orders</span>
              </Link>

              <Link
                to="/admin"
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Calendar size={20} className="text-purple-600" />
                <span className="font-medium text-purple-900">Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}