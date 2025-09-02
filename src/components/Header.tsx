import React from 'react';
import { ShoppingCart, User, Menu as MenuIcon, Bell, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateTotal } from '../utils/currency';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const cartTotal = calculateTotal(state.cart);
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleViewChange = (view: string) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  return (
    <header className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleViewChange('home')}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-2 mr-3">
              <MenuIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Spice Route
              </h1>
              <p className="text-xs text-gray-500">Authentic Indian Cuisine</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleViewChange('home')}
              className={`text-sm font-medium transition-colors ${
                state.currentView === 'home'
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleViewChange('orders')}
              className={`text-sm font-medium transition-colors ${
                state.currentView === 'orders'
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => handleViewChange('chatbot')}
              className={`text-sm font-medium transition-colors ${
                state.currentView === 'chatbot'
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              AI Chef
            </button>
            {state.user?.role === 'admin' && (
              <button
                onClick={() => handleViewChange('admin')}
                className={`text-sm font-medium transition-colors ${
                  state.currentView === 'admin'
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              {state.orders.filter(order => ['confirmed', 'preparing', 'ready'].includes(order.status)).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.orders.filter(order => ['confirmed', 'preparing', 'ready'].includes(order.status)).length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => handleViewChange('cart')}
              className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User */}
            <button
              onClick={() => handleViewChange('profile')}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:block text-sm font-medium">
                {state.user ? state.user.name.split(' ')[0] : 'Guest'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="flex justify-around py-2">
          <button
            onClick={() => handleViewChange('home')}
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              state.currentView === 'home' ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            <MenuIcon className="h-5 w-5 mb-1" />
            Menu
          </button>
          <button
            onClick={() => handleViewChange('orders')}
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              state.currentView === 'orders' ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            <Bell className="h-5 w-5 mb-1" />
            Orders
          </button>
          <button
            onClick={() => handleViewChange('chatbot')}
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              state.currentView === 'chatbot' ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            AI Chef
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;