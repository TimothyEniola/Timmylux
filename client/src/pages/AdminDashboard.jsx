import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
// import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [orders] = useState([
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
    {
      id: 4,
      customer: "Michael Eze",
      product: "Premium Wardrobe",
      amount: 650000,
      status: "Delivered",
      date: "2026-01-13",
    },
    {
      id: 5,
      customer: "Grace Nnamdi",
      product: "Executive Office Desk",
      amount: 385000,
      status: "Pending",
      date: "2026-01-16",
    },
    {
      id: 6,
      customer: "Samuel Ade",
      product: "Designer Bedroom Suite",
      amount: 890000,
      status: "Delivered",
      date: "2026-01-12",
    },
    {
      id: 7,
      customer: "Jennifer Bello",
      product: "Luxury Armchair",
      amount: 185000,
      status: "Cancelled",
      date: "2026-01-14",
    },
  ]);

  // Calculate statistics
  const totalSales = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalOrders = orders.length;

  // Data for charts
  const orderStatusData = [
    { name: "Pending", value: pendingOrders, color: "#fbbf24" },
    { name: "Delivered", value: deliveredOrders, color: "#D4AF37" },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status === "Cancelled").length,
      color: "#DC2626",
    },
  ];

  const salesTrendData = [
    { month: "Aug", sales: 2150000 },
    { month: "Sep", sales: 2850000 },
    { month: "Oct", sales: 3200000 },
    { month: "Nov", sales: 3650000 },
    { month: "Dec", sales: 4100000 },
    { month: "Jan", sales: 3210000 },
  ];

  const categoryData = [
    { category: "Bedroom", sales: 8, amount: 2850000 },
    { category: "Living Room", sales: 12, amount: 3450000 },
    { category: "Dining", sales: 6, amount: 1680000 },
    { category: "Office", sales: 4, amount: 1280000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-heading">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor your store performance and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
              <DollarSign className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">
              ₦{(totalSales / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <Package className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{totalOrders}</p>
            <p className="text-xs  mt-1">+8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">
                Pending Orders
              </h3>
              <Clock className="text-[#fbbf24]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{pendingOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting delivery</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Delivered</h3>
              <CheckCircle className="text-[#D4AF37]" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">
              {deliveredOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">
              Order Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Trend Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">
              Sales Trend (6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Performance Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-[#011F5B] mb-6">
              Sales by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" orientation="left" stroke="#011F5B" />
                <YAxis yAxisId="right" orientation="right" stroke="#D4AF37" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="#011F5B"
                  name="Units Sold"
                />
                <Bar
                  yAxisId="right"
                  dataKey="amount"
                  fill="#D4AF37"
                  name="Revenue (₦)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            to="/admin/add-product"
            className="bg-[#D4AF37] rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer block text-white"
          >
            <Users className="mx-auto mb-4 text-white" size={32} />
            <h3 className="font-semibold mb-2">Add Product</h3>
            <p className="text-sm opacity-90">Create new products for your store</p>
          </Link>
        </div>

        {/* Orders Table */}
      </div>
    </div>
  );
}
