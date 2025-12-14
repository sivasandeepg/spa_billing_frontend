import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, User, Phone, CreditCard, DollarSign, Gift, CheckCircle, AlertCircle, Loader, Calendar, Mail, MapPin, Users, Percent } from 'lucide-react';
import customerApiService from '../../services/customerApi.js'; // Add this import

const CustomerModal = ({ 
  isCustomerModalOpen, 
  setIsCustomerModalOpen,
  customerForm,
  setCustomerForm,
  handleCustomerSubmit,
  employees = [],
  onCustomerFound,
  selectedServices = [],
  cartTotal = 0,
  onPricingUpdate
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [membershipPricing, setMembershipPricing] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [phoneInput, setPhoneInput] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [lastVerifiedPhone, setLastVerifiedPhone] = useState('');

  const referralSources = [
    { value: 'WALK_IN', label: 'Walk In', points: 1 },
    { value: 'GOOGLE_ADS', label: 'Google Ads', points: 0 },
    { value: 'NEARBY_COUPON', label: 'Nearby Coupon', points: 0 },
    { value: 'FRIEND_REFERRAL', label: 'Friend Referral', points: 2 },
    { value: 'EMPLOYEE_REFERRAL', label: 'Employee Referral', points: 3 },
    { value: 'SOCIAL_MEDIA', label: 'Social Media', points: 0 },
    { value: 'WEBSITE', label: 'Website', points: 0 },
    { value: 'RETURN_CUSTOMER', label: 'Return Customer', points: 2 },
    { value: 'OTHER', label: 'Other', points: 0 }
  ];

  // Calculate final pricing including all discounts and tip
  const calculateFinalPricing = useCallback(() => {
    const originalTotal = cartTotal;
    let discountAmount = 0;
    
    // Apply membership discount first if available
    if (membershipPricing && membershipPricing.discountAmount) {
      discountAmount += membershipPricing.discountAmount;
    }
    
    // Apply manual discount percentage
    if (discountPercent > 0) {
      const manualDiscountAmount = (originalTotal * discountPercent) / 100;
      discountAmount += manualDiscountAmount;
    }
    
    const discountedTotal = Math.max(0, originalTotal - discountAmount);
    const tipValue = parseFloat(tipAmount) || 0;
    const finalTotal = discountedTotal + tipValue;

    const pricing = {
      originalTotal,
      membershipDiscountAmount: membershipPricing?.discountAmount || 0,
      manualDiscountAmount: discountPercent > 0 ? (originalTotal * discountPercent) / 100 : 0,
      totalDiscountAmount: discountAmount,
      discountedTotal,
      tipAmount: tipValue,
      finalTotal,
      discountPercent,
      hasMembershipDiscount: !!membershipPricing,
      hasManualDiscount: discountPercent > 0,
      membershipInfo: selectedMembership
    };

    if (onPricingUpdate) {
      onPricingUpdate(pricing);
    }

    return pricing;
  }, [membershipPricing, tipAmount, discountPercent, cartTotal, selectedMembership, onPricingUpdate]);

  useEffect(() => {
    calculateFinalPricing();
  }, [calculateFinalPricing]);

  // Real API phone verification function
  const verifyPhone = useCallback(async (phone) => {
    if (phone.length !== 10 || phone === lastVerifiedPhone) {
      if (phone.length !== 10) {
        setVerificationStatus(null);
        setCustomerData(null);
        setMemberships([]);
        setSelectedMembership(null);
        setMembershipPricing(null);
      }
      return;
    }

    setIsVerifying(true);
    setLastVerifiedPhone(phone);
    
    try {
      // Use real API to verify customer
      const customerResponse = await customerApiService.verifyCustomerByPhone(phone);
      
      if (customerResponse.customer) {
        // Existing customer found
        const customer = customerResponse.customer;
        setVerificationStatus('existing');
        setCustomerData(customer);
        
        // Get customer memberships
        try {
          const customerMemberships = await customerApiService.getCustomerMemberships(customer.id);
          setMemberships(customerMemberships || []);
          
          // Select the first active membership if available
          const activeMembership = customerMemberships?.find(m => m.status === 'ACTIVE');
          if (activeMembership) {
            setSelectedMembership(activeMembership);
            
            // Calculate membership discount if applicable
            if (selectedServices && selectedServices.length > 0) {
              try {
                const validationResponse = await customerApiService.validateMembershipForTransaction(
                  activeMembership.id, 
                  selectedServices.map(s => s.id)
                );
                
                if (validationResponse.isValid) {
                  const membershipDiscount = validationResponse.discountAmount || 
                    (cartTotal * (activeMembership.discountPercentage || 0)) / 100;
                  
                  setMembershipPricing({
                    originalPrice: cartTotal,
                    finalPrice: cartTotal - membershipDiscount,
                    discountAmount: membershipDiscount
                  });
                }
              } catch (membershipError) {
                console.warn('Failed to validate membership:', membershipError);
                // Still show membership but without discount validation
                const membershipDiscount = (cartTotal * (activeMembership.discountPercentage || 0)) / 100;
                setMembershipPricing({
                  originalPrice: cartTotal,
                  finalPrice: cartTotal - membershipDiscount,
                  discountAmount: membershipDiscount
                });
              }
            }
          }
        } catch (membershipError) {
          console.warn('Failed to fetch customer memberships:', membershipError);
          setMemberships([]);
        }
        
        // Update form with customer data
        setCustomerForm(prev => ({
          ...prev,
          id: customer.id,
          name: customer.name || '',
          phone: customer.phone || phone,
          email: customer.email || ''
        }));

        if (onCustomerFound) {
          onCustomerFound(customer);
        }
      } else {
        // New customer
        setVerificationStatus('new');
        setCustomerData(null);
        setMemberships([]);
        setMembershipPricing(null);
        setSelectedMembership(null);
        
        // Clear form except phone
        setCustomerForm(prev => ({
          ...prev,
          id: null,
          name: '',
          phone: phone,
          email: ''
        }));
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 404) {
        // Customer not found - treat as new customer
        setVerificationStatus('new');
        setCustomerData(null);
        setMemberships([]);
        setMembershipPricing(null);
        setSelectedMembership(null);
        
        setCustomerForm(prev => ({
          ...prev,
          id: null,
          name: '',
          phone: phone,
          email: ''
        }));
      } else {
        // Other errors - show error status
        setVerificationStatus('error');
        setLastVerifiedPhone('');
      }
    } finally {
      setIsVerifying(false);
    }
  }, [cartTotal, onCustomerFound, lastVerifiedPhone, selectedServices]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (phoneInput.length === 10 && phoneInput !== lastVerifiedPhone) {
        verifyPhone(phoneInput);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [phoneInput, verifyPhone, lastVerifiedPhone]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneInput(value);
      setCustomerForm(prev => ({ ...prev, phone: value }));
      
      if (value.length !== 10) {
        setVerificationStatus(null);
        setCustomerData(null);
        setMemberships([]);
        setSelectedMembership(null);
        setMembershipPricing(null);
        setLastVerifiedPhone('');
      }
    }
  };

  const resetForm = () => {
    setVerificationStatus(null);
    setCustomerData(null);
    setMemberships([]);
    setSelectedMembership(null);
    setMembershipPricing(null);
    setTipAmount(0);
    setDiscountPercent(0);
    setPhoneInput('');
    setLastVerifiedPhone('');
    setCustomerForm({
      name: '',
      phone: '',
      email: '',
      employeeId: '',
      referralSource: ''
    });

    if (onPricingUpdate) {
      onPricingUpdate(null);
    }
  };

  useEffect(() => {
    const isValid = phoneInput.length === 10 && 
                   customerForm.name.trim() && 
                   customerForm.employeeId &&
                   (verificationStatus === 'existing' || customerForm.referralSource);
    setIsFormValid(isValid);
  }, [phoneInput, customerForm, verificationStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    const selectedSource = referralSources.find(source => source.value === customerForm.referralSource);
    const points = selectedSource ? selectedSource.points : 0;
    const finalPricing = calculateFinalPricing();
    
    try {
      // Use the real API to add or update customer
      const customerDataForAPI = {
        name: customerForm.name,
        phone: phoneInput,
        email: customerForm.email || null,
        referralSource: customerForm.referralSource || null,
        isExisting: verificationStatus === 'existing',
        serviceDetails: {
          employeeId: customerForm.employeeId,
          serviceIds: selectedServices?.map(s => s.id) || [],
          totalAmount: finalPricing?.finalTotal || cartTotal,
          discountAmount: finalPricing?.totalDiscountAmount || 0,
          tipAmount: parseFloat(tipAmount) || 0,
          membershipId: selectedMembership?.id || null
        }
      };

      const savedCustomer = await customerApiService.addCustomerWithService(customerDataForAPI);
      
      // Prepare data for the main handleCustomerSubmit function
      const customerData = {
        ...customerForm,
        phone: phoneInput,
        points,
        isExisting: verificationStatus === 'existing',
        customerId: savedCustomer.id,
        tipAmount: parseFloat(tipAmount) || 0,
        discountPercent: parseFloat(discountPercent) || 0,
        selectedMembership: selectedMembership,
        membershipDiscount: membershipPricing?.discountAmount || 0,
        finalAmount: finalPricing?.finalTotal || cartTotal,
        pricingBreakdown: finalPricing,
        apiCustomer: savedCustomer // Include the API response
      };
      
      await handleCustomerSubmit(e, customerData);
      resetForm();
    } catch (error) {
      console.error('Error submitting customer:', error);
      alert('Failed to save customer information. Please try again.');
    }
  };

  useEffect(() => {
    if (!isCustomerModalOpen) {
      resetForm();
    }
  }, [isCustomerModalOpen]);

  if (!isCustomerModalOpen) return null;

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
  const currentPricing = calculateFinalPricing();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {verificationStatus === 'existing' ? 'Update Customer Service' : 'Add Customer (Optional)'}
          </h2>
          <button
            onClick={() => {
              setIsCustomerModalOpen(false);
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Customer Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Customer Information</h3>
              
              {/* Phone Number with Verification */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      verificationStatus === 'existing' ? 'border-green-300 focus:ring-green-500' :
                      verificationStatus === 'new' ? 'border-blue-300 focus:ring-blue-500' :
                      verificationStatus === 'error' ? 'border-red-300 focus:ring-red-500' :
                      'border-gray-300 focus:ring-purple-500'
                    }`}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  
                  {isVerifying && <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />}
                  {verificationStatus === 'existing' && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />}
                  {verificationStatus === 'new' && <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />}
                  {verificationStatus === 'error' && <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />}
                </div>
                
                {phoneInput.length > 0 && phoneInput.length < 10 && (
                  <p className="mt-1 text-sm text-gray-500">Enter {10 - phoneInput.length} more digits</p>
                )}
              </div>

              {/* Customer Status */}
              {verificationStatus === 'existing' && customerData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <span className="text-sm font-medium text-green-800">Existing Customer</span>
                        <p className="text-sm text-green-700">
                          {customerData.name} • Visits: {customerData.visitCount || 0} • Spent: ₹{customerData.totalSpent || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {memberships.length > 0 && (
                    <div className="mt-3 p-3 bg-white border border-green-200 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Active Membership</span>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">
                          {memberships[0].discountPercentage || 0}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {memberships[0].membershipType || memberships[0].type} • 
                        Code: {memberships[0].membershipCode || memberships[0].code}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {verificationStatus === 'new' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <span className="text-sm font-medium text-blue-800">New Customer</span>
                      <p className="text-sm text-blue-700">This phone number is not in our system</p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <span className="text-sm font-medium text-red-800">Verification Error</span>
                      <p className="text-sm text-red-700">Unable to verify phone number. Please try again.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter customer name"
                    required
                    disabled={verificationStatus === 'existing'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={verificationStatus === 'existing'}
                  />
                </div>
              </div>

              {/* Service Provider and Referral Row */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Service Provider *
                  </label>
                  <select
                    value={customerForm.employeeId}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select provider...</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.designation || 'Staff'}
                      </option>
                    ))}
                  </select>
                </div>

                {(verificationStatus === 'new' || verificationStatus === null) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you find us? *
                    </label>
                    <select
                      value={customerForm.referralSource}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, referralSource: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required={verificationStatus === 'new'}
                    >
                      <option value="">Select source...</option>
                      {referralSources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label} {source.points > 0 && `(+${source.points} points)`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div> */}
       

{/* Service Provider and Referral Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      <Users className="inline h-4 w-4 mr-1" />
      Service Provider *
    </label>
    <select
      value={customerForm.employeeId}
      onChange={(e) => setCustomerForm(prev => ({ ...prev, employeeId: e.target.value }))}
      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      required
    >
      <option value="">Select provider...</option>
      {employees && employees.length > 0 ? (
        employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} {employee.designation && `- ${employee.designation}`}
          </option>
        ))
      ) : (
        <option value="" disabled>No employees available</option>
      )}
    </select>
    {employees && employees.length === 0 && (
      <p className="mt-1 text-sm text-amber-600">
        No employees found for your branch. Please add employees first.
      </p>
    )}
  </div>

  {(verificationStatus === 'new' || verificationStatus === null) && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        How did you find us? *
      </label>
      <select
        value={customerForm.referralSource}
        onChange={(e) => setCustomerForm(prev => ({ ...prev, referralSource: e.target.value }))}
        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required={verificationStatus === 'new'}
      >
        <option value="">Select source...</option>
        {referralSources.map((source) => (
          <option key={source.value} value={source.value}>
            {source.label} {source.points > 0 && `(+${source.points} points)`}
          </option>
        ))}
      </select>
    </div>
  )}
</div>   


            </div>

            {/* Right Column - Pricing & Adjustments */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing & Adjustments</h3>
              
              {/* Discount and Tip Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Percent className="inline h-4 w-4 mr-1" />
                    Manual Discount %
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <div className="flex space-x-1">
                      {[5, 10, 15].map(percent => (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => setDiscountPercent(percent)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Add Tip
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div className="flex space-x-1">
                      {[50, 100, 200].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setTipAmount(amount)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              {currentPricing && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Original Total:</span>
                      <span>{formatCurrency(currentPricing.originalTotal)}</span>
                    </div>
                    
                    {currentPricing.hasMembershipDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Membership Discount ({memberships[0]?.discountPercentage || 0}%):</span>
                        <span>-{formatCurrency(currentPricing.membershipDiscountAmount)}</span>
                      </div>
                    )}
                    
                    {currentPricing.hasManualDiscount && (
                      <div className="flex justify-between text-orange-600">
                        <span>Manual Discount ({discountPercent}%):</span>
                        <span>-{formatCurrency(currentPricing.manualDiscountAmount)}</span>
                      </div>
                    )}
                    
                    {(currentPricing.hasMembershipDiscount || currentPricing.hasManualDiscount) && (
                      <div className="flex justify-between">
                        <span>Subtotal after discounts:</span>
                        <span>{formatCurrency(currentPricing.discountedTotal)}</span>
                      </div>
                    )}
                    
                    {currentPricing.tipAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Tip:</span>
                        <span>+{formatCurrency(currentPricing.tipAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                      <span>Final Total:</span>
                      <span className="text-purple-600">{formatCurrency(currentPricing.finalTotal)}</span>
                    </div>

                    {(currentPricing.membershipDiscountAmount + currentPricing.manualDiscountAmount) > 0 && (
                      <div className="text-green-600 text-sm">
                        Total Savings: {formatCurrency(currentPricing.membershipDiscountAmount + currentPricing.manualDiscountAmount)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={() => {
                setIsCustomerModalOpen(false);
                resetForm();
              }}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isVerifying}
              className={`px-6 py-3 rounded-lg transition-colors ${
                isFormValid && !isVerifying
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isVerifying ? 'Verifying...' : 
               verificationStatus === 'existing' ? 'Update & Apply' : 'Add Customer & Apply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;  