import { useState } from "react";
import { Truck, MapPin, Clock, CheckCircle, Package } from "lucide-react";
// import ProfileDropdown from "../components/ProfileDropdown";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState("");

  const normalizeOrderId = (id) =>
    id.replace(/[^a-z0-9]/gi, "").toUpperCase();

  // Static orders for demo
  const sampleOrders = [
    {
      id: "ORD-001",
      product: "Luxury King Bed Frame",
      status: "Delivered",
      location: "Lagos Warehouse",
      estimatedDelivery: "2026-01-15",
      tracking: [
        { status: "Order Placed", completed: true, date: "2026-01-10" },
        { status: "Processing", completed: true, date: "2026-01-11" },
        { status: "Shipped", completed: true, date: "2026-01-12" },
        { status: "Delivered", completed: true, date: "2026-01-15" }
      ]
    },
    {
      id: "ORD-002",
      product: "Premium Velvet Sofa",
      status: "Shipped",
      location: "Ikeja Distribution Center",
      estimatedDelivery: "Expected 2026-01-16",
      tracking: [
        { status: "Order Placed", completed: true, date: "2026-01-09" },
        { status: "Processing", completed: true, date: "2026-01-10" },
        { status: "Shipped", completed: true, date: "2026-01-14" },
        { status: "Out for Delivery", completed: false, date: "Expected 2026-01-16" }
      ]
    }
  ];

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError("");

    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    // Find the order in sample orders
    const foundOrder = sampleOrders.find(
      (order) => normalizeOrderId(order.id) === normalizeOrderId(orderId)
    );

    if (foundOrder) {
      setTrackingInfo(foundOrder);
    } else {
      setError("Order not found. Please check your order ID and try again.");
    }
  };

  const getStatusIcon = (status, completed) => {
    if (!completed) return <Clock className="text-yellow-500" size={20} />;

    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return <Truck className="text-blue-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">Track Your Order</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Enter your order ID (e.g., ORD-001)"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Track Order
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {trackingInfo && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#011F5B] mb-2">Order #{trackingInfo.id}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {trackingInfo.location || 'Location not available'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  Est. Delivery: {trackingInfo.estimatedDelivery || 'TBD'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#011F5B]">Tracking History</h3>
              {trackingInfo.tracking?.length > 0 ? (
                trackingInfo.tracking.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status, step.completed)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.completed ? 'text-[#011F5B]' : 'text-gray-500'}`}>
                          {step.status}
                        </h4>
                        <span className="text-sm text-gray-500">{step.date}</span>
                      </div>
                      {step.location && (
                        <p className="text-sm text-gray-600 mt-1">{step.location}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tracking history available yet.</p>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#011F5B] mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600">
                If you have any questions about your order, please contact our customer service at
                <a href="mailto:support@timmylux.com" className="text-[#D4AF37] hover:underline ml-1">
                  support@timmylux.com
                </a>
                or call +234 xxx xxx xxxx.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}