import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

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
                  className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <button className="btn-secondary text-sm text-white">
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
    </div>
  );
}