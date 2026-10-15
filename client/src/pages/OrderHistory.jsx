import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";
import EmptyState from "../components/EmptyState";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiRequest("/orders", { method: "GET" });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your order history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="text-green-500" size={20} />;
      case "DISPATCHED":
      case "READY_FOR_PICKUP":
        return <Truck className="text-blue-500" size={20} />;
      case "PROCESSING":
      case "PENDING":
        return <Clock className="text-yellow-500" size={20} />;
      case "CANCELLED":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600 bg-green-50 border-green-200";
      case "DISPATCHED":
      case "READY_FOR_PICKUP":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "PROCESSING":
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // SHARE FUNCTIONS
  const shareOrder = async (order) => {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.productName} (x${item.quantity}) - ₦${item.priceAtBuy.toLocaleString()}`,
      )
      .join("\n");

    const reference = order.paystackRef || order.id;

    const shareData = {
      title: `Order #${reference} - TimmyLux`,
      text: `Order #${reference}\nDate: ${formatDate(order.createdAt)}\nStatus: ${order.status}\nTotal: ₦${order.totalAmount.toLocaleString()}\n\nItems:\n${itemsList}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.text);
        toast.success("Order details copied to clipboard!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  if (error) {
    return (
      <div className="container-custom py-16">
        <EmptyState
          title="Connection Error"
          message={error}
          actionText="Refresh Page"
          onActionClick={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
          Order History
        </h1>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => {
              const displayId = order.paystackRef || order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-[#011F5B] break-all">
                          Order #{displayId}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                      <p className="font-bold text-[#011F5B] text-lg">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="w-full sm:w-2/3">
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">
                        Items:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <li key={item.id} className="truncate">
                            <span className="font-medium">
                              {item.productName}
                            </span>{" "}
                            (x{item.quantity}) — ₦
                            {item.priceAtBuy.toLocaleString()}
                          </li>
                        ))}
                        {order.items.length > 2 && (
                          <li className="text-gray-400 italic font-medium">
                            + {order.items.length - 2} more item(s)...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8952A] transition-colors font-medium whitespace-nowrap"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => shareOrder(order)}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors font-medium"
                        title="Share Order"
                      >
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No Orders Yet"
              message="You haven't placed any orders yet. Start exploring our premium collections!"
              actionText="Shop Now"
              actionLink="/products"
            />
          )}
        </div>

        {/* ✅ Creative Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 animate-fadeIn sm:items-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-detail-title"
              className="my-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white shadow-2xl animate-slideUp"
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-[#011F5B] to-[#D4AF37] text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(selectedOrder.status)}
                      <div>
                        <h2
                          id="order-detail-title"
                          className="text-xl sm:text-3xl font-bold break-all"
                        >
                          #{selectedOrder.paystackRef || selectedOrder.id}
                        </h2>
                        <p className="text-white/80 mt-1 text-sm">
                          Placed on {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => shareOrder(selectedOrder)}
                        className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
                        title="Share Order"
                      >
                        <Share2 size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 text-xl sm:text-2xl font-bold flex items-center justify-center"
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
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Order Details */}
                  <div className="space-y-6">
                    <div className="rounded-xl bg-gradient-to-br from-navy/5 to-primary/10 p-6">
                      <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                        <Package size={24} />
                        Payment Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-semibold text-gray-900">
                            {selectedOrder.paymentMethod.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                          <span className="text-gray-600">Payment Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              selectedOrder.paymentStatus === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-2xl font-bold text-[#011F5B]">
                            ₦{selectedOrder.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-100">
                      <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                        <Truck size={24} />
                        Order Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${selectedOrder.status === "CANCELLED" ? "bg-red-500" : "bg-[#D4AF37]"}`}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Current Phase
                            </p>
                            <p
                              className={`text-sm font-semibold ${getStatusColor(selectedOrder.status).split(" ")[0]}`}
                            >
                              {selectedOrder.status.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                    <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
                      <Package size={24} />
                      Items Ordered
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start p-4 bg-white shadow-sm rounded-lg border border-white"
                        >
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-[#011F5B]">
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-600">
                                Qty:{" "}
                                <span className="font-bold">
                                  {item.quantity}
                                </span>
                              </p>
                              {item.isMadeToOrder && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                  MTO
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#D4AF37]">
                              ₦{item.priceAtBuy.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Order Status */}
                {selectedOrder.status !== "CANCELLED" && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-[#011F5B]">
                        Order Progress
                      </h4>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          selectedOrder.status === "DELIVERED"
                            ? "bg-green-500 w-full"
                            : selectedOrder.status === "READY_FOR_PICKUP"
                              ? "bg-emerald-400 w-5/6"
                              : selectedOrder.status === "DISPATCHED"
                                ? "bg-blue-500 w-2/3"
                                : selectedOrder.status === "PROCESSING"
                                  ? "bg-yellow-500 w-1/2"
                                  : "bg-[#D4AF37] w-1/4"
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                      <span>Pending</span>
                      <span>Processing</span>
                      <span>Dispatched</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
