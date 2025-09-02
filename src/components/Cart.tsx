import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, calculateTotal } from '../utils/currency';
import { Order } from '../types';
import { orderService } from '../services/database';

const Cart: React.FC = () => {
  const { state, dispatch } = useApp();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  const total = calculateTotal(state.cart);
  const deliveryFee = total > 500 ? 0 : 40;
  const tax = Math.round(total * 0.05); // 5% tax
  const grandTotal = total + deliveryFee + tax;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: itemId, quantity: newQuantity }
      });
    }
  };

  const handleCheckout = () => {
    if (!state.user) {
      alert('Please login to place an order');
      dispatch({ type: 'SET_VIEW', payload: 'profile' });
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: state.user.id,
      items: [...state.cart],
      totalAmount: grandTotal,
      status: 'pending',
      orderTime: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
      deliveryAddress,
      paymentStatus: 'pending',
      paymentMethod
    };

    // Save order to database
    const saveOrder = async () => {
      const savedOrder = await orderService.createOrder(newOrder);
      if (savedOrder) {
        dispatch({ type: 'ADD_ORDER', payload: savedOrder });
        dispatch({ type: 'CLEAR_CART' });
        dispatch({ type: 'SET_VIEW', payload: 'orders' });

        // Simulate order processing
        setTimeout(async () => {
          await orderService.updateOrderStatus(savedOrder.id, 'confirmed');
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { id: savedOrder.id, status: 'confirmed' }
          });
        }, 2000);
      } else {
        alert('Failed to place order. Please try again.');
      }
    };

    saveOrder();
  };

  if (state.cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items from our menu to get started.</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!showCheckout ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-gray-600">{state.cart.length} items in your cart</p>
              </div>
            </div>
            <ShoppingBag className="h-8 w-8 text-orange-600" />
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {state.cart.map((item, index) => (
              <div key={item.menuItem.id}>
                <div className="flex items-center space-x-4 p-6">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.menuItem.name}</h3>
                    <p className="text-gray-600 text-sm">{item.menuItem.description.substring(0, 60)}...</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-orange-600 font-bold">{formatCurrency(item.menuItem.price)}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(item.menuItem.price * item.quantity)}
                    </div>
                  </div>
                </div>
                {index < state.cart.length - 1 && <hr className="mx-6" />}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            {total < 500 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-700 text-sm">
                  💡 Add {formatCurrency(500 - total)} more to get free delivery!
                </p>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-medium text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
          >
            Proceed to Checkout
          </button>
        </>
      ) : (
        <>
          {/* Checkout Form */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setShowCheckout(false)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Delivery Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>
                </div>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-600"
                    />
                    <span>Online Payment (Razorpay/UPI)</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {state.cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between text-sm">
                    <span>{item.menuItem.name} × {item.quantity}</span>
                    <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="mb-4" />
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-orange-600">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!deliveryAddress.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-medium text-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;