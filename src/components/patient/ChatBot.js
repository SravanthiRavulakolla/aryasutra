// frontend/src/components/patient/ChatBot.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ChatBot = ({ patientId = 1 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chatbot/history/${patientId}`);
      const data = await response.json();
      if (data.success && data.data?.messages) {
        setMessages(data.data.messages);
        if (data.data.messages.length === 0) {
          showWelcomeMessage();
        }
      } else {
        showWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      showWelcomeMessage();
    }
  };

  const showWelcomeMessage = () => {
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now(),
        from: 'bot',
        text:
          'Namaste! 🙏 Welcome to AyurSutra. I\'m your Panchakarma assistant. I can help you with questions about therapies, preparation, aftercare, and scheduling. What would you like to know?',
        timestamp: new Date().toISOString(),
        isWelcome: true,
      };
      setMessages([welcomeMessage]);
      if (!isOpen) setUnreadCount(1);
    }, 1000);
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      from: 'patient',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, message: textToSend }),
      });

      const data = await response.json();
      if (data.success && data.data?.botMessage) {
        setTimeout(() => {
          const botMessage = {
            ...data.data.botMessage,
            id: data.data.botMessage.id || Date.now(),
            isTyping: false,
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          if (!isOpen) setUnreadCount((prev) => prev + 1);
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Provide helpful fallback responses based on the question
      setTimeout(() => {
        let botResponse = "I'm having trouble connecting right now. Here's some general guidance: ";
        
        const lowerText = textToSend.toLowerCase();
        if (lowerText.includes('abhyanga')) {
          botResponse = "🌿 Abhyanga is a full-body warm oil massage that balances Vata dosha. Before your session: • Drink warm water (avoid cold drinks) • Eat light meals 2-3 hours before • Wear comfortable, loose clothing • Arrive 10 minutes early for consultation";
        } else if (lowerText.includes('post') || lowerText.includes('care') || lowerText.includes('after')) {
          botResponse = "🌸 Post-therapy care tips: • Rest for 1-2 hours after treatment • Drink warm water or herbal tea • Avoid cold foods and beverages • Take a warm shower after 2-3 hours • Practice gentle meditation or breathing exercises";
        } else if (lowerText.includes('diet') || lowerText.includes('food')) {
          botResponse = "🥗 Diet during Panchakarma: • Eat warm, cooked foods • Include spices like ginger, cumin, turmeric • Avoid cold, raw, or processed foods • Drink warm water throughout the day • Eat kitchari (rice and lentils) for easy digestion";
        } else if (lowerText.includes('exercise')) {
          botResponse = "🧘‍♀️ Exercise after treatment: • Practice gentle yoga or stretching • Take short walks in nature • Avoid intense workouts for 24 hours • Focus on breathing exercises (pranayama) • Listen to your body and rest when needed";
        } else {
          botResponse = "🌿 General Panchakarma guidance: Please consult with your practitioner for personalized advice. You can also find helpful tips in the Daily Wellness Tips section. Contact your practitioner for immediate assistance.";
        }
        
        const fallbackMessage = {
          id: Date.now(),
          from: 'bot',
          text: botResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setUnreadCount(0);
  };

  // Memoized message formatter
  const formatMessageText = useCallback((text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg">🌿</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">AyurSutra Assistant</h3>
            <p className="text-xs opacity-90">Ask about Panchakarma therapies</p>
          </div>
        </div>
        <button
          onClick={toggleChat}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
            />
          </svg>
        </button>
      </div>

      {!isOpen && (
        <div className="p-3 bg-amber-50 border-t border-amber-200 text-center">
          <p className="text-sm text-amber-700">Assistant is ready to help 🌿</p>
        </div>
      )}

      {isOpen && (
        <>
          {/* Quick Questions */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-200">
            <p className="text-xs text-amber-800 mb-2 font-medium">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'What is Abhyanga?',
                'Post-therapy care tips',
                'Diet during Panchakarma',
                'Exercise after treatment',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white text-amber-700 px-2 py-1 rounded-full hover:bg-amber-100 transition-colors border border-amber-300 text-left truncate shadow-sm"
                >
                  {q.replace('tips', '').trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id || message.timestamp}
                className={`flex ${
                  message.from === 'patient' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.from === 'patient'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-md'
                      : message.isWelcome
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 border border-amber-300 rounded-bl-md'
                      : 'bg-white text-gray-800 shadow-sm border border-amber-200 rounded-bl-md'
                  }`}
                >
                  {formatMessageText(message.text)}
                  <div
                    className={`text-xs mt-1 opacity-70 ${
                      message.from === 'patient'
                        ? 'text-orange-100'
                        : message.isWelcome
                        ? 'text-amber-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 max-w-xs">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask about therapies, diet, preparation..."
                className="flex-1 border border-amber-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full p-2 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-2 text-center">
              Personalized guidance for your Panchakarma journey 🌿
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;