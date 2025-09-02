import React, { useState } from 'react';
import { Plus, Minus, Clock, Flame, Leaf } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { categories } from '../data/menuData';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { cn } from '../utils/cn';

const MenuGrid: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = state.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const addToCart = (menuItem: MenuItem) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { menuItem, quantity: 1 }
    });
  };

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = state.cart.find(item => item.menuItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: itemId, quantity: newQuantity }
      });
    }
  };

  const SpiceLevelIndicator: React.FC<{ level: MenuItem['spiceLevel'] }> = ({ level }) => {
    const flames = level === 'mild' ? 1 : level === 'medium' ? 2 : 3;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <Flame
            key={i}
            className={cn(
              "h-3 w-3",
              i < flames ? "text-red-500 fill-red-500" : "text-gray-300"
            )}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1 capitalize">{level}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Authentic Indian Flavors
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the rich heritage of Indian cuisine with our carefully crafted dishes, 
          made with traditional spices and the finest ingredients.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for dishes, ingredients, or flavors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2",
              selectedCategory === category.id
                ? "bg-orange-500 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
            )}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const quantityInCart = getItemQuantityInCart(item.id);
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {item.isVeg && (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Leaf className="h-3 w-3" />
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-600" />
                    <span className="text-xs text-gray-600">{item.preparationTime}min</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="mb-4">
                  <SpiceLevelIndicator level={item.spiceLevel} />
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Main Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {item.ingredients.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{item.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Controls */}
                <div className="flex items-center justify-between">
                  {quantityInCart === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between bg-orange-50 rounded-xl p-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, quantityInCart - 1)}
                        className="bg-white text-orange-600 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-orange-600 px-4">{quantityInCart}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, quantityInCart + 1)}
                        className="bg-white text-orange-600 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No dishes found</h3>
          <p className="text-gray-600">Try searching for something else or browse all categories.</p>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;