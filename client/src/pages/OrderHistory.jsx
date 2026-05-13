import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Eye, Share2 } from "lucide-react";
export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Corrected orders structure
  const orders = [
    {
      id: "ORD-001",
      amount: 485000,
      status: "delivered",
      date: "2026-01-15",
      tracking: {
        location: "Lagos Distribution Center",
        estimatedDelivery: "2026-01-15",
      },
      items: [
        {
          name: "Luxury King Bed Frame",
          quantity: 1,
          price: 485000,
        },
      ],
    },
    {
      id: "ORD-002",
      amount: 420000,
      status: "shipped",
      date: "2026-01-14",
      tracking: {
        location: "Abuja Transit Hub",
        estimatedDelivery: "2026-01-18",
      },
      items: [
        {
          name: "Premium Velvet Sofa",
          quantity: 1,
          price: 420000,
        },
      ],
    },
    {
      id: "ORD-003",
      amount: 125000,
      status: "processing",
      date: "2026-01-13",
      tracking: {
        location: "Warehouse",
        estimatedDelivery: "2026-01-20",
      },
      items: [
        {
          name: "Modern Coffee Table",
          quantity: 1,
          price: 125000,
        },
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-500" size={20} />;
      case "shipped":
        return <Truck className="text-blue-500" size={20} />;
      case "processing":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "processing":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // SHARE FUNCTIONS
  const shareOrder = async (order) => {
    const itemsList = order.items
      .map((item) => `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`)
      .join("\n");

    const shareData = {
      title: `Order #${order.id} - Timmy Lux Furniture`,
      text: `Order #${order.id}\nDate: ${order.date}\nStatus: ${order.status.toUpperCase()}\nTotal: ₦${order.amount.toLocaleString()}\n\nItems:\n${itemsList}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.text);
        alert("Order details copied to clipboard!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
          Order History
        </h1>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-[#011F5B]">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[#011F5B]">
                      ₦{order.amount.toLocaleString()}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} (x{item.quantity}) — ₦
                          {item.price.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8952A] transition-colors whitespace-nowrap"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => shareOrder(order)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors"
                      title="Share Order"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package
                size={48}
                className="text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-[#011F5B] mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600">
                You haven't placed any orders yet.
              </p>
            </div>
          )}
        </div>

        {/* ✅ Creative Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-slideUp">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-[#011F5B] to-[#D4AF37] text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(selectedOrder.status)}
                      <div>
                        <h2 className="text-3xl font-bold">
                          Order #{selectedOrder.id}
                        </h2>
                        <p className="text-white/80 mt-1">
                          Placed on {selectedOrder.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => shareOrder(selectedOrder)}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
                        title="Share Order"
                      >
                        <Share2 size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 text-2xl font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Order Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                        <Package size={24} />
                        Order Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-2xl font-bold text-[#011F5B]">
                            ₦{selectedOrder.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                        <Truck size={24} />
                        Tracking Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Current Location</p>
                            <p className="text-gray-600">{selectedOrder.tracking.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Estimated Delivery</p>
                            <p className="text-gray-600">{selectedOrder.tracking.estimatedDelivery}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                      <Package size={24} />
                      Items Ordered
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-[#011F5B]">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#011F5B]">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Order Status */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-[#011F5B]">Order Progress</h4>
                    <span className="text-sm text-gray-600 capitalize">{selectedOrder.status}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        selectedOrder.status === 'delivered' ? 'bg-green-500 w-full' :
                        selectedOrder.status === 'shipped' ? 'bg-blue-500 w-2/3' :
                        'bg-yellow-500 w-1/3'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

