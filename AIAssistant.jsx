import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Lightbulb, TrendingUp, HelpCircle } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your StockBuddyX AI assistant. I can help you understand stock market concepts, explain features, and answer your investment questions. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses for common stock market questions
  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what is') && (lowerMessage.includes('stock') || lowerMessage.includes('share'))) {
      return "A stock represents ownership in a company. When you buy shares, you become a partial owner and can benefit from the company's growth through price appreciation and dividends.";
    }
    
    if (lowerMessage.includes('p/e ratio') || lowerMessage.includes('pe ratio')) {
      return "P/E ratio (Price-to-Earnings) compares a company's stock price to its earnings per share. A lower P/E might indicate the stock is undervalued, while a higher P/E suggests investors expect higher growth.";
    }
    
    if (lowerMessage.includes('market cap')) {
      return "Market capitalization is the total value of a company's shares. It's calculated by multiplying the stock price by the number of outstanding shares. It helps categorize companies as small-cap, mid-cap, or large-cap.";
    }
    
    if (lowerMessage.includes('dividend')) {
      return "Dividends are payments companies make to shareholders from their profits. They're usually paid quarterly and can provide regular income. Not all companies pay dividends - some reinvest profits for growth.";
    }
    
    if (lowerMessage.includes('bull market') || lowerMessage.includes('bear market')) {
      return "A bull market is when stock prices are rising and investor confidence is high. A bear market is when prices fall 20% or more from recent highs, often due to economic concerns.";
    }
    
    if (lowerMessage.includes('volatility')) {
      return "Volatility measures how much a stock's price fluctuates. High volatility means larger price swings, which can mean higher potential returns but also higher risk.";
    }
    
    if (lowerMessage.includes('diversification') || lowerMessage.includes('diversify')) {
      return "Diversification means spreading investments across different stocks, sectors, or asset types to reduce risk. The saying 'don't put all your eggs in one basket' applies perfectly to investing.";
    }
    
    if (lowerMessage.includes('how to use') || lowerMessage.includes('features')) {
      return "StockBuddyX offers several features: 📊 Dashboard for market overview, 🔍 Search with voice support, ⭐ Watchlist to track favorites, 📈 Compare up to 4 stocks, and 🤝 View company partnerships. Try the voice search by clicking the microphone icon!";
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return "All investments carry risk. Generally, stocks are riskier than bonds but offer higher potential returns. Consider your risk tolerance, investment timeline, and diversification. Never invest money you can't afford to lose.";
    }
    
    if (lowerMessage.includes('when to buy') || lowerMessage.includes('when to sell')) {
      return "Timing the market is extremely difficult. Consider dollar-cost averaging (investing regularly regardless of price) and focus on long-term goals. Buy quality companies at reasonable prices and hold for the long term.";
    }
    
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      return "For beginners: 1) Learn the basics first, 2) Start with index funds or ETFs, 3) Invest regularly, 4) Don't try to time the market, 5) Keep costs low, 6) Stay diversified, and 7) Think long-term. Education is your best investment!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you navigate the stock market and understand StockBuddyX features. Feel free to ask me about investing concepts, market terms, or how to use the app!";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm always here to help you learn about investing and make the most of StockBuddyX. Keep asking questions - that's how you become a better investor! 📈";
    }
    
    // Default response
    return "That's a great question! While I can help with basic stock market concepts and app features, I recommend consulting with a financial advisor for personalized investment advice. Is there a specific stock market term or StockBuddyX feature you'd like me to explain?";
  };

  const quickQuestions = [
    { icon: TrendingUp, text: "What is a stock?", question: "What is a stock and how does it work?" },
    { icon: Lightbulb, text: "P/E Ratio explained", question: "What is P/E ratio and why is it important?" },
    { icon: HelpCircle, text: "How to use StockBuddyX", question: "How to use StockBuddyX features?" }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs opacity-90">Stock Market Helper</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
            <div className="space-y-1">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(q.question)}
                  className="w-full text-left p-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <q.icon className="w-3 h-3 text-blue-500" />
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about stocks or app features..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;