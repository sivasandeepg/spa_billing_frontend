import React from 'react';
import { 
  X,
  Search,
  Calendar,
  Download,
  Eye,
  Receipt,
  FileText
} from 'lucide-react';

const TransactionHistoryModal = ({ 
  isTransactionHistoryOpen, 
  setIsTransactionHistoryOpen,
  historyFilter,
  setHistoryFilter,
  historySearch,
  setHistorySearch,
  branchTransactions,
  downloadTransactionReport,
  viewTransactionDetails,
  reprintReceipt
}) => {
  if (!isTransactionHistoryOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <button
            onClick={() => setIsTransactionHistoryOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, customer name, or phone..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <button
              onClick={downloadTransactionReport}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {branchTransactions.length} transaction(s) found
          </div>
        </div>

        {/* Transaction List */}
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {branchTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    #{transaction.id.slice(-8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>
                      <div className="font-medium">
                        {transaction.customer?.name || 'Walk-in Customer'}
                      </div>
                      {transaction.customer?.phone && (
                        <div className="text-xs text-gray-500">
                          {transaction.customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="space-y-1">
                      {transaction.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs">
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                      {transaction.items?.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{transaction.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    ${transaction.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => viewTransactionDetails(transaction)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => reprintReceipt(transaction)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Reprint Receipt"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {branchTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;  