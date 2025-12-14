import React from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  User,
  CreditCard,
  X
} from 'lucide-react';

const Cart = ({ 
  cart, 
  cartItemCount, 
  cartTotal,
  updateQuantity, 
  removeFromCart, 
  clearCart,
  customer,
  setCustomer,
  setIsCustomerModalOpen,
  processPayment
}) => {
  const handleUpdateQuantity = (item, newQuantity) => {
    try {
      console.log('Cart: Updating quantity for item:', item, 'to:', newQuantity);
      updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Cart: Error updating quantity:', error);
    }
  };

  const handleRemoveFromCart = (item) => {
    try {
      console.log('Cart: Removing item:', item);
      removeFromCart(item.id);
    } catch (error) {
      console.error('Cart: Error removing item:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({cartItemCount})
          </h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Cart is empty</p>
            <p className="text-sm">Add items to start</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
            {cart.map((item, index) => {
              if (!item || !item.id) {
                console.error('Invalid cart item:', item);
                return null;
              }

              const itemKey = `${item.id}-${item.isCombo ? 'combo' : item.isService ? 'service' : 'item'}-${index}`;
              const finalPrice = item.finalPrice || item.discountPrice || item.price || 0;

              return (
                <div key={itemKey} className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.isCombo 
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap">
                      <h4 className={`font-medium truncate ${item.isCombo ? 'text-purple-900' : 'text-gray-900'}`}>
                        {item.name || 'Unnamed Item'}
                      </h4>
                      {item.isCombo && (
                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full flex-shrink-0">
                          COMBO
                        </span>
                      )}
                      {item.isService && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full flex-shrink-0">
                          SERVICE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">₹{finalPrice.toFixed(2)} each</p>
                    
                    {/* Show combo services if available */}
                    {item.isCombo && item.services && Array.isArray(item.services) && item.services.length > 0 && (
                      <p className="text-xs text-purple-600 mt-1 truncate">
                        Includes: {item.services.map(service => 
                          service?.service?.name || service?.name || 'Service'
                        ).join(', ')}
                      </p>
                    )}
                    
                    {/* Fallback for products if services not available */}
                    {item.isCombo && item.products && Array.isArray(item.products) && item.products.length > 0 && (
                      <p className="text-xs text-purple-600 mt-1 truncate">
                        Includes: {item.products.map(product => 
                          product?.name || 'Product'
                        ).join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            }).filter(Boolean)} {/* Remove null items */}
          </div>
        )}

        {/* Customer Section */}
        <div className="border-t pt-4 mb-4">
          {customer ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-900">{customer.name}</p>
                  <p className="text-sm text-green-700">{customer.phone}</p>
                  {customer.email && <p className="text-sm text-green-700">{customer.email}</p>}
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-3"
            >
              <User className="h-4 w-4 mr-2" />
              Add Customer (Optional)
            </button>
          )}
        </div>

        {/* Total and Checkout */}
        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={processPayment}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Process Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 