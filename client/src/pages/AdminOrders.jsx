import { useState, useEffect } from "react";
import { X, Share2, Package, Truck, CheckCircle, Clock, Search, ChevronRight, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";

const statusConfig = {
  Pending: { color: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", icon: Clock },
  Shipped: { color: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500", icon: Truck },
  Delivered: { color: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500", icon: CheckCircle },
};

const statusFlow = { Pending: "Shipped", Shipped: "Delivered", Delivered: null };

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

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
          { name: "Coffee Table", quantity: 1, price: 30000 },
        ],
        shippingAddress: {
          fullName: "John Doe",
          phone: "+2341234567890",
          address: "123 Main St",
          city: "Lagos",
          state: "Lagos",
        },
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
          state: "FCT",
        },
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
          state: "Rivers",
        },
      },
    ];
    setOrders(mockOrders);
  }, []);

  const updateOrderStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId || !statusFlow[order.status]) return order;
        const next = statusFlow[order.status];
        toast.success(`Order moved to "${next}"`);
        return { ...order, status: next };
      })
    );
  };

  const shareOrder = async (order) => {
    const itemsList = order.items
      .map((item) => `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`)
      .join("\n");
    const text = `Order #${order.id}\nDate: ${order.date}\nStatus: ${order.status}\nTotal: ₦${order.total.toLocaleString()}\n\nItems:\n${itemsList}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Order #${order.id}`, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Order details copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const fields = [order.id, order.customerName, order.email, order.status, order.date, order.shippingAddress?.city];
    return (
      fields.some((f) => f?.toLowerCase().includes(q)) ||
      order.items.some((i) => i.name?.toLowerCase().includes(q))
    );
  });

  const stats = [
    { label: "Total Orders", value: orders.length, color: "bg-[#011F5B]", text: "text-white" },
    { label: "Pending", value: orders.filter((o) => o.status === "Pending").length, color: "bg-amber-50 border border-amber-200", text: "text-amber-700" },
    { label: "Shipped", value: orders.filter((o) => o.status === "Shipped").length, color: "bg-blue-50 border border-blue-200", text: "text-blue-700" },
    { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length, color: "bg-green-50 border border-green-200", text: "text-green-700" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, text }) => (
            <div key={label} className={`rounded-2xl p-4 ${color}`}>
              <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
              <p className={`text-xs font-medium mt-0.5 ${text} opacity-80`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, order ID, status or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = cfg.icon;
              const nextStatus = statusFlow[order.status];

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-[#011F5B] text-[#D4AF37] flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {getInitials(order.customerName)}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{order.customerName}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{order.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-[#011F5B] text-lg">₦{order.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>

                        {/* Items summary */}
                        <p className="text-xs text-gray-500 mt-2">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}: {order.items.map((i) => i.name).join(", ")}
                        </p>

                        {/* Status + actions */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
                            <StatusIcon size={12} />
                            {order.status}
                          </span>

                          {/* Actions */}
                          {nextStatus && (
                            <button
                              onClick={() => updateOrderStatus(order.id)}
                              className="text-xs bg-[#011F5B] text-white px-3 py-1.5 rounded-full hover:bg-[#0e2c5b] transition flex items-center gap-1"
                            >
                              Move to {nextStatus} <ChevronRight size={12} />
                            </button>
                          )}

                          <button
                            onClick={() => shareOrder(order)}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition flex items-center gap-1"
                          >
                            <Share2 size={12} /> Share
                          </button>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs text-[#D4AF37] font-semibold hover:text-[#b8942a] transition"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#011F5B] rounded-t-2xl">
              <div>
                <h2 className="font-bold text-white">Order #{selectedOrder.id}</h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {new Date(selectedOrder.date).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/70 hover:text-white transition p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Order Status</span>
                {(() => {
                  const cfg = statusConfig[selectedOrder.status] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                      <StatusIcon size={13} />
                      {selectedOrder.status}
                    </span>
                  );
                })()}
              </div>

              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-[#011F5B] text-sm mb-3">Customer Information</h3>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-[#011F5B] text-[#D4AF37] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(selectedOrder.customerName)}
                  </div>
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span>{selectedOrder.email}</span>
                </div>
                {selectedOrder.shippingAddress?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    <span>{selectedOrder.shippingAddress.phone}</span>
                  </div>
                )}
              </div>

              {/* Shipping address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#011F5B] text-sm mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Shipping Address
                  </h3>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="font-semibold text-[#011F5B] text-sm mb-3 flex items-center gap-2">
                  <Package size={14} /> Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#D4AF37]">₦{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-extrabold text-xl text-[#011F5B]">₦{selectedOrder.total.toLocaleString()}</span>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                {statusFlow[selectedOrder.status] && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id);
                      setSelectedOrder((prev) => ({ ...prev, status: statusFlow[prev.status] }));
                    }}
                    className="flex-1 bg-[#011F5B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0e2c5b] transition"
                  >
                    Move to {statusFlow[selectedOrder.status]}
                  </button>
                )}
                <button
                  onClick={() => shareOrder(selectedOrder)}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                >
                  <Share2 size={14} /> Share
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
