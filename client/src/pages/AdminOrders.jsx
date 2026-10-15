import { useState, useEffect } from "react";
import {
  X,
  Share2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";

const statusConfig = {
  PENDING: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  PROCESSING: {
    color: "bg-[#D4AF37]/20 text-[#011F5B] border-[#D4AF37]/30",
    icon: Package,
  },
  DISPATCHED: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Truck,
  },
  READY_FOR_PICKUP: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: MapPin,
  },
  DELIVERED: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
};

const statusFlow = {
  PENDING: "PROCESSING",
  PROCESSING: "DISPATCHED",
  DISPATCHED: "DELIVERED",
  READY_FOR_PICKUP: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

function getInitials(name) {
  if (!name) return "GU";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await apiRequest("/admin/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: { status: newStatus },
      });
      toast.success(`Order moved to ${newStatus.replace(/_/g, " ")}`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const shareOrder = async (order) => {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.productName} (x${item.quantity})${item.isMadeToOrder ? " — made to order" : ""} - ₦${item.priceAtBuy.toLocaleString()}`,
      )
      .join("\n");
    const displayId = order.paystackRef || order.id;
    const text = `Order #${displayId}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status.replace(/_/g, " ")}\nTotal: ₦${order.totalAmount.toLocaleString()}\n\nItems:\n${itemsList}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order #${displayId}`,
          text,
          url: window.location.href,
        });
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
    const displayId = order.paystackRef || order.id;
    const customerName = order.user?.name || "Guest";
    const email = order.user?.email || "";

    return (
      displayId.toLowerCase().includes(q) ||
      customerName.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q) ||
      order.items.some((i) => i.productName?.toLowerCase().includes(q))
    );
  });

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "bg-[#011F5B]",
      text: "text-white",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "PENDING").length,
      color: "bg-amber-50 border border-amber-200",
      text: "text-amber-700",
    },
    {
      label: "Dispatched",
      value: orders.filter((o) => o.status === "DISPATCHED").length,
      color: "bg-blue-50 border border-blue-200",
      text: "text-blue-700",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      color: "bg-green-50 border border-green-200",
      text: "text-green-700",
    },
  ];

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Loading orders database..." />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">
            Orders Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, text }) => (
            <div key={label} className={`rounded-2xl p-4 ${color}`}>
              <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
              <p className={`text-xs font-medium mt-0.5 ${text} opacity-80`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by customer, order ID, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#011F5B] text-sm"
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = cfg.icon;
              const nextStatus = statusFlow[order.status];
              const displayId = order.paystackRef || order.id;
              const customerName = order.user?.name || "Guest";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#011F5B] text-[#D4AF37] flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {getInitials(customerName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base truncate">
                              {customerName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5 break-all">
                              #{displayId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-[#011F5B] text-lg">
                              ₦{order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2 truncate">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}:{" "}
                          {order.items.map((i) => i.productName).join(", ")}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}
                          >
                            <StatusIcon size={12} />
                            {order.status.replace(/_/g, " ")}
                          </span>

                          {order.items.some((item) => item.isMadeToOrder) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                              <Clock size={12} aria-hidden="true" /> MTO Items
                            </span>
                          )}

                          {order.status !== "DELIVERED" &&
                            order.status !== "CANCELLED" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, "CANCELLED")
                                }
                                className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-200 transition flex items-center gap-1"
                              >
                                <X size={12} /> Cancel
                              </button>
                            )}

                          {nextStatus && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, nextStatus)
                              }
                              className="text-xs bg-[#011F5B] text-white px-3 py-1.5 rounded-full hover:bg-[#0e2c5b] transition flex items-center gap-1"
                            >
                              Move to {nextStatus.replace(/_/g, " ")}{" "}
                              <ChevronRight size={12} />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs text-[#D4AF37] font-semibold hover:text-[#b8942a] transition ml-auto"
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

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#011F5B] rounded-t-2xl">
              <div>
                <h2 className="font-bold text-white break-all">
                  Order #{selectedOrder.paystackRef || selectedOrder.id}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/70 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Payment Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${selectedOrder.paymentStatus === "PAID" ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-[#011F5B] text-sm mb-3">
                  Customer Information
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-[#011F5B] text-[#D4AF37] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(selectedOrder.user?.name)}
                  </div>
                  <span className="font-medium">
                    {selectedOrder.user?.name || "Guest"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span>{selectedOrder.user?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{selectedOrder.user?.phone || "N/A"}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#011F5B] text-sm mb-3 flex items-center gap-2">
                  <Package size={14} /> Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        {item.isMadeToOrder && (
                          <p className="mt-1 text-xs font-semibold text-amber-800">
                            MTO Item
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#D4AF37]">
                        ₦{item.priceAtBuy.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-extrabold text-xl text-[#011F5B]">
                  ₦{selectedOrder.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedOrder.status !== "DELIVERED" &&
                  selectedOrder.status !== "CANCELLED" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "CANCELLED")
                      }
                      className="flex-1 min-w-[120px] bg-red-100 text-red-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                {statusFlow[selectedOrder.status] && (
                  <button
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder.id,
                        statusFlow[selectedOrder.status],
                      )
                    }
                    className="flex-1 min-w-[120px] bg-[#011F5B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0e2c5b] transition"
                  >
                    Move to{" "}
                    {statusFlow[selectedOrder.status].replace(/_/g, " ")}
                  </button>
                )}
                <button
                  onClick={() => shareOrder(selectedOrder)}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
