import { useState, useEffect } from "react";
import { X, Share2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data (FIXED status values)
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-1704067200000",
        customerName: "John Doe",
        email: "john@example.com",
        total: 150000,
        status: "Pending",
        date: "2024-01-01",
        items: [
          { name: "Modern Sofa", quantity: 1, price: 120000 },
          { name: "Coffee Table", quantity: 1, price: 30000 }
        ],
        shippingAddress: {
          fullName: "John Doe",
          phone: "+2341234567890",
          address: "123 Main St",
          city: "Lagos",
          state: "Lagos"
        }
      },
      {
        id: "ORD-1704153600000",
        customerName: "Jane Smith",
        email: "jane@example.com",
        total: 75000,
        status: "Shipped",
        date: "2024-01-02",
        items: [
          { name: "Dining Chair", quantity: 4, price: 18750 }
        ],
        shippingAddress: {
          fullName: "Jane Smith",
          phone: "+2340987654321",
          address: "456 Oak Ave",
          city: "Abuja",
          state: "FCT"
        }
      },
      {
        id: "ORD-1704240000000",
        customerName: "Bob Johnson",
        email: "bob@example.com",
        total: 200000,
        status: "Delivered",
        date: "2024-01-03",
        items: [
          { name: "King Size Bed", quantity: 1, price: 200000 }
        ],
        shippingAddress: {
          fullName: "Bob Johnson",
          phone: "+2345678901234",
          address: "789 Pine Rd",
          city: "Port Harcourt",
          state: "Rivers"
        }
      }
    ];
    setOrders(mockOrders);
  }, []);

  // STRICT status progression
  const statusFlow = {
    Pending: "Shipped",
    Shipped: "Delivered",
    Delivered: null
  };

  const updateOrderStatus = (orderId) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        // If already delivered → do nothing
        if (order.status === "Delivered") return order;

        return {
          ...order,
          status: statusFlow[order.status]
        };
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // SHARE FUNCTION
  const shareOrder = async (order) => {
    const itemsList = order.items
      .map((item) => `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`)
      .join("\n");

    const shareData = {
      title: `Order #${order.id} - Timmy Lux Furniture`,
      text: `Order #${order.id}\nDate: ${order.date}\nStatus: ${order.status}\nTotal: ₦${order.total.toLocaleString()}\n\nItems:\n${itemsList}`,
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
      <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
        Recent Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#011F5B]">
                  Order #{order.id}
                </h3>
                <p className="text-gray-600">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#D4AF37]">
                  ₦{order.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₦{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STATUS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>

                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>

                {order.status !== "Delivered" && (
                  <button
                    onClick={() => updateOrderStatus(order.id)}
                    className="ml-2 text-xs bg-[#011F5B] text-white px-2 py-1 rounded hover:bg-[#0a1539]"
                  >
                    Move to {statusFlow[order.status]}
                  </button>
                )}

                {order.status === "Delivered" && (
                  <span className="text-xs text-gray-500 italic">(Locked)</span>
                )}
              </div>

              <div className="flex gap-2">
                {/* Share Button */}
                <button
                  onClick={() => shareOrder(order)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors"
                  title="Share Order"
                >
                  <Share2 size={16} />
                  Share
                </button>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn-secondary text-sm text-white hover:opacity-90 transition-opacity"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#011F5B]">
                  Order #{selectedOrder.id}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Customer Info</h3>
                <p>{selectedOrder.customerName}</p>
                <p>{selectedOrder.email}</p>
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-6 bg-[#011F5B] text-white py-2 rounded-lg hover:bg-[#0a1539]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}