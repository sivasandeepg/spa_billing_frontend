import React from 'react';
import { X, Receipt as ReceiptIcon, MessageSquare } from 'lucide-react';
import Receipt from './Receipt';

const ReceiptModal = ({ 
  showReceipt, 
  setShowReceipt,
  selectedTransaction,
  lastTransaction,
  customer,
  branch,
  printReceipt,
  sendWhatsApp
}) => {
  if (!showReceipt || !lastTransaction) return null;

  // Determine the modal type explicitly
  const modalType = selectedTransaction ? 'reprint' : 'new';
  const transactionToDisplay = selectedTransaction || lastTransaction;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {modalType === 'reprint' ? 'Reprint Receipt' : 'Transaction Complete'}
          </h2>
          <button
            onClick={() => setShowReceipt(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Pass the explicitly determined transaction and type */}
          <Receipt 
            transaction={transactionToDisplay} 
            branch={branch} 
            type={modalType} 
          />

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={printReceipt}
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
            
            {customer?.phone && (
              <button
                onClick={sendWhatsApp}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal; 