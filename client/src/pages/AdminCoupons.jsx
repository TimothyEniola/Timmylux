import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Copy, Power } from "lucide-react";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage",
    expiryDate: "",
    active: true,
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await apiRequest("/admin/coupons");
        setCoupons(response.data);
      } catch (error) {
        toast.error("Failed to load coupons");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const generateCouponCode = () => {
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `TUX${randomNum}`;
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.discount || !newCoupon.expiryDate) {
      toast.error("Please fill in discount and expiry date");
      return;
    }

    setIsSubmitting(true);
    try {
      const code = newCoupon.code || generateCouponCode();
      const payload = {
        code,
        discount: parseFloat(newCoupon.discount),
        type: newCoupon.type,
        expiryDate: new Date(newCoupon.expiryDate).toISOString(),
      };

      const response = await apiRequest("/admin/coupons", {
        method: "POST",
        body: payload,
      });

      setCoupons([response.data, ...coupons]);
      setNewCoupon({
        code: "",
        discount: "",
        type: "percentage",
        expiryDate: "",
        active: true,
      });
      toast.success("Coupon created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const response = await apiRequest(`/admin/coupons/${id}/toggle`, {
        method: "PATCH",
      });
      setCoupons(coupons.map((c) => (c.id === id ? response.data : c)));
      toast.success("Coupon status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
  };

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-4">
          Manage Coupons
        </h1>
        <p className="text-gray-600">
          Create and manage discount coupons for your customers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-[#011F5B] mb-4">
          Create New Coupon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
              placeholder="Leave empty to auto-generate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="number"
              value={newCoupon.discount}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, discount: e.target.value })
              }
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={newCoupon.type}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₦)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={newCoupon.expiryDate}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        <button
          onClick={handleAddCoupon}
          disabled={isSubmitting}
          className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-md hover:bg-[#B8952A] transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          <Plus size={16} />
          {isSubmitting ? "Creating..." : "Create Coupon"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 min-h-[300px]">
        <h2 className="text-xl font-semibold text-[#011F5B] mb-6">
          Existing Coupons
        </h2>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader text="Loading coupons..." />
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No coupons created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-lg hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-[#011F5B] text-lg tracking-wide">
                      {coupon.code}
                    </p>
                    <p className="text-xs font-medium text-gray-600 mt-0.5">
                      {coupon.type === "percentage"
                        ? `${coupon.discount}% off`
                        : `₦${coupon.discount} off`}{" "}
                      • Expires:{" "}
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${coupon.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {coupon.active ? "Active" : "Inactive"}
                  </span>

                  <div className="flex border-l pl-3 ml-1 gap-2">
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="p-1.5 text-gray-400 hover:text-[#D4AF37] bg-white border border-gray-200 rounded transition-colors"
                      title="Copy Code"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => toggleCouponStatus(coupon.id)}
                      className={`p-1.5 bg-white border border-gray-200 rounded transition-colors ${coupon.active ? "text-amber-500 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
                      title={coupon.active ? "Deactivate" : "Activate"}
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
