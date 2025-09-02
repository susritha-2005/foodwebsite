import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ChefHat } from 'lucide-react';
import { ChatMessage } from '../types';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/currency';
import { chatService } from '../services/database';

const ChatBot: React.FC = () => {
  const { state } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Namaste! 🙏 I'm Chef AI, your personal culinary assistant. I know everything about our delicious Indian menu. How can I help you today? Looking for recommendations, ingredients info, or have questions about spice levels?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const menuItems = state.menuItems;
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
      return "Hello there! 🙏 Welcome to Spice Route! I'm here to help you discover amazing Indian dishes. What kind of flavors are you in the mood for today?";
    }
    
    // Recommendations based on preferences
    if (message.includes('recommend') || message.includes('suggest') || message.includes('what should i')) {
      if (message.includes('spicy') || message.includes('hot')) {
        const spicyItems = menuItems.filter(item => item.spiceLevel === 'spicy');
        const randomItem = spicyItems[Math.floor(Math.random() * spicyItems.length)];
        return `🌶️ For spicy lovers, I highly recommend our ${randomItem.name}! It's ${formatCurrency(randomItem.price)} and packed with authentic spices. ${randomItem.description} Perfect for those who love heat! Want to know more about any specific dish?`;
      }
      
      if (message.includes('vegetarian') || message.includes('veg')) {
        const vegItems = menuItems.filter(item => item.isVeg);
        const randomItem = vegItems[Math.floor(Math.random() * vegItems.length)];
        return `🌱 Our ${randomItem.name} is a fantastic vegetarian choice at ${formatCurrency(randomItem.price)}! ${randomItem.description} It's one of our most popular veg dishes. Would you like to see more vegetarian options?`;
      }
      
      if (message.includes('mild') || message.includes('not spicy')) {
        const mildItems = menuItems.filter(item => item.spiceLevel === 'mild');
        const randomItem = mildItems[Math.floor(Math.random() * mildItems.length)];
        return `😌 Perfect! Try our ${randomItem.name} for ${formatCurrency(randomItem.price)} - it's mild and flavorful. ${randomItem.description} Great for those who prefer gentle spices!`;
      }
      
      // General recommendation
      const popularItems = ['1', '2', '3', '6']; // IDs of popular items
      const popularItem = menuItems.find(item => popularItems.includes(item.id));
      return `🍽️ I'd recommend our ${popularItem?.name}! It's ${formatCurrency(popularItem?.price || 0)} and one of our chef's specialties. ${popularItem?.description} It's perfect for first-time visitors. What do you think?`;
    }
    
    // Specific dish inquiries
    const foundItem = menuItems.find(item => 
      item.name.toLowerCase().includes(message) || 
      message.includes(item.name.toLowerCase())
    );
    
    if (foundItem) {
      const spiceEmoji = foundItem.spiceLevel === 'spicy' ? '🌶️🌶️🌶️' : 
                        foundItem.spiceLevel === 'medium' ? '🌶️🌶️' : '🌶️';
      return `${foundItem.isVeg ? '🌱' : '🍖'} ${foundItem.name} is ${formatCurrency(foundItem.price)}! ${foundItem.description} 

Spice Level: ${spiceEmoji} ${foundItem.spiceLevel}
Prep Time: ⏱️ ${foundItem.preparationTime} minutes
Key Ingredients: ${foundItem.ingredients.slice(0, 3).join(', ')}

Would you like to know anything specific about this dish or see similar recommendations?`;
    }
    
    // Price inquiries
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return "💰 Our menu prices range from ₹30 for items like Chapati to ₹380 for our special Biryani. Most main courses are between ₹220-₹380, starters ₹80-₹240, and beverages ₹40-₹80. Which specific dish would you like to know about?";
    }
    
    // Ingredients and allergies
    if (message.includes('ingredient') || message.includes('allergy') || message.includes('contain')) {
      return "🥘 I can help you with ingredient information! Most of our dishes contain common ingredients like onions, garlic, ginger, and various spices. For specific allergen information about any dish, just ask me about that particular item. Which dish are you curious about?";
    }
    
    // Spice level questions
    if (message.includes('spice') || message.includes('hot')) {
      return "🌶️ We have three spice levels:\n• Mild 🌶️ - Gentle, family-friendly\n• Medium 🌶️🌶️ - Moderate heat, most popular\n• Spicy 🌶️🌶️🌶️ - For spice lovers!\n\nMost dishes can be customized to your preferred spice level. What's your spice tolerance?";
    }
    
    // Preparation time
    if (message.includes('time') || message.includes('how long') || message.includes('ready')) {
      return "⏰ Preparation times vary: Quick items like Masala Chai take 5 minutes, most main courses 20-30 minutes, and our special Biryani takes 45 minutes. During busy hours, add 10-15 minutes. Which dish are you planning to order?";
    }
    
    // Delivery related
    if (message.includes('delivery') || message.includes('order')) {
      return "🚚 We deliver fresh, hot food to your doorstep! Delivery is free for orders above ₹500, otherwise ₹40. Average delivery time is 30-45 minutes. Ready to place an order? I can help you choose the perfect combination!";
    }
    
    // Default responses
    const defaultResponses = [
      "I'd love to help! Could you tell me more about what you're looking for? Are you interested in recommendations, ingredients, spice levels, or something specific?",
      "That's interesting! Let me help you find the perfect dish. What kind of flavors do you enjoy - mild, spicy, creamy, or tangy?",
      "I'm here to make your dining experience amazing! Feel free to ask me about any dish, ingredients, prices, or recommendations based on your taste preferences.",
      "Great question! I can help with menu recommendations, ingredient details, spice levels, and more. What would you like to explore from our authentic Indian cuisine?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Save user message to database if user is logged in
    if (state.user) {
      await chatService.saveChatMessage(state.user.id, inputText, false);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const responseText = generateBotResponse(inputText);
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        timestamp: new Date(),
      };

      // Save bot response to database if user is logged in
      if (state.user) {
        chatService.saveChatMessage(state.user.id, responseText, true);
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Recommend something spicy 🌶️",
    "What's vegetarian? 🌱",
    "Show me popular dishes 👑",
    "What's the mildest option? 😌",
    "How spicy is butter chicken? 🤔"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-full">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chef AI Assistant</h1>
        <p className="text-gray-600">Your personal culinary guide to authentic Indian flavors</p>
      </div>

      {/* Quick Questions */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                setInputText(question);
                // Auto-send after a short delay
                setTimeout(sendMessage, 100);
              }}
              className="px-3 py-2 bg-orange-50 text-orange-700 text-sm rounded-full hover:bg-orange-100 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-2xl shadow-lg mb-4 h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} space-x-3`}
            >
              {message.isBot && (
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-full flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isBot ? 'text-gray-500' : 'text-orange-100'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              {!message.isBot && (
                <div className="bg-gray-600 p-2 rounded-full flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about menu items, recommendations, spice levels..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-orange-50 rounded-xl">
        <h3 className="font-medium text-orange-800 mb-2">💡 Pro Tips:</h3>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Ask about specific dishes: "Tell me about butter chicken"</li>
          <li>• Get recommendations: "What's good for vegetarians?"</li>
          <li>• Check spice levels: "Is dal makhani spicy?"</li>
          <li>• Learn about ingredients: "What's in biryani?"</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatBot;