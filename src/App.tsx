import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import Orders from './components/Orders';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import Profile from './components/Profile';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'home':
        return <MenuGrid />;
      case 'cart':
        return <Cart />;
      case 'orders':
        return <Orders />;
      case 'chatbot':
        return <ChatBot />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <Profile />;
      default:
        return <MenuGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-2">
                  <span className="text-white font-bold text-xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Spice Route</h3>
                  <p className="text-gray-400">Authentic Indian Cuisine</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Experience the rich heritage of Indian cuisine with our carefully crafted dishes, 
                made with traditional spices and the finest ingredients.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl">🌟</span>
                <span className="text-2xl">🔥</span>
                <span className="text-2xl">🌶️</span>
                <span className="text-2xl">🥘</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Menu</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📍 123 MG Road, Bengaluru</p>
                <p>📞 +91 98765 43210</p>
                <p>✉️ hello@spiceroute.com</p>
                <p>🕒 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Spice Route. All rights reserved. Made with ❤️ for food lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;