import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown";

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

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#011F5B]">
            Order History
          </h1>
          <ProfileDropdown />
        </div>

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

                <div className="border-t pt-4 flex items-center justify-between">
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

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8952A] transition-colors"
                  >
                    <Eye size={16} />
                    Track Order
                  </button>
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

        {/* ✅ Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#011F5B]">
                    Order #{selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p>
                      <strong>Date:</strong> {selectedOrder.date}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {selectedOrder.status}
                    </p>
                    <p>
                      <strong>Total:</strong> ₦
                      {selectedOrder.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Tracking Information
                    </h3>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedOrder.tracking.location}
                    </p>
                    <p>
                      <strong>Estimated Delivery:</strong>{" "}
                      {selectedOrder.tracking.estimatedDelivery}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Items Ordered
                    </h3>
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 bg-gray-50 rounded mb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
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