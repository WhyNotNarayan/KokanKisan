import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, AlertTriangle, Package, UserCheck } from 'lucide-react';
import { api } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Farmers', value: stats.totalFarmers, icon: UserCheck, color: 'bg-forest-100 text-forest-600' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-amber-100 text-amber-600' },
    { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Commission', value: `₹${stats.totalCommission}`, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { label: 'Total Flags', value: stats.totalFlags, icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="card">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/admin/farmers" className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              Review Pending Farmers ({stats.pendingApprovals})
            </a>
            <a href="/admin/flags" className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              Review Flagged Products ({stats.totalFlags})
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Platform Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Buyer to Farmer ratio</span>
              <span>{stats.totalFarmers > 0 ? Math.round(stats.totalBuyers / stats.totalFarmers) : 0}:1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg orders per farmer</span>
              <span>{stats.totalFarmers > 0 ? Math.round(stats.totalOrders / stats.totalFarmers) : 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Commission rate</span>
              <span>7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
