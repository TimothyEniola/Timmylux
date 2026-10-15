import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Share2, Copy, Check as CheckIcon } from "lucide-react";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa6";
import { apiRequest } from "../utils/api";
import Loader from "../components/loader";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAnalytics, setCopiedAnalytics] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiRequest('/admin/analytics');
        setData(response.data);
      } catch (error) {
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return <div className="py-24 flex justify-center"><Loader text="Gathering analytics..." /></div>;
  }

  // Format data for Recharts
  const orderStatusData = data.ordersByStatus.map(status => ({
    name: status.status.replace(/_/g, ' '),
    value: status._count,
    color: status.status === 'DELIVERED' ? '#D4AF37' : status.status === 'CANCELLED' ? '#DC2626' : '#fbbf24'
  }));

  const salesTrendData = data.revenueByMonth.map(item => {
    const date = new Date(item.createdAt);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      sales: item._sum.totalAmount || 0
    };
  }).reverse(); // Most recent on right

  const categoryData = data.categoryBreakdown.map(cat => ({
    category: cat.category,
    amount: cat._count
  }));

  const formatAnalyticsSummary = () => {
    const cancelledCount = data.ordersByStatus.find(o => o.status === 'CANCELLED')?._count || 0;
    const deliveredCount = data.ordersByStatus.find(o => o.status === 'DELIVERED')?._count || 0;
    const pendingCount = data.ordersByStatus.find(o => o.status === 'PENDING')?._count || 0;

    return `
Store Analytics Summary:
📊 Total Paid Sales: ₦${(data.sales.total / 1000000).toFixed(1)}M
📦 Total Paid Orders: ${data.sales.orderCount}
⏰ Pending Orders: ${pendingCount}
✅ Delivered Orders: ${deliveredCount}
❌ Cancelled Orders: ${cancelledCount}
👥 Total Users: ${data.users.total} (${data.users.verified} verified)

Recent Paid Orders:
${data.recentOrders.slice(0, 5).map(order => `- ${order.user?.name || 'Guest'} (₦${(order.totalAmount / 1000).toFixed(0)}K) -${order.status}`).join('\n')}
    `.trim();
  };

  const shareViaWhatsApp = () => {
    const summary = formatAnalyticsSummary();
    window.open(`https://wa.me/?text=${encodeURIComponent(`Store Analytics Report:\n\n${summary}`)}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatAnalyticsSummary());
      setCopiedAnalytics(true);
      setTimeout(() => setCopiedAnalytics(false), 2000);
      toast.success("Analytics copied!");
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="section-heading">Analytics</h1>
              <p className="text-gray-600">Monitor your store performance and analytics</p>
            </div>
            <div className="flex gap-2">
              <button onClick={shareViaWhatsApp} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FaWhatsapp size={16} />
              </button>
              <button onClick={copyToClipboard} className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                {copiedAnalytics ? <CheckIcon size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Paid Revenue</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">₦{(data.sales.total / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Paid Orders</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">{data.sales.orderCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#011F5B]">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Registered Users</h3>
            <p className="text-3xl font-bold text-[#011F5B]">{data.users.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Verified Users</h3>
            <p className="text-3xl font-bold text-green-600">{data.users.verified}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {orderStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">Paid Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", strokeWidth: 2, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">Top Selling Products</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{p.name || 'Deleted Product'}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <p className="text-[#D4AF37] font-bold">{p.totalSold} sold</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6">Catalog Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#011F5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}