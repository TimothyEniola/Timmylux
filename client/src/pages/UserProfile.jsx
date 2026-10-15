import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Edit,
  Upload,
  Heart,
  Package,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

export default function UserProfile() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", phone: user.phone || "" });
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("userAddress");
      return saved
        ? [JSON.parse(saved)]
        : [
            {
              houseNumber: "12A",
              street: "Luxury Lane",
              lga: "Premium District",
              state: "California",
            },
          ];
    } catch {
      return [
        {
          houseNumber: "12A",
          street: "Luxury Lane",
          lga: "Premium District",
          state: "California",
        },
      ];
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phone", formData.phone);
      if (selectedImage) {
        submitData.append("profileImage", selectedImage);
      }

      await updateProfile(submitData);
      setIsEditing(false);
      setSelectedImage(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", phone: user?.phone || "" });
    setPreviewImage(user?.profileImage || null);
    setSelectedImage(null);
    setIsEditing(false);
  };

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">
              My Account
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your details and view your activity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Edit size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="btn-outline">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />{" "}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#011F5B] p-3 rounded-full cursor-pointer hover:bg-[#0d2f7a] transition-colors shadow-lg">
                <Upload size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-[#D4AF37] font-medium mt-1">Valued Customer</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-premium"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <User size={20} className="text-gray-400" />
                    <span>{user?.name}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Address (Read Only)
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail size={20} className="text-gray-400" />
                  <span>{user?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-premium"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Phone size={20} className="text-gray-400" />
                    <span>{user?.phone || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>
          </form>

          <div className="mt-10 border-t border-gray-100 pt-6">
            <h3 className="text-xl font-bold text-[#011F5B] mb-4">Addresses</h3>
            {addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {index === 0
                            ? "Main Address"
                            : `Address ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
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
              <p className="text-gray-500">No address yet</p>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Activity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/orders"
                className="flex items-center gap-3 p-4 rounded-lg bg-navy/5 hover:bg-navy/10 transition-colors"
              >
                <Package size={20} className="text-[#011F5B]" />
                <span className="font-medium text-[#011F5B]">
                  Order History
                </span>
              </Link>
              <Link
                to="/track-order"
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Clock size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Track Order</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Heart size={20} className="text-red-500" />
                <span className="font-medium text-red-500">My Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
