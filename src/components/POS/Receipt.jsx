import React from 'react';

const Receipt = ({ transaction, branch, type = 'new' }) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (!transaction) return null;

  return (
    <div id="receipt" className="bg-white p-8 text-black border-none" style={{
      fontFamily: 'monospace, Courier, "Courier New"',
      width: '300px',
      margin: '0 auto',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000000',
      backgroundColor: '#ffffff'
    }}>
      {/* Header Section */}
      <div className="text-center mb-6" style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h3 className="font-bold text-2xl mb-2" style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {branch?.name || 'POS SYSTEM'}
        </h3>
        <p className="text-xs mb-1" style={{ fontSize: '10px', margin: '2px 0' }}>
          {branch?.address || 'N/A'}
        </p>
        <p className="text-xs" style={{ fontSize: '10px', margin: '2px 0' }}>
          {branch?.phone || 'N/A'}
        </p>
      </div>

      {/* Transaction Info */}
      <div className="mb-4" style={{ 
        borderTop: '1px dashed #000', 
        borderBottom: '1px dashed #000',
        padding: '8px 0',
        margin: '12px 0'
      }}>
        <div className="flex justify-between text-xs mb-1" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '11px',
          margin: '4px 0'
        }}>
          <span style={{ fontWeight: 'bold' }}>
            {type === 'reprint' ? 'REPRINT' : 'RECEIPT'}: #{transaction.id.slice(-6)}
          </span>
        </div>
        <div className="text-xs mb-1" style={{ fontSize: '10px', margin: '2px 0' }}>
          Date: {new Date(transaction.timestamp).toLocaleDateString()}
        </div>
        <div className="text-xs mb-1" style={{ fontSize: '10px', margin: '2px 0' }}>
          Time: {new Date(transaction.timestamp).toLocaleTimeString()}
        </div>
        <div className="text-xs mb-1" style={{ fontSize: '10px', margin: '2px 0' }}>
          Cashier: {transaction.cashier}
        </div>
        {transaction.customer && (
          <div className="text-xs" style={{ fontSize: '10px', margin: '2px 0' }}>
            Customer: {transaction.customer.name}
          </div>
        )}
      </div>

      {/* Items Section */}
      <div className="mb-4">
        <div style={{ 
          borderBottom: '1px solid #000', 
          paddingBottom: '4px', 
          marginBottom: '8px',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          ITEMS PURCHASED
        </div>
        <div className="space-y-2">
          {transaction.items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '11px',
                margin: '4px 0'
              }}>
                <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              </div>
              <div className="flex justify-between" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '10px',
                paddingLeft: '4px'
              }}>
                <span>{item.quantity} x {currencyFormatter.format(item.price)}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {currencyFormatter.format(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div style={{ 
        borderTop: '2px solid #000', 
        paddingTop: '8px',
        marginTop: '12px'
      }}>
        <div className="flex justify-between font-bold text-lg" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 'bold',
          margin: '8px 0'
        }}>
          <span>TOTAL:</span>
          <span>{currencyFormatter.format(transaction.total)}</span>
        </div>
      </div>

      {/* Payment Info */}
      {transaction.paymentMethod && (
        <div className="mt-3" style={{ 
          borderTop: '1px dashed #000',
          paddingTop: '6px',
          marginTop: '10px',
          fontSize: '10px'
        }}>
          <div>Payment Method: {transaction.paymentMethod}</div>
          {transaction.change && transaction.change > 0 && (
            <div>Change: {currencyFormatter.format(transaction.change)}</div>
          )}
        </div>
      )}

      {/* Footer Section */}
      <div className="text-center mt-6" style={{ 
        textAlign: 'center',
        marginTop: '20px',
        paddingTop: '10px',
        borderTop: '1px dashed #000',
        fontSize: '10px'
      }}>
        <p style={{ margin: '4px 0' }}>
          {branch?.receiptFooter || 'Thank you for your business!'}
        </p>
        <p style={{ margin: '4px 0' }}>
          Please retain this receipt for your records
        </p>
        <div style={{ 
          marginTop: '15px',
          fontSize: '8px',
          textAlign: 'center'
        }}>
          ════════════════════════════════
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          #receipt {
            width: 80mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            font-size: 12px !important;
            color: #000 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt; 