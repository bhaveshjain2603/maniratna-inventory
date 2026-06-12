import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/api";
import { formatWeight } from "../utils/formatters";

const ReportsPage = () => {
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [stockAging, setStockAging] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [categoryRes, deadStockRes, stockAgingRes] = await Promise.all([
        api.get("/analytics/category"),
        api.get("/analytics/dead-stock"),
        api.get("/analytics/stock-aging"),
      ]);

      setCategoryDistribution(categoryRes.data.distribution || []);
      setDeadStock(deadStockRes.data.deadStock || []);
      setStockAging(stockAgingRes.data.stockAging || []);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#D4AF37", "#2A2A2A", "#999999", "#CCCCCC", "#666666"];

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black">
        📊 Reports
      </h1>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-sm md:text-lg lg:text-xl font-bold text-matte-black mb-3 md:mb-4">
          📦 Category Distribution
        </h2>
        {loading ? (
          <div className="text-center py-12 text-xs md:text-sm">Loading...</div>
        ) : categoryDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#D4AF37" name="Count" />
              <Bar dataKey="totalNetWeight" fill="#2A2A2A" name="Net Weight" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-xs md:text-sm text-gray-600">
            No data available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Dead Stock */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="flex flex-row justify-between text-sm md:text-lg font-bold text-matte-black mb-2 md:mb-4">
            ⚠️ Dead Stock Report
            <p className="text-sm md:text-lg">
              📊 Total: {deadStock.length} product
              {deadStock.length !== 1 ? "s" : ""}
            </p>
          </h2>
          {deadStock.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 md:px-4 py-2 text-left">Code</th>
                      <th className="px-2 md:px-4 py-2 text-left">Category</th>
                      <th className="px-2 md:px-4 py-2 text-left">Gross Wt.</th>
                      <th className="px-2 md:px-4 py-2 text-left">Net Wt.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deadStock.slice(0, 10).map((product) => (
                      <tr
                        key={product._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-2 md:px-4 py-2 font-semibold text-gold">
                          {product.productCode}
                        </td>
                        <td className="px-2 md:px-4 py-2 text-xs md:text-sm truncate">
                          {product.category}
                        </td>
                        <td className="px-2 md:px-4 py-2">
                          {product.weight?.gross}g
                        </td>
                        <td className="px-2 md:px-4 py-2">
                          {product.weight?.net}g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {deadStock.length > 10 && (
                <p className="text-xs md:text-sm text-gray-600 mt-2">
                  ... and {deadStock.length - 10} more
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-xs md:text-sm text-gray-600">
              ✓ No dead stock found
            </div>
          )}
        </div>

        {/* Fast Moving */}
        {/* <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-sm md:text-lg font-bold text-matte-black mb-2 md:mb-4">
            🔥 Fast Moving Products
            <span className="text-xs md:text-sm font-normal text-gray-600 ml-2 block md:inline">
              (Last 30 days)
            </span>
          </h2>
          {fastMoving.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 md:px-4 py-2 text-left">Product Code</th>
                    <th className="px-2 md:px-4 py-2 text-left">Product Category</th>
                    <th className="px-2 md:px-4 py-2 text-left">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {fastMoving.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-2 md:px-4 py-2 font-semibold text-gold">
                        {item.productCode}
                      </td>
                      <td className="px-2 md:px-4 py-2 font-semibold">
                        {item.category}
                      </td>
                      <td className="px-2 md:px-4 py-2">
                        <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                          {item.count} 💰
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs md:text-sm text-gray-600">
              No fast-moving products found
            </div>
          )}
        </div> */}

        {/* Stock Aging */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="flex flex-row justify-between text-sm md:text-lg font-bold text-matte-black mb-2 md:mb-4">
            ⏳ Stock Aging
            {/* <span className="text-xs md:text-sm font-normal text-gray-600 ml-2">
              (Oldest inventory first)
            </span> */}
            <p className="text-sm md:text-lg">
              📊 Total: {stockAging.length} product
              {stockAging.length !== 1 ? "s" : ""}
            </p>
          </h2>

          {stockAging.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 md:px-4 py-2 text-left">
                        Product Code
                      </th>

                      <th className="px-2 md:px-4 py-2 text-left">Category</th>

                      <th className="px-2 md:px-4 py-2 text-left">Gross Wt.</th>

                      <th className="px-2 md:px-4 py-2 text-left">Days</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stockAging.slice(0, 10).map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="px-2 md:px-4 py-2 font-semibold text-gold">
                          {item.productCode}
                        </td>

                        <td className="px-2 md:px-4 py-2">{item.category}</td>

                        <td className="px-2 md:px-4 py-2">
                          {formatWeight(item.grossWeight)}
                        </td>

                        <td className="px-2 md:px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.daysInStock > 180
                                ? "bg-red-100 text-red-800"
                                : item.daysInStock > 90
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.daysInStock} Days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {stockAging.length > 10 && (
                <p className="text-xs md:text-sm text-gray-600 mt-2">
                  ... and {stockAging.length - 10} more
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-xs md:text-sm text-gray-600">
              No aging inventory found
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-sm md:text-lg font-bold text-matte-black mb-3 md:mb-4">
          ⬇️ Export Reports (*In developing)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <button className="border-2 border-gold text-gold font-semibold py-2 rounded-lg hover:bg-gold hover:text-matte-black transition text-xs md:text-sm">
            📊 Inventory
          </button>
          <button className="border-2 border-gold text-gold font-semibold py-2 rounded-lg hover:bg-gold hover:text-matte-black transition text-xs md:text-sm">
            💰 Sales
          </button>
          <button className="border-2 border-gold text-gold font-semibold py-2 rounded-lg hover:bg-gold hover:text-matte-black transition text-xs md:text-sm">
            📈 Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
