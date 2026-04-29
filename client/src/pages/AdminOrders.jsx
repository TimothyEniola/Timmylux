import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data - in real app, this would come from API
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-1704067200000",
        customerName: "John Doe",
        email: "john@example.com",
        total: 150000,
        status: "processing",
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
        status: "shipped",
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
        status: "delivered",
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

  const updateOrderStatus = (orderId, newStatus) => {
    // Find the current order
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    // Define valid status progression: Pending → Shipped → Delivered
    const statusOrder = ['Pending', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const newIndex = statusOrder.indexOf(newStatus);

    // Only allow forward progression (not going backwards)
    if (newIndex <= currentIndex) {
      alert(`Cannot change status from ${currentOrder.status} to ${newStatus}. Status can only progress forward.`);
      return;
    }

    // Update local state
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    // In a real app, this would also update the user's order status
    // For demo purposes, we'll simulate updating user orders
    // updateUserOrderStatus(orderId, newStatus, "Updated by admin");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-[#011F5B] mb-8">Recent Orders</h1>

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

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  disabled={order.status === 'Delivered'}
                  className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)} ${order.status === 'Delivered' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                {order.status === 'Delivered' && (
                  <span className="text-xs text-gray-500 italic">(Locked)</span>
                )}
              </div>
              <button 
                onClick={() => setSelectedOrder(order)}
                className="btn-secondary text-sm text-white hover:opacity-90 transition-opacity"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#011F5B]">
                  Order #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-[#011F5B] mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{selectedOrder.email}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-[#011F5B] mb-3">Shipping Address</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-600">Full Name:</span> {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span> {selectedOrder.shippingAddress.phone}
                    </p>
                    <p>
                      <span className="text-gray-600">Address:</span> {selectedOrder.shippingAddress.address}
                    </p>
                    <p>
                      <span className="text-gray-600">City:</span> {selectedOrder.shippingAddress.city}
                    </p>
                    <p>
                      <span className="text-gray-600">State:</span> {selectedOrder.shippingAddress.state}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-[#011F5B] mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₦{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-[#011F5B] mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span>Total:</span>
                      <span className="text-[#D4AF37]">₦{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-[#011F5B] text-white py-2 rounded-lg font-medium hover:bg-[#0a1539] transition-colors"
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