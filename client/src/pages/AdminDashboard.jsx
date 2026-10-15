import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, TrendingUp, Users, DollarSign, Tag, Calendar, BarChart3, Star } from "lucide-react";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiRequest('/admin/analytics');
        setData(response.data);
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return <div className="py-24 flex justify-center"><Loader text="Loading dashboard..." /></div>;
  }

  const categoryCount = data.categoryBreakdown.reduce((sum, cat) => sum + cat._count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="section-heading">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your store.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
              <Package className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{categoryCount}</p>
            <p className="text-xs text-gray-600 mt-1">Active in catalog</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Paid Orders</h3>
              <TrendingUp className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{data.sales.orderCount}</p>
            <p className="text-xs mt-1">Confirmed payments</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Customers</h3>
              <Users className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{data.users.total}</p>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
              <DollarSign className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">₦{(data.sales.total / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">From paid orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/products" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <Package className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, and organize</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <TrendingUp className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">View Orders</h3>
            <p className="text-sm text-gray-600">Track and manage fulfillments</p>
          </Link>
          <Link to="/admin/coupons" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <Tag className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Manage Coupons</h3>
            <p className="text-sm text-gray-600">Create discount codes</p>
          </Link>
          <Link to="/admin/analytics" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <BarChart3 className="mx-auto mb-4 text-[#D4AF37]" size={32} />
            <h3 className="font-semibold text-[#011F5B] mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed reports</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#011F5B]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#D4AF37] hover:text-[#011F5B] font-medium">View All →</Link>
          </div>
          <div className="space-y-4">
            {data.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders found.</p>
            ) : (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-semibold text-[#011F5B]">{order.user?.name || "Guest"}</p>
                    <p className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-[400px]">
                      {order.items.map(i => i.productName).join(", ")}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#D4AF37]">₦{order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/add-product" className="bg-[#D4AF37] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow text-white">
            <Package className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Add New Product</h3>
          </Link>
          <Link to="/admin/featured" className="bg-[#011F5B] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow text-white">
            <Star className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Manage Featured</h3>
          </Link>
          <Link to="/admin/events" className="bg-[#fbbf24] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow text-white">
            <Calendar className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Manage Events</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}