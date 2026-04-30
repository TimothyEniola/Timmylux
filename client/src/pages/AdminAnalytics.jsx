import { useState } from "react";
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
import { Share2, Copy, Check as CheckIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function AdminAnalytics() {
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

  const [copiedAnalytics, setCopiedAnalytics] = useState(false);

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

  const formatAnalyticsSummary = () => {
    const summary = `
Store Analytics Summary:
📊 Total Sales: ₦${(totalSales / 1000000).toFixed(1)}M (+12.5% from last month)
📦 Total Orders: ${totalOrders} (+8% from last month)
⏰ Pending Orders: ${pendingOrders}
✅ Delivered Orders: ${deliveredOrders}

Sales by Category:
🏠 Bedroom: ₦${(2850000 / 1000000).toFixed(1)}M (${8} sales)
🛋️ Living Room: ₦${(3450000 / 1000000).toFixed(1)}M (${12} sales)
🍽️ Dining: ₦${(1680000 / 1000000).toFixed(1)}M (${6} sales)
💼 Office: ₦${(1280000 / 1000000).toFixed(1)}M (${4} sales)

Recent Orders:
${orders.slice(0, 5).map(order => `- ${order.customer}: ${order.product} (₦${(order.amount / 1000).toFixed(0)}K) - ${order.status}`).join('\n')}
    `.trim();
    return summary;
  };

  const shareViaWhatsApp = () => {
    const summary = formatAnalyticsSummary();
    const message = encodeURIComponent(`Store Analytics Report:\n\n${summary}`);
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const summary = formatAnalyticsSummary();
    const subject = encodeURIComponent("Store Analytics Report");
    const body = encodeURIComponent(`Hi,\n\nHere's the latest store analytics report:\n\n${summary}\n\nBest regards`);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    const summary = formatAnalyticsSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedAnalytics(true);
      setTimeout(() => setCopiedAnalytics(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="section-heading">Analytics</h1>
              <p className="text-gray-600">
                Monitor your store performance and analytics
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareViaWhatsApp}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="Share via WhatsApp"
              >
                <FaWhatsapp size={16} />
              </button>
              <button
                onClick={shareViaEmail}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Share via Email"
              >
                <span className="text-sm font-bold">✉</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Copy to Clipboard"
              >
                {copiedAnalytics ? (
                  <CheckIcon size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
              <div className="text-[#fbbf24]">$</div>
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">
              ₦{(totalSales / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <div className="text-[#D4AF37]">📦</div>
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{totalOrders}</p>
            <p className="text-xs mt-1">+8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">
                Pending Orders
              </h3>
              <div className="text-[#fbbf24]">⏰</div>
            </div>
            <p className="text-3xl font-bold text-[#D4AF37]">{pendingOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting delivery</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Delivered</h3>
              <div className="text-[#D4AF37]">✅</div>
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
              Sales Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-6">
            Sales by Category
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
              <Legend />
              <Bar dataKey="amount" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}