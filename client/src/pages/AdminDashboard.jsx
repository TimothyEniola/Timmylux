import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Tag,
  Calendar,
  BarChart3,
  Settings,
  Star,
} from "lucide-react";
// import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [recentOrders] = useState([
    {
      id: 1,
      customer: "Esther Adebayo",
      product: "Luxury King Bed Frame",
      amount: 485000,
      status: "Pending",
      date: "2026-01-15",
    },
    {
      id: 2,
      customer: "Daniel Okonkwo",
      product: "Premium Velvet Sofa",
      amount: 420000,
      status: "Delivered",
      date: "2026-01-14",
    },
    {
      id: 3,
      customer: "Faith Olamide",
      product: "Elegant Dining Set",
      amount: 380000,
      status: "Pending",
      date: "2026-01-15",
    },
  ]);

  const [stats] = useState({
    totalProducts: 45,
    totalOrders: 127,
    totalCustomers: 89,
    totalRevenue: 28500000,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-heading">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your store.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
              <Package className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{stats.totalProducts}</p>
            <p className="text-xs text-gray-600 mt-1">Active listings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <TrendingUp className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{stats.totalOrders}</p>
            <p className="text-xs mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Customers</h3>
              <Users className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{stats.totalCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
              <DollarSign className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">
              ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-1">Total earnings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/products"
            className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block"
          >
            <Package className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, and organize your products</p>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block"
          >
            <TrendingUp className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">View Orders</h3>
            <p className="text-sm text-gray-600">Track and manage customer orders</p>
          </Link>
          <Link
            to="/admin/coupons"
            className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block"
          >
            <Tag className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Manage Coupons</h3>
            <p className="text-sm text-gray-600">Create and manage discount codes</p>
          </Link>
          <Link
            to="/admin/analytics"
            className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block"
          >
            <BarChart3 className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed analytics and reports</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#011F5B]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#D4AF37] hover:text-[#011F5B] font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-semibold text-[#011F5B]">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.product}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#D4AF37]">₦{order.amount.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/add-product"
            className="bg-[#D4AF37] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block text-white"
          >
            <Package className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Add New Product</h3>
            <p className="text-sm opacity-90">Create new products for your store</p>
          </Link>
          <Link
            to="/admin/featured"
            className="bg-[#011F5B] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block text-white"
          >
            <Star className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Manage Featured</h3>
            <p className="text-sm opacity-90">Set featured products with timers</p>
          </Link>
          <Link
            to="/admin/events"
            className="bg-[#fbbf24] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block text-white"
          >
            <Calendar className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Manage Events</h3>
            <p className="text-sm opacity-90">Create promotional events</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
