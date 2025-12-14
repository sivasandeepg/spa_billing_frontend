import React from 'react';
import { Briefcase, Package, Search, Filter, Layers, Zap } from 'lucide-react';
  
const ServicesGrid = ({ 
  searchTerm, 
  setSearchTerm, 
  itemFilter,
  setItemFilter,
  availableItems, 
  addToCart 
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Items', icon: Layers, count: availableItems.length },
    { value: 'services', label: 'Services', icon: Briefcase, count: availableItems.filter(item => item.isService).length },
    { value: 'combos', label: 'Combos', icon: Zap, count: availableItems.filter(item => item.isCombo).length }
  ];

  const handleAddToCart = (item) => {
    try {
      console.log('ServicesGrid: Adding item to cart:', item);
      addToCart(item);
    } catch (error) {
      console.error('ServicesGrid: Error adding to cart:', error);
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Items</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setItemFilter(option.value)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                    itemFilter === option.value
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${  
                    itemFilter === option.value
                      ? 'bg-purple-200 text-purple-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {availableItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="mb-4">
                  {itemFilter === 'services' ? (
                    <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
                  ) : itemFilter === 'combos' ? (
                    <Zap className="h-12 w-12 mx-auto text-gray-400" />
                  ) : (
                    <Package className="h-12 w-12 mx-auto text-gray-400" />
                  )}
                </div>
                <p className="text-lg font-medium mb-2">
                  {itemFilter === 'all' 
                    ? 'No items found' 
                    : `No ${itemFilter} found`}
                </p>
                <p className="text-sm">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters'
                    : 'No items available for this branch'
                  }
                </p>
              </div>
            ) : (
              availableItems.map((item) => (
                <ItemCard 
                  key={`${item.id}-${item.type || (item.isCombo ? 'combo' : 'service')}`}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate ItemCard component to avoid re-rendering issues
const ItemCard = ({ item, onAddToCart }) => {
  const handleClick = () => {
    try {
      console.log('ItemCard: Handling click for item:', item);
      onAddToCart(item);
    } catch (error) {
      console.error('ItemCard: Error in handleClick:', error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group ${
        item.isCombo 
          ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="mb-3 relative">
        {item.isCombo && (
          <div className="absolute -top-2 -right-2">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
              COMBO
            </span>
          </div>
        )}
        {item.isService && (
          <div className="absolute -top-2 -right-2">
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
              SERVICE
            </span>
          </div>
        )}
        
        <h4 className={`font-medium group-hover:text-purple-600 transition-colors ${
          item.isCombo ? 'text-purple-900' : 'text-gray-900'
        }`}>
          {item.name}
        </h4>
        <p className="text-sm text-gray-500 line-clamp-2">
          {item.description || 'No description available'}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${
            item.isCombo ? 'text-purple-600' : 'text-gray-900'
          }`}>
            ₹{item.finalPrice?.toFixed(2) || '0.00'}
          </span>
          {item.isCombo && item.totalPrice && item.totalPrice > item.finalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ${item.totalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {item.isCombo && item.discountPercentage > 0 && (
          <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
            {item.discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Show combo services if available */}
      {item.isCombo && item.services && item.services.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Includes:</p>
          <div className="flex flex-wrap gap-1">
            {item.services.slice(0, 2).map((service, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {service.service?.name || `Service ${index + 1}`}
              </span>
            ))}
            {item.services.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{item.services.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Stock indicator for combos */}
      {item.isCombo && item.hasOwnProperty('stock') && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <span className={`text-xs ${
            item.stock > 10 ? 'text-green-600' : 
            item.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServicesGrid; 