import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || ''
  });

  const handleLogin = () => {
    // Simple mock login - in real app this would be proper authentication
    const mockUser = {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: '123 MG Road, Bengaluru, Karnataka 560001',
      role: 'customer' as const
    };
    
    dispatch({ type: 'SET_USER', payload: mockUser });
  };

  const handleAdminLogin = () => {
    const mockAdmin = {
      id: '2',
      name: 'Admin User',
      email: 'admin@spiceroute.com',
      phone: '+91 98765 00000',
      address: 'Spice Route Restaurant, Bengaluru',
      role: 'admin' as const
    };
    
    dispatch({ type: 'SET_USER', payload: mockAdmin });
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_VIEW', payload: 'home' });
  };

  const handleSave = () => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        ...formData
      };
      dispatch({ type: 'SET_USER', payload: updatedUser });
      setIsEditing(false);
    }
  };

  if (!state.user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Spice Route</h2>
          <p className="text-gray-600">Sign in to access your account and place orders</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200"
          >
            Login as Customer
          </button>
          
          <button
            onClick={handleAdminLogin}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 transition-all duration-200"
          >
            Login as Admin
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <button className="text-orange-600 hover:text-orange-700 font-medium ml-1">
                Sign up here
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-xl">
          <h3 className="font-medium text-orange-800 mb-2">Demo Accounts:</h3>
          <div className="text-sm text-orange-700 space-y-1">
            <p>• <strong>Customer:</strong> Browse menu, place orders, chat with AI</p>
            <p>• <strong>Admin:</strong> Manage orders, view analytics, menu management</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{state.user.name}</h3>
            <p className="text-gray-600 mb-2">{state.user.email}</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              state.user.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {state.user.role === 'admin' ? '👑 Administrator' : '🍽️ Food Lover'}
            </span>
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-bold text-gray-900 mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">{state.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorite Cuisine:</span>
                <span className="font-medium">Indian</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Settings className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{state.user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{state.user.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{state.user.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{state.user.address || 'Not provided'}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                🔔 Notification Preferences
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                🔒 Change Password
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                📱 Connected Devices
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;