import React, { useEffect } from 'react';
import { Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/currency';
import { Order } from '../types';

const Orders: React.FC = () => {
  const { state, dispatch } = useApp();

  // Simulate order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      state.orders.forEach(order => {
        if (order.status === 'confirmed') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { id: order.id, status: 'preparing' }
            });
          }, 5000);
        } else if (order.status === 'preparing') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { id: order.id, status: 'ready' }
            });
          }, 10000);
        } else if (order.status === 'ready') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { id: order.id, status: 'out-for-delivery' }
            });
          }, 5000);
        } else if (order.status === 'out-for-delivery') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { id: order.id, status: 'delivered' }
            });
          }, 15000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.orders, dispatch]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
      case 'preparing':
        return <CheckCircle className="h-4 w-4" />;
      case 'ready':
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getEstimatedTime = (order: Order) => {
    const now = new Date();
    const estimated = new Date(order.estimatedDeliveryTime);
    const diffMinutes = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Arriving now';
    if (diffMinutes <= 5) return `${diffMinutes} min`;
    return `${diffMinutes} min`;
  };

  if (state.orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📋</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">When you place an order, you'll be able to track it here.</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200"
          >
            Start Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track your delicious orders in real-time</p>
      </div>

      {/* Active Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Orders</h2>
        <div className="space-y-4">
          {state.orders
            .filter(order => !['delivered', 'cancelled'].includes(order.status))
            .map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900">#{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                      </span>
                    </div>
                    <p className="text-gray-600">{formatCurrency(order.totalAmount)} • {order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">
                      ETA: {getEstimatedTime(order)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Ordered: {order.orderTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-8">
                      {[
                        { key: 'pending', label: 'Placed' },
                        { key: 'confirmed', label: 'Confirmed' },
                        { key: 'preparing', label: 'Preparing' },
                        { key: 'ready', label: 'Ready' },
                        { key: 'out-for-delivery', label: 'Delivering' }
                      ].map((step, index) => {
                        const isActive = order.status === step.key;
                        const isCompleted = ['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'].includes(order.status) && 
                                          ['pending', 'confirmed', 'preparing', 'ready'].includes(step.key) && 
                                          ['confirmed', 'preparing', 'ready', 'out-for-delivery'].indexOf(order.status) >= 
                                          ['pending', 'confirmed', 'preparing', 'ready'].indexOf(step.key);
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full ${
                              isActive ? 'bg-orange-500 animate-pulse' : 
                              isCompleted ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <span className="text-xs mt-1 text-gray-600">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${
                          order.status === 'pending' ? 20 :
                          order.status === 'confirmed' ? 40 :
                          order.status === 'preparing' ? 60 :
                          order.status === 'ready' ? 80 :
                          order.status === 'out-for-delivery' ? 90 : 100
                        }%` 
                      }}
                    />
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                        {item.quantity}× {item.menuItem.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">Delivery Address:</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Contact Info for Active Orders */}
                {['out-for-delivery'].includes(order.status) && (
                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Delivery Partner</span>
                    </div>
                    <p className="text-sm text-green-700">Contact: +91 98765 43210</p>
                    <p className="text-sm text-green-600">Your order is on the way!</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Order History */}
      {state.orders.filter(order => ['delivered', 'cancelled'].includes(order.status)).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
          <div className="space-y-4">
            {state.orders
              .filter(order => ['delivered', 'cancelled'].includes(order.status))
              .map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl font-bold text-gray-900">#{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">{formatCurrency(order.totalAmount)} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {order.orderTime.toLocaleDateString()} at {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}× {item.menuItem.name}</span>
                            <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Address:</h4>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  {order.status === 'delivered' && (
                    <div className="mt-4">
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        ⭐ Rate this order
                      </button>
                      <button className="ml-4 text-orange-600 hover:text-orange-700 text-sm font-medium">
                        🔄 Reorder
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;