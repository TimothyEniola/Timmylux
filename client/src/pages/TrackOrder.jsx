import { useState } from "react";
import { Truck, MapPin, Clock, CheckCircle, Package, AlertCircle } from "lucide-react";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const normalizeOrderId = (id) => id.trim();

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError("");
    setTrackingInfo(null);
    
    if (!orderId.trim()) {
      setError("Please enter an order ID or reference");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch the user's orders to find the match securely
      const response = await apiRequest('/orders', { method: 'GET' });
      const userOrders = response.data || [];
      
      const foundOrder = userOrders.find(
        (order) => 
          order.id === normalizeOrderId(orderId) || 
          order.paystackRef === normalizeOrderId(orderId)
      );

      if (foundOrder) {
        setTrackingInfo(generateTrackingTimeline(foundOrder));
      } else {
        setError("Order not found. Please ensure this order belongs to your account and the ID is correct.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to track order. Please ensure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to generate a realistic timeline based on the database status
  const generateTrackingTimeline = (order) => {
    const statuses = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
    const currentIndex = statuses.indexOf(order.status);
    
    const isCancelled = order.status === 'CANCELLED';
    const isReady = order.status === 'READY_FOR_PICKUP';
    
    const timeline = [];
    const orderDate = new Date(order.createdAt).toLocaleDateString();

    // 1. Order Placed
    timeline.push({
      status: "Order Confirmed",
      completed: true,
      date: orderDate,
      desc: "Your order has been saved in our system."
    });

    if (isCancelled) {
      timeline.push({
        status: "Order Cancelled",
        completed: true,
        date: "Update",
        desc: "This order has been cancelled.",
        isError: true
      });
      return { ...order, tracking: timeline };
    }

    // 2. Processing
    timeline.push({
      status: "Processing",
      completed: currentIndex >= 1 || isReady,
      date: currentIndex >= 1 || isReady ? "Update" : "Pending",
      desc: "We are preparing your items."
    });

    // 3. Dispatched / Ready
    if (isReady) {
      timeline.push({
        status: "Ready for Pickup",
        completed: true,
        date: "Update",
        desc: "Your order is ready at the showroom."
      });
    } else {
      timeline.push({
        status: "Dispatched",
        completed: currentIndex >= 2,
        date: currentIndex >= 2 ? "Update" : "Pending",
        desc: "Your order has left our facility."
      });
    }

    // 4. Delivered
    timeline.push({
      status: "Delivered",
      completed: currentIndex === 3,
      date: currentIndex === 3 ? "Complete" : "Pending",
      desc: "Order fulfilled successfully."
    });

    return { ...order, tracking: timeline };
  };

  const getStatusIcon = (status, completed, isError) => {
    if (isError) return <AlertCircle className="text-red-500" size={20} />;
    if (!completed) return <Clock className="text-gray-300" size={20} />;

    switch (status.toLowerCase()) {
      case 'delivered':
      case 'order confirmed':
      case 'ready for pickup':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'dispatched':
        return <Truck className="text-blue-500" size={20} />;
      case 'processing':
        return <Package className="text-[#D4AF37]" size={20} />;
      default:
        return <CheckCircle className="text-[#011F5B]" size={20} />;
    }
  };

  return (
    <div className="container-custom py-12 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#011F5B] mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID or Payment Reference</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent focus:bg-white transition-colors"
                  placeholder="e.g., TML-170..."
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2 disabled:opacity-70">
              {isLoading ? "Searching Database..." : "Track Order"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {trackingInfo && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn">
            <div className="mb-8 border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-bold text-[#011F5B] mb-2 break-all">Order #{trackingInfo.paystackRef || trackingInfo.id}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className={`px-3 py-1 rounded-full ${trackingInfo.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-[#D4AF37]/10 text-[#011F5B]'}`}>
                  Status: {trackingInfo.status.replace(/_/g, ' ')}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Clock size={16} className="text-gray-400" />
                  Placed: {new Date(trackingInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-6 relative">
              {/* Vertical line connecting timeline dots */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

              {trackingInfo.tracking?.map((step, index) => (
                <div key={index} className="flex items-start gap-6 relative z-10">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${step.completed ? (step.isError ? 'border-red-100' : 'border-green-100') : 'border-gray-100'}`}>
                    {getStatusIcon(step.status, step.completed, step.isError)}
                  </div>
                  <div className="flex-1 pt-1.5 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-lg font-bold ${step.completed ? (step.isError ? 'text-red-600' : 'text-[#011F5B]') : 'text-gray-400'}`}>
                        {step.status}
                      </h4>
                      <span className={`text-sm font-semibold ${step.completed ? 'text-gray-500' : 'text-gray-300'}`}>{step.date}</span>
                    </div>
                    <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-[#011F5B]/5 to-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
              <h4 className="font-bold text-[#011F5B] mb-2 flex items-center gap-2">
                <HelpIcon size={18} className="text-[#D4AF37]" /> Need Help?
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                If you have any questions regarding order <span className="font-semibold">{trackingInfo.paystackRef || trackingInfo.id}</span>, please contact customer support at
                <a href="mailto:support@timmylux.com" className="text-[#D4AF37] font-bold hover:underline mx-1">
                  support@timmylux.com
                </a>
                or call <span className="font-semibold">+234 814 083 8535</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple internal icon components to keep imports clean
function SearchIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function HelpIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}