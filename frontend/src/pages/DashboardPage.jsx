import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { formatWeight } from '../utils/formatters';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, categoryRes, statusRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/category'),
        api.get('/analytics/status'),
      ]);

      setStats(statsRes.data);
      setCategoryData(statsRes.data.categoryData || []);
      setStatusData(statusRes.data.distribution || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm md:text-base">Loading dashboard...</div>;
  }

  const COLORS = ['#22C55E', '#2563EB', '#EF4444'];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-matte-black mb-1 md:mb-2">📊 Dashboard</h1>
        <p className="text-xs md:text-sm text-gray-600">Maniratna Jewels Inventory Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs md:text-sm truncate">Total</p>
              <p className="text-lg md:text-3xl font-bold text-matte-black mt-1">
                {stats?.inventory?.totalProducts || 0}
              </p>
            </div>
            <div className="text-2xl md:text-4xl flex-shrink-0">📦</div>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs md:text-sm truncate">In Stock</p>
              <p className="text-lg md:text-3xl font-bold text-green-600 mt-1">
                {stats?.inventory?.inStockProducts || 0}
              </p>
            </div>
            <div className="text-2xl md:text-4xl flex-shrink-0">✓</div>
          </div>
        </div>

        {/* Sold */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs md:text-sm truncate">Sold</p>
              <p className="text-lg md:text-3xl font-bold text-red-600 mt-1">
                {stats?.inventory?.soldProducts || 0}
              </p>
            </div>
            <div className="text-2xl md:text-4xl flex-shrink-0">💰</div>
          </div>
        </div>

        {/* Returned */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6 sm:block">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs md:text-sm truncate">Returned</p>
              <p className="text-lg md:text-3xl font-bold text-blue-600 mt-1">
                {stats?.inventory?.returnedProducts || 0}
              </p>
            </div>
            <div className="text-2xl md:text-4xl flex-shrink-0">↩️</div>
          </div>
        </div>

        {/* Gross Weight */}
        {/* <div className="bg-white rounded-lg shadow p-3 md:p-6 lg:block">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs md:text-sm truncate">Weight</p>
              <p className="text-lg md:text-2xl font-bold text-gold mt-1">
                {formatWeight(stats?.weights?.gross)}g
              </p>
            </div>
            <div className="text-2xl md:text-4xl flex-shrink-0">⚖️</div>
          </div>
        </div> */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Status Distribution */}
        {/* <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <h2 className="text-sm md:text-lg font-bold text-matte-black mb-3 md:mb-4">
            📊 Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">In Stock</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">Sold</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Returned</span>
            </div>
          </div>
        </div> */}

        {/* Daily Activity */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <h2 className="text-sm md:text-lg font-bold text-matte-black mb-3 md:mb-4">
            📅 Daily Activity
          </h2>
          <div className="space-y-1 md:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-gray-600">📥 Today's Stock In</span>
              <span className="text-lg md:text-2xl font-bold text-green-600">
                {stats?.today?.stockIn || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-gray-600">📤 Today's Stock Out</span>
              <span className="text-lg md:text-2xl font-bold text-red-600">
                {stats?.today?.stockOut || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-gray-600">🔄 Transactions</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">
                {stats?.today?.transactions || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Weight Analytics */}
        <div className="bg-white rounded-lg shadow p-3 md:p-6">
          <h2 className="text-sm md:text-lg font-bold text-matte-black mb-3 md:mb-4">
            ⚖️ Weight Analytics
          </h2>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Gross</p>
              <p className="text-base md:text-2xl font-bold text-gold mt-1">
                {formatWeight(stats?.weights?.gross)}g
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Net</p>
              <p className="text-base md:text-2xl font-bold text-matte-black mt-1">
                {formatWeight(stats?.weights?.net)}g
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Stone</p>
              <p className="text-base md:text-2xl font-bold text-gray-600 mt-1">
                {formatWeight(stats?.weights?.stone)}g
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Tag</p>
              <p className="text-base md:text-2xl font-bold text-gray-400 mt-1">
                {formatWeight(stats?.weights?.tag)}g
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
