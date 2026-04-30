import { useState, useEffect } from "react";
import { X, Share2, Copy, Check as CheckIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

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

  // SHARE FUNCTIONS
  const formatOrderDetails = (order) => {
    const itemsList = order.items
      .map((item) => `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`)
      .join("\n");
    return `Order #${order.id}\nCustomer: ${order.customerName}\nEmail: ${order.email}\nStatus: ${order.status}\nTotal: ₦${order.total.toLocaleString()}\nDate: ${order.date}\n\nItems:\n${itemsList}\n\nShipping Address:\n${order.shippingAddress.fullName}\n${order.shippingAddress.address}\n${order.shippingAddress.city}, ${order.shippingAddress.state}\nPhone: ${order.shippingAddress.phone}`;
  };

  const shareViaWhatsApp = (order) => {
    const message = encodeURIComponent(formatOrderDetails(order));
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareViaEmail = (order) => {
    const subject = encodeURIComponent(`Order Details #${order.id}`);
    const body = encodeURIComponent(formatOrderDetails(order));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const copyToClipboard = (order) => {
    navigator.clipboard.writeText(formatOrderDetails(order));
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
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
                {/* Share Buttons */}
                <button
                  onClick={() => shareViaWhatsApp(order)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="Share via WhatsApp"
                >
                  <FaWhatsapp size={14} />
                </button>
                <button
                  onClick={() => shareViaEmail(order)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Share via Email"
                >
                  <span className="text-sm font-bold">✉</span>
                </button>
                <button
                  onClick={() => copyToClipboard(order)}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copy to Clipboard"
                >
                  {copiedOrderId === order.id ? (
                    <CheckIcon size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
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
                    onClick={() => shareViaWhatsApp(selectedOrder)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <FaWhatsapp size={16} />
                  </button>
                  <button
                    onClick={() => shareViaEmail(selectedOrder)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Share via Email"
                  >
                    <span className="text-sm font-bold">✉</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedOrder)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Copy to Clipboard"
                  >
                    {copiedOrderId === selectedOrder.id ? (
                      <CheckIcon size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
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