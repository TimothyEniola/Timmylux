import { useState, useEffect } from "react";
import { Plus, Trash2, Copy } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage", // percentage or fixed
    expiryDate: "",
    active: true,
  });

  useEffect(() => {
    // Load coupons from localStorage
    const savedCoupons = localStorage.getItem("adminCoupons");
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }
  }, []);

  const saveCoupons = (updatedCoupons) => {
    setCoupons(updatedCoupons);
    localStorage.setItem("adminCoupons", JSON.stringify(updatedCoupons));
  };

  const generateCouponCode = () => {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TUX${randomNum}`;
  };

  const handleAddCoupon = () => {
    if (!newCoupon.discount || !newCoupon.expiryDate) {
      alert("Please fill in discount and expiry date");
      return;
    }

    const code = newCoupon.code || generateCouponCode();
    const coupon = {
      id: Date.now(),
      code,
      discount: parseFloat(newCoupon.discount),
      type: newCoupon.type,
      expiryDate: newCoupon.expiryDate,
      active: newCoupon.active,
      createdAt: new Date().toISOString(),
    };

    const updatedCoupons = [...coupons, coupon];
    saveCoupons(updatedCoupons);

    setNewCoupon({
      code: "",
      discount: "",
      type: "percentage",
      expiryDate: "",
      active: true,
    });

    alert("Coupon created successfully!");
  };

  const handleDeleteCoupon = (id) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== id);
    saveCoupons(updatedCoupons);
    alert("Coupon deleted!");
  };

  const toggleCouponStatus = (id) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === id ? { ...coupon, active: !coupon.active } : coupon
    );
    saveCoupons(updatedCoupons);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Coupon code copied to clipboard!");
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-4">Manage Coupons</h1>
        <p className="text-gray-600">Create and manage discount coupons for your customers.</p>
      </div>

      {/* Add New Coupon */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#011F5B] mb-4">Create New Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <input
              type="text"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              placeholder="Leave empty to auto-generate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <input
              type="number"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newCoupon.type}
              onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₦)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newCoupon.expiryDate}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        <button
          onClick={handleAddCoupon}
          className="bg-[#D4AF37] text-white px-6 py-2 rounded-md hover:bg-[#B8952A] transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      {/* Existing Coupons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#011F5B] mb-4">Existing Coupons</h2>
        {coupons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No coupons created yet.</p>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-[#011F5B]">{coupon.code}</p>
                    <p className="text-sm text-gray-600">
                      {coupon.discount}{coupon.type === 'percentage' ? '%' : '₦'} off • Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                    title="Copy code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                    title={coupon.active ? 'Deactivate' : 'Activate'}
                  >
                    {coupon.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}