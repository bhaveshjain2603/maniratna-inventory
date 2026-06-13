import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { formatWeight, formatDate } from '../utils/formatters';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchTransactions();
  }, [actionFilter, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions', {
        params: {
          statusType: actionFilter,
          startDate: dateRange.start,
          endDate: dateRange.end,
          limit: 100,
        },
      });
      setTransactions(response.data.transactions || []);
      console.log(response.data.transactions);  
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusTypes = ['In Stock', 'Sold', 'Returned'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      case 'Returned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black">🔄 Transactions</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            Action Type
          </label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
          >
            <option value="">All Actions</option>
            {statusTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            From Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            To Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
          />
        </div>
      </div>

      <p className="text-xs md:text-lg text-gray-600">
        📊 Total: {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </p>

      {/* Transactions Table - Desktop */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-8 text-center text-sm md:text-base">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-xs md:text-sm text-gray-600">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-matte-black text-white">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Date & Time</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Product Code</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Category</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Gross Wt.</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Stone Wt.</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Tag Wt.</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Net Wt.</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Status</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">Reason</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm hidden md:table-cell">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((trans) => (

                  <tr key={trans._id} className="hover:bg-gray-50">

                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatDate(trans.createdAt)}
                    </td>

                    <td className="px-3 md:px-6 py-2 md:py-4 font-semibold text-gold text-xs md:text-sm">
                      {trans.productCode}
                    </td>

                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {trans.category}
                    </td>

                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(trans.weight?.gross)}
                    </td>
                      
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(trans.weight?.stone)}
                    </td>

                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(trans.weight?.tag)}
                    </td>

                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(trans.weight?.net)}
                    </td>
                      
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {trans.statusType}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {trans.reason}
                    </td>
                      
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {trans.user?.name}
                    </td>
                      
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transactions Cards - Mobile */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {loading ? (
          <div className="p-8 text-center text-sm">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-600">No transactions found</div>
        ) : (
          transactions.map((trans) => (
            <div key={trans._id} className="bg-white rounded-lg shadow p-3 border-l-4 border-gold">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500">
                    {formatDate(trans.createdAt)}
                  </p>
                  <p className="text-sm font-bold text-gold mt-1">{trans.productCode}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trans.statusType)}`}>
                  {trans.statusType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <p className="text-gray-600">Gross Wt.: {formatWeight(trans.weight?.gross)}</p>
                  <p className="text-gray-600">Stone Wt.: {formatWeight(trans.weight?.stone)}</p>
                  <p className="text-gray-600">Tag Wt.: {formatWeight(trans.weight?.tag)}</p>
                  <p className="text-gray-600">Net Wt.: {formatWeight(trans.weight?.net)}</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    Category: {trans.category || '-'}
                  </p>

                  <p className="text-gray-600">
                    Reason: {trans.reason || '-'}
                  </p>

                  <p className="text-gray-600">
                    User: {trans.user?.name}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TransactionsPage;
