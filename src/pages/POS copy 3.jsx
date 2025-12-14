import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { History } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import all refactored POS sub-components
import ServicesGrid from '../components/POS/ServicesGrid.jsx';
import Cart from '../components/POS/Cart.jsx';
import CustomerModal from '../components/POS/CustomerModal.jsx';
import TransactionHistoryModal from '../components/POS/TransactionHistoryModal.jsx';
import TransactionDetailsModal from '../components/POS/TransactionDetailsModal.jsx';
import ReceiptModal from '../components/POS/ReceiptModal.jsx';

const POS = () => {
  const { user } = useAuth();
  const { 
    combos, 
    services, // Get services directly from DataContext instead of local state
    addTransaction, 
    addCustomer, 
    branches, 
    transactions 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFilter, setItemFilter] = useState('all'); // Add this missing state
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '', phone: '', email: ''
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('today');
  const [historySearch, setHistorySearch] = useState('');

  const availableItems = useMemo(() => {
    // Filter services based on user's branch and search term
    const availableServices = services.filter(service => {
      // Check if service belongs to current user's branch
      const belongsToUserBranch = user?.role === 'admin' || 
        (service.branchId === user?.branchId) ||
        (service.branchIds && service.branchIds.includes(user?.branchId));
      
      // Check if service matches search term
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return belongsToUserBranch && matchesSearch;
    }).map(service => ({ 
      ...service, 
      isService: true, 
      finalPrice: service.price 
    }));

    // Filter combos based on user's branch, stock availability, and search term
    const availableCombos = combos.filter(combo => {
      // Check if combo belongs to current user's branch
      const belongsToUserBranch = user?.role === 'admin' || 
        (combo.branchId === user?.branchId) ||
        (combo.branchIds && combo.branchIds.includes(user?.branchId));
      
      // Check if combo has stock (if stock property exists)
      const hasStock = !combo.hasOwnProperty('stock') || combo.stock > 0;
      
      // Check if combo is active
      const isActive = combo.status === 'ACTIVE';
      
      // Check if combo matches search term
      const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (combo.description && combo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return belongsToUserBranch && hasStock && isActive && matchesSearch;
    }).map(combo => ({ 
      ...combo, 
      isCombo: true,
      finalPrice: combo.discountPrice || combo.finalPrice || combo.price
    }));

    // Combine all items
    const allItems = [...availableServices, ...availableCombos];

    // Apply item filter
    if (itemFilter === 'services') {
      return allItems.filter(item => item.isService);
    } else if (itemFilter === 'combos') {
      return allItems.filter(item => item.isCombo);
    }
    
    return allItems; // Return all items if filter is 'all'
  }, [services, combos, searchTerm, itemFilter, user?.branchId, user?.role]);

  const branchTransactions = useMemo(() => {
    let filtered = transactions.filter(t => t.branchId === user?.branchId);
    
    const now = new Date();
    if (historyFilter === 'today') {
      filtered = filtered.filter(t => new Date(t.timestamp).toDateString() === now.toDateString());
    } else if (historyFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.timestamp) >= weekAgo);
    } else if (historyFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.timestamp) >= monthAgo);
    }
    
    if (historySearch) {
      filtered = filtered.filter(t => 
        t.id.includes(historySearch) ||
        (t.customer?.name && t.customer.name.toLowerCase().includes(historySearch.toLowerCase())) ||
        (t.customer?.phone && t.customer.phone.includes(historySearch))
      );
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, user?.branchId, historyFilter, historySearch]);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const addToCart = (itemToAdd) => {
    const existingItem = cart.find(item => item.id === itemToAdd.id && item.isCombo === itemToAdd.isCombo);
    
    if (existingItem) {
      // Check stock for combos
      if (itemToAdd.isCombo && itemToAdd.hasOwnProperty('stock') && existingItem.quantity >= itemToAdd.stock) {
        alert('Insufficient stock!');
        return;
      }
      setCart(cart.map(item => 
        (item.id === itemToAdd.id && item.isCombo === itemToAdd.isCombo) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...itemToAdd, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    try {
      console.log('POS: Updating quantity for itemId:', itemId, 'to:', newQuantity);
      
      if (newQuantity === 0) {
        removeFromCart(itemId);
      } else {
        // Find the item in available items to check stock
        const itemToUpdate = availableItems.find(item => item.id === itemId);
        
        if (itemToUpdate && itemToUpdate.isCombo && itemToUpdate.hasOwnProperty('stock') && newQuantity > itemToUpdate.stock) {
          alert('Insufficient stock!');
          return;
        }
        
        setCart(prevCart => {
          return prevCart.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const removeFromCart = (itemId) => {
    try {
      console.log('POS: Removing item with id:', itemId);
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item. Please try again.');
    }
  };

  const clearCart = () => { setCart([]); };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    const newCustomer = await addCustomer(customerForm);
    if (newCustomer) {
      setCustomer(newCustomer);
      setIsCustomerModalOpen(false);
      setCustomerForm({ name: '', phone: '', email: '' });
    } else {
      alert('Failed to add customer. Please try again.');
    }
  };

  const processPayment = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    const transaction = {
      branchId: user.branchId,
      items: cart.map(item => ({
        serviceId: item.isService ? item.id : null,
        comboId: item.isCombo ? item.id : null,
        name: item.name,
        price: item.finalPrice,
        quantity: item.quantity
      })),
      total: cartTotal,
      customerId: customer?.id,
      cashier: user.name,
      paymentMethod: 'cash'
    };

    const savedTransaction = await addTransaction(transaction);
    if (savedTransaction) {
      setLastTransaction(savedTransaction);
      setShowReceipt(true);
      clearCart();
      setCustomer(null);
    } else {
      alert('Failed to process payment. Please try again.');
    }
  };

  const printReceipt = async () => {
    const receiptElement = document.getElementById('receipt');
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement, { width: 300, height: receiptElement.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 120] });
      pdf.addImage(imgData, 'PNG', 0, 0, 80, 120);
      pdf.save(`receipt-${lastTransaction?.id}.pdf`);
    }
  };

  const sendWhatsApp = () => {
    if (!customer?.phone || !lastTransaction) return;
    const message = `Receipt from ${branches.find(b => b.id === user?.branchId)?.name}\n\nTransaction: #${lastTransaction.id}\nTotal: $${lastTransaction.total.toFixed(2)}\nThank you for your purchase!`;
    const url = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsOpen(true);
  };

  const reprintReceipt = (transaction) => {
    setLastTransaction(transaction);
    setShowReceipt(true);
  };

  const downloadTransactionReport = () => {
    const reportData = branchTransactions.map(t => ({
      'Transaction ID': t.id,
      'Date': new Date(t.timestamp).toLocaleString(),
      'Customer': t.customer?.name || 'Walk-in Customer',
      'Phone': t.customer?.phone || '',
      'Items': t.items.map(item => `${item.name} x${item.quantity}`).join(', '),
      'Total': `$${t.total.toFixed(2)}`,
      'Cashier': t.cashier,
      'Payment Method': t.paymentMethod || 'Cash'
    }));
    const headers = Object.keys(reportData[0] || {});
    const csvContent = [ headers.join(','), ...reportData.map(row => headers.map(header => {
      const value = row[header] || '';
      return `"${value.toString().replace(/"/g, '""')}"`;
    }).join(',')) ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const branch = branches.find(b => b.id === user?.branchId);

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-0">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Transaction History Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
            <p className="text-gray-600">{branch?.name}</p>
          </div>
          <button
            onClick={() => setIsTransactionHistoryOpen(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors"
          >
            <History className="h-4 w-4 mr-2" />
            Transaction History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Section */}                
          <ServicesGrid
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  itemFilter={itemFilter}
  setItemFilter={setItemFilter}
  availableItems={availableItems}
  addToCart={addToCart}
/>

          {/* Cart Section */}
          <Cart
            cart={cart}
            cartItemCount={cartItemCount}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            customer={customer}
            setCustomer={setCustomer}
            setIsCustomerModalOpen={setIsCustomerModalOpen}
            processPayment={processPayment}
          />
        </div>

        {/* All Modals */}
        <CustomerModal
          isCustomerModalOpen={isCustomerModalOpen}
          setIsCustomerModalOpen={setIsCustomerModalOpen}
          customerForm={customerForm}
          setCustomerForm={setCustomerForm}
          handleCustomerSubmit={handleCustomerSubmit}
        />

        <TransactionHistoryModal
          isTransactionHistoryOpen={isTransactionHistoryOpen}
          setIsTransactionHistoryOpen={setIsTransactionHistoryOpen}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          historySearch={historySearch}
          setHistorySearch={setHistorySearch}
          branchTransactions={branchTransactions}
          downloadTransactionReport={downloadTransactionReport}
          viewTransactionDetails={viewTransactionDetails}
          reprintReceipt={reprintReceipt}
        />

        <TransactionDetailsModal
          isTransactionDetailsOpen={isTransactionDetailsOpen}
          setIsTransactionDetailsOpen={setIsTransactionDetailsOpen}
          selectedTransaction={selectedTransaction}
          reprintReceipt={reprintReceipt}
        />

        <ReceiptModal
          showReceipt={showReceipt}
          setShowReceipt={setShowReceipt}
          selectedTransaction={selectedTransaction}
          lastTransaction={lastTransaction}
          customer={customer}
          branch={branch}
          printReceipt={printReceipt}
          sendWhatsApp={sendWhatsApp}
        />
      </div>
    </div>
  );
};

export default POS;  