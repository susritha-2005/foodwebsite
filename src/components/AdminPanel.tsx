import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/currency';
import { menuService } from '../services/database';

const AdminPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const adminStats = {
    totalOrders: state.orders.length,
    totalRevenue: state.orders.reduce((sum, order) => sum + order.totalAmount, 0),
    activeOrders: state.orders.filter(order => !['delivered', 'cancelled'].includes(order.status)).length,
    totalMenuItems: state.menuItems.length
  };

  const recentOrders = state.orders.slice(0, 10);

  const updateOrderStatus = (orderId: string, newStatus: any) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: orderId, status: newStatus }
    });
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your restaurant operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'orders', label: 'Orders' },
            { key: 'menu', label: 'Menu Management' },
            { key: 'analytics', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Orders"
              value={adminStats.totalOrders}
              icon={<ShoppingBag className="h-6 w-6 text-white" />}
              color="bg-blue-500"
              change="+12% from last week"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(adminStats.totalRevenue)}
              icon={<DollarSign className="h-6 w-6 text-white" />}
              color="bg-green-500"
              change="+8% from last week"
            />
            <StatCard
              title="Active Orders"
              value={adminStats.activeOrders}
              icon={<Clock className="h-6 w-6 text-white" />}
              color="bg-orange-500"
            />
            <StatCard
              title="Menu Items"
              value={adminStats.totalMenuItems}
              icon={<Package className="h-6 w-6 text-white" />}
              color="bg-purple-500"
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          Customer {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4">{order.items.length} items</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Management</h3>
            <div className="space-y-4">
              {state.orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-lg">#{order.id}</span>
                        <span className="text-gray-600">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.orderTime.toLocaleString()} • {order.items.length} items
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Menu Management</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.menuItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${
                          item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-600">
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <p className="text-orange-600 font-bold mb-2">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-600 mb-2">{item.description.substring(0, 60)}...</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {item.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
                      </span>
                      <span className="text-xs text-gray-500">
                        🌶️ {item.spiceLevel}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⏱️ {item.preparationTime}min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Items</h3>
              <div className="space-y-3">
                {state.menuItems.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-orange-600">#{index + 1}</span>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{Math.floor(Math.random() * 50) + 10} orders</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
              <div className="space-y-3">
                {[
                  { status: 'delivered', count: state.orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
                  { status: 'preparing', count: state.orders.filter(o => o.status === 'preparing').length, color: 'bg-orange-500' },
                  { status: 'confirmed', count: state.orders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-500' },
                  { status: 'pending', count: state.orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' }
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`} />
                      <span className="text-gray-900 capitalize">{item.status}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.count} orders</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;