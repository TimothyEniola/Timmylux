import { useState, useEffect } from "react";
import { X, Share2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        items: [{ name: "Dining Chair", quantity: 4, price: 18750 }],
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
        items: [{ name: "King Size Bed", quantity: 1, price: 200000 }],
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

  const statusFlow = {
    Pending: "Shipped",
    Shipped: "Delivered",
    Delivered: null
  };

  const updateOrderStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (order.status === "Delivered") return order;

        return { ...order, status: statusFlow[order.status] };
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

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const searchableFields = [
      order.id,
      order.customerName,
      order.email,
      order.status,
      order.date,
      order.shippingAddress?.address,
      order.shippingAddress?.city,
      order.shippingAddress?.state
    ];

    const matchesText = searchableFields.some((field) =>
      field?.toLowerCase?.().includes(query)
    );

    const matchesItem = order.items.some((item) =>
      item.name?.toLowerCase?.().includes(query)
    );

    return matchesText || matchesItem;
  });

  const shareOrder = async (order) => {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`
      )
      .join("\n");

    const text = `Order #${order.id}
Date: ${order.date}
Status: ${order.status}
Total: ₦${order.total.toLocaleString()}

Items:
${itemsList}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order #${order.id}`,
          text,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Order details copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
        Recent Orders
      </h1>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      {/* ORDERS */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">#{order.id}</h3>
                <p>{order.customerName}</p>
              </div>

              <p className="font-bold">
                ₦{order.total.toLocaleString()}
              </p>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className={`px-3 py-1 rounded ${getStatusColor(order.status)}`}>
                {order.status}
              </span>

              <div className="flex gap-2">
                {order.status !== "Delivered" && (
                  <button
                    onClick={() => updateOrderStatus(order.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Move to {statusFlow[order.status]}
                  </button>
                )}

                <button
                  onClick={() => shareOrder(order)}
                  className="bg-black text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <Share2 size={14} /> Share
                </button>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-gray-800 text-white px-2 py-1 rounded"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No results found
        </p>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-6 rounded w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="font-bold">Order #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X />
              </button>
            </div>

            <p className="mt-4">{selectedOrder.customerName}</p>
            <p>{selectedOrder.email}</p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}