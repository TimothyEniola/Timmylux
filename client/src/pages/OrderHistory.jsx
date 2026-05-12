// import { useState } from "react";
// import { Package, Truck, CheckCircle, Clock, Eye, Share2 } from "lucide-react";
// export default function OrderHistory() {
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // ✅ Corrected orders structure
//   const orders = [
//     {
//       id: "ORD-001",
//       amount: 485000,
//       status: "delivered",
//       date: "2026-01-15",
//       tracking: {
//         location: "Lagos Distribution Center",
//         estimatedDelivery: "2026-01-15",
//       },
//       items: [
//         {
//           name: "Luxury King Bed Frame",
//           quantity: 1,
//           price: 485000,
//         },
//       ],
//     },
//     {
//       id: "ORD-002",
//       amount: 420000,
//       status: "shipped",
//       date: "2026-01-14",
//       tracking: {
//         location: "Abuja Transit Hub",
//         estimatedDelivery: "2026-01-18",
//       },
//       items: [
//         {
//           name: "Premium Velvet Sofa",
//           quantity: 1,
//           price: 420000,
//         },
//       ],
//     },
//     {
//       id: "ORD-003",
//       amount: 125000,
//       status: "processing",
//       date: "2026-01-13",
//       tracking: {
//         location: "Warehouse",
//         estimatedDelivery: "2026-01-20",
//       },
//       items: [
//         {
//           name: "Modern Coffee Table",
//           quantity: 1,
//           price: 125000,
//         },
//       ],
//     },
//   ];

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "delivered":
//         return <CheckCircle className="text-green-500" size={20} />;
//       case "shipped":
//         return <Truck className="text-blue-500" size={20} />;
//       case "processing":
//         return <Clock className="text-yellow-500" size={20} />;
//       default:
//         return <Package className="text-gray-500" size={20} />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "delivered":
//         return "text-green-600 bg-green-50";
//       case "shipped":
//         return "text-blue-600 bg-blue-50";
//       case "processing":
//         return "text-yellow-600 bg-yellow-50";
//       default:
//         return "text-gray-600 bg-gray-50";
//     }
//   };

//   // SHARE FUNCTIONS
//   const shareOrder = async (order) => {
//     const itemsList = order.items
//       .map((item) => `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`)
//       .join("\n");

//     const shareData = {
//       title: `Order #${order.id} - Timmy Lux Furniture`,
//       text: `Order #${order.id}\nDate: ${order.date}\nStatus: ${order.status.toUpperCase()}\nTotal: ₦${order.amount.toLocaleString()}\n\nItems:\n${itemsList}`,
//       url: window.location.href,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         // Fallback for browsers that don't support Web Share API
//         navigator.clipboard.writeText(shareData.text);
//         alert("Order details copied to clipboard!");
//       }
//     } catch (error) {
//       console.log("Error sharing:", error);
//     }
//   };

//   return (
//     <div className="container-custom py-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
//           Order History
//         </h1>

//         <div className="space-y-6">
//           {orders.length > 0 ? (
//             orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white rounded-lg shadow-md p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-4">
//                     {getStatusIcon(order.status)}
//                     <div>
//                       <h3 className="font-semibold text-[#011F5B]">
//                         Order #{order.id}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {order.date}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="font-semibold text-[#011F5B]">
//                       ₦{order.amount.toLocaleString()}
//                     </p>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <div>
//                     <h4 className="font-medium mb-2">Items:</h4>
//                     <ul className="text-sm text-gray-600 space-y-1">
//                       {order.items.map((item, index) => (
//                         <li key={index}>
//                           {item.name} (x{item.quantity}) — ₦
//                           {item.price.toLocaleString()}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8952A] transition-colors whitespace-nowrap"
//                     >
//                       <Eye size={16} />
//                       View
//                     </button>

//                     {/* Share Button */}
//                     <button
//                       onClick={() => shareOrder(order)}
//                       className="flex items-center gap-2 px-3 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                       title="Share Order"
//                     >
//                       <Share2 size={16} />
//                       Share
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <Package
//                 size={48}
//                 className="text-gray-400 mx-auto mb-4"
//               />
//               <h3 className="text-lg font-semibold text-[#011F5B] mb-2">
//                 No Orders Yet
//               </h3>
//               <p className="text-gray-600">
//                 You haven't placed any orders yet.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ✅ Creative Modal */}
//         {selectedOrder && (
//           <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn">
//             <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-slideUp">
//               {/* Header with gradient background */}
//               <div className="bg-gradient-to-r from-[#011F5B] to-[#D4AF37] text-white p-6 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-black/10"></div>
//                 <div className="relative z-10">
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-4">
//                       {getStatusIcon(selectedOrder.status)}
//                       <div>
//                         <h2 className="text-3xl font-bold">
//                           Order #{selectedOrder.id}
//                         </h2>
//                         <p className="text-white/80 mt-1">
//                           Placed on {selectedOrder.date}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => shareOrder(selectedOrder)}
//                         className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
//                         title="Share Order"
//                       >
//                         <Share2 size={20} />
//                       </button>
//                       <button
//                         onClick={() => setSelectedOrder(null)}
//                         className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 text-2xl font-bold"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Decorative elements */}
//                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
//                 <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
//               </div>

//               {/* Content */}
//               <div className="p-8">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   {/* Order Details */}
//                   <div className="space-y-6">
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
//                       <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
//                         <Package size={24} />
//                         Order Details
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600">Status:</span>
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
//                             {selectedOrder.status}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600">Total Amount:</span>
//                           <span className="text-2xl font-bold text-[#011F5B]">
//                             ₦{selectedOrder.amount.toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Tracking Info */}
//                     <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
//                       <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
//                         <Truck size={24} />
//                         Tracking Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                           <div>
//                             <p className="font-medium">Current Location</p>
//                             <p className="text-gray-600">{selectedOrder.tracking.location}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                           <div>
//                             <p className="font-medium">Estimated Delivery</p>
//                             <p className="text-gray-600">{selectedOrder.tracking.estimatedDelivery}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Items Ordered */}
//                   <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl">
//                     <h3 className="text-xl font-bold text-[#011F5B] mb-4 flex items-center gap-2">
//                       <Package size={24} />
//                       Items Ordered
//                     </h3>
//                     <div className="space-y-4">
//                       {selectedOrder.items.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20"
//                         >
//                           <div className="flex-1">
//                             <p className="font-semibold text-[#011F5B]">
//                               {item.name}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Quantity: {item.quantity}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-[#011F5B]">
//                               ₦{item.price.toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Progress Bar for Order Status */}
//                 <div className="mt-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="text-lg font-semibold text-[#011F5B]">Order Progress</h4>
//                     <span className="text-sm text-gray-600 capitalize">{selectedOrder.status}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className={`h-3 rounded-full transition-all duration-1000 ${
//                         selectedOrder.status === 'delivered' ? 'bg-green-500 w-full' :
//                         selectedOrder.status === 'shipped' ? 'bg-blue-500 w-2/3' :
//                         'bg-yellow-500 w-1/3'
//                       }`}
//                     ></div>
//                   </div>
//                   <div className="flex justify-between text-xs text-gray-500 mt-2">
//                     <span>Processing</span>
//                     <span>Shipped</span>
//                     <span>Delivered</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Orders State
  const [orders, setOrders] = useState([
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
  ]);

  // ✅ Cancel Order
  const cancelOrder = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    const updatedOrders = orders.map((order) =>
      order.id === id
        ? {
          ...order,
          status: "cancelled",
        }
        : order
    );

    setOrders(updatedOrders);

    // update selected modal order too
    if (selectedOrder?.id === id) {
      setSelectedOrder({
        ...selectedOrder,
        status: "cancelled",
      });
    }
  };

  // ✅ Status Icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-500" size={20} />;

      case "shipped":
        return <Truck className="text-blue-500" size={20} />;

      case "processing":
        return <Clock className="text-yellow-500" size={20} />;

      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;

      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  // ✅ Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";

      case "shipped":
        return "text-blue-600 bg-blue-50";

      case "processing":
        return "text-yellow-600 bg-yellow-50";

      case "cancelled":
        return "text-red-600 bg-red-50";

      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // ✅ Share Order
  const shareOrder = async (order) => {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`
      )
      .join("\n");

    const shareData = {
      title: `Order #${order.id} - Timmy Lux Furniture`,
      text: `Order #${order.id}
Date: ${order.date}
Status: ${order.status.toUpperCase()}
Total: ₦${order.amount.toLocaleString()}

Items:
${itemsList}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);

        alert("Order details copied to clipboard!");
      }
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#011F5B]">
              Order History
            </h1>

            <p className="text-gray-600 mt-1">
              Track, manage and review all your orders
            </p>
          </div>

          <div className="bg-[#011F5B] text-white px-5 py-3 rounded-xl shadow-md">
            <p className="text-sm">Total Orders</p>
            <h2 className="text-2xl font-bold">{orders.length}</h2>
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gray-100">
                        {getStatusIcon(order.status)}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#011F5B]">
                          Order #{order.id}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Placed on {order.date}
                        </p>

                        <div className="mt-3">
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-left lg:text-right">
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <h2 className="text-3xl font-bold text-[#011F5B]">
                        ₦{order.amount.toLocaleString()}
                      </h2>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-semibold text-[#011F5B] mb-3">
                      Items Ordered
                    </h4>

                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-semibold text-[#011F5B]">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* VIEW */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-white hover:bg-[#b9972f] transition-all"
                    >
                      <Eye size={18} />
                      View Details
                    </button>

                    {/* SHARE */}
                    <button
                      onClick={() => shareOrder(order)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#011F5B] text-white hover:bg-[#02328f] transition-all"
                    >
                      <Share2 size={18} />
                      Share
                    </button>

                    {/* CANCEL */}
                    {(order.status === "processing" ||
                      order.status === "shipped") && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
                        >
                          <XCircle size={18} />
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Package
                size={60}
                className="mx-auto text-gray-400 mb-4"
              />

              <h2 className="text-2xl font-bold text-[#011F5B]">
                No Orders Yet
              </h2>

              <p className="text-gray-600 mt-2">
                You haven't placed any orders yet.
              </p>
            </div>
          )}
        </div>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-[#011F5B] to-[#D4AF37] p-8 text-white relative">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">
                      Order #{selectedOrder.id}
                    </h2>

                    <p className="mt-2 text-white/80">
                      Placed on {selectedOrder.date}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="p-8 grid lg:grid-cols-2 gap-8">
                {/* LEFT */}
                <div className="space-y-6">
                  {/* STATUS */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#011F5B] mb-4">
                      Order Status
                    </h3>

                    <div className="flex items-center gap-3">
                      {getStatusIcon(selectedOrder.status)}

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* TRACKING */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#011F5B] mb-4">
                      Tracking Info
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-500 text-sm">
                          Current Location
                        </p>

                        <p className="font-semibold">
                          {selectedOrder.tracking.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">
                          Estimated Delivery
                        </p>

                        <p className="font-semibold">
                          {
                            selectedOrder.tracking
                              .estimatedDelivery
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WARNING */}
                  {selectedOrder.status === "cancelled" && (
                    <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex gap-3">
                      <AlertTriangle className="text-red-500" />

                      <div>
                        <h4 className="font-bold text-red-600">
                          Order Cancelled
                        </h4>

                        <p className="text-sm text-red-500 mt-1">
                          This order has been cancelled and
                          will not be processed.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div>
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#011F5B] mb-5">
                      Ordered Items
                    </h3>

                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-xl border"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-[#011F5B]">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <p className="font-bold text-[#011F5B]">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="border-t mt-6 pt-6 flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total
                      </span>

                      <span className="text-3xl font-bold text-[#011F5B]">
                        ₦
                        {selectedOrder.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => shareOrder(selectedOrder)}
                      className="flex-1 flex justify-center items-center gap-2 bg-[#011F5B] text-white py-3 rounded-xl hover:bg-[#02328f] transition-all"
                    >
                      <Share2 size={18} />
                      Share Order
                    </button>

                    {(selectedOrder.status ===
                      "processing" ||
                      selectedOrder.status ===
                      "shipped") && (
                        <button
                          onClick={() =>
                            cancelOrder(selectedOrder.id)
                          }
                          className="flex-1 flex justify-center items-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-all"
                        >
                          <XCircle size={18} />
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* PROGRESS */}
              {selectedOrder.status !== "cancelled" && (
                <div className="px-8 pb-8">
                  <h3 className="font-bold text-[#011F5B] mb-4">
                    Order Progress
                  </h3>

                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${selectedOrder.status === "delivered"
                          ? "w-full bg-green-500"
                          : selectedOrder.status === "shipped"
                            ? "w-2/3 bg-blue-500"
                            : "w-1/3 bg-yellow-500"
                        }`}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}