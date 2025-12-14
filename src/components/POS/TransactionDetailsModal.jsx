import React from 'react';
import { X, Receipt } from 'lucide-react';

const TransactionDetailsModal = ({ 
  isTransactionDetailsOpen, 
  setIsTransactionDetailsOpen,
  selectedTransaction,
  reprintReceipt
}) => {
  if (!isTransactionDetailsOpen || !selectedTransaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction Details - #{selectedTransaction.id.slice(-8)}
          </h2>
          <button
            onClick={() => setIsTransactionDetailsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Transaction ID
              </label>
              <p className="text-lg font-mono">{selectedTransaction.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Date & Time
              </label>
              <p>{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Cashier
              </label>
              <p>{selectedTransaction.cashier}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Payment Method
              </label>
              <p className="capitalize">{selectedTransaction.paymentMethod || 'Cash'}</p>
            </div>
          </div>

          {/* Customer Info */}
          {selectedTransaction.customer && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p>{selectedTransaction.customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </label>
                  <p>{selectedTransaction.customer.phone}</p>
                </div>
                {selectedTransaction.customer.email && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p>{selectedTransaction.customer.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Items Purchased</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedTransaction.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-green-600">
                      ${selectedTransaction.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => reprintReceipt(selectedTransaction)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Reprint Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;  