import React from 'react';
import { 
  Search, 
  Scan,
  Package
} from 'lucide-react';

const ProductGrid = ({ 
  searchTerm, 
  setSearchTerm, 
  availableItems, 
  addToCart 
}) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {availableItems.map((item) => (
              <div
                key={`${item.id}-${item.isCombo ? 'combo' : 'product'}`}
                onClick={() => addToCart(item)}
                className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group ${
                  item.isCombo 
                    ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {/* Product Image */}
                {!item.isCombo && (
                  <div className="mb-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="h-16 w-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="h-16 w-full bg-gray-100 rounded-lg border border-gray-200 items-center justify-center hidden">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                )}
                
                <div className="mb-3 relative">
                  {item.isCombo && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        COMBO
                      </span>
                    </div>
                  )}
                  <h4 className={`font-medium group-hover:text-purple-600 transition-colors ${
                    item.isCombo ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h4>
                  {!item.isCombo && item.brand && (
                    <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
                  )}
                  {item.isCombo ? (
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        {item.products.length} products • Save {item.savingsPercent}%
                      </p>
                      <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    {item.offerPrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          ${item.finalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${item.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className={`text-lg font-bold ${
                        item.isCombo ? 'text-purple-600' : 'text-gray-900'
                      }`}>
                        ${item.finalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {item.discountPercent > 0 && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.isCombo 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.discountPercent}% OFF
                    </span>
                  )}
                </div>
                {item.isCombo && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Individual total: 
                      <span className="line-through ml-1">${item.totalOriginalPrice.toFixed(2)}</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.products.map(product => (
                        <span key={product.id} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {availableItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Scan className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;  
 