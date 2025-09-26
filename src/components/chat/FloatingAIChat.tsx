import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your Benki AI assistant. How can I help you with your wealth building journey today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const suggestedQuestions = [
    "How can I save for a laptop in 3 months?",
    "What's the best investment for beginners?",
    "How do I diversify my portfolio?",
    "Tell me about Nigerian bonds",
    "What are the risks of investing?",
    "How much should I save monthly?"
  ];

  const aiResponses = {
    "save": "Great question! For short-term goals like saving for a laptop in 3 months, I'd recommend our Ghanaian Savings Account (6-8% yield) or Nigerian High-Yield Bonds (8-16% yield). Set aside a fixed amount weekly to reach your goal faster.",
    "investment": "For beginners, I recommend starting with low-risk options like our Government-backed bonds (8-16% yield) or diversified savings accounts. These provide steady returns while you learn about investing.",
    "diversify": "Diversification is key! Spread your investments across different asset classes: bonds (30%), equities (40%), savings (20%), and alternative investments (10%). This reduces risk while maintaining growth potential.",
    "bonds": "Nigerian High-Yield Bonds are government-backed securities offering 8-16% annual returns. They're low-risk and regulated by licensed brokers like Stanbic IBTC Trust Limited. Minimum investment is just $10!",
    "risk": "Every investment carries some risk, but we help you manage it. Low-risk options include government bonds, medium-risk includes diversified funds, and high-risk includes startups. Always invest what you can afford to lose.",
    "monthly": "A good rule is the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and investments. Start with even $10-20 monthly in our investment options to build the habit!",
    "default": "That's a great question! I can help you with saving strategies, investment advice, portfolio diversification, and understanding different financial products. What specific area would you like to explore?"
  };

  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('save') || lowerMessage.includes('laptop') || lowerMessage.includes('months')) {
      return aiResponses.save;
    } else if (lowerMessage.includes('investment') || lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      return aiResponses.investment;
    } else if (lowerMessage.includes('diversify') || lowerMessage.includes('portfolio')) {
      return aiResponses.diversify;
    } else if (lowerMessage.includes('bond') || lowerMessage.includes('nigerian')) {
      return aiResponses.bonds;
    } else if (lowerMessage.includes('risk')) {
      return aiResponses.risk;
    } else if (lowerMessage.includes('monthly') || lowerMessage.includes('much')) {
      return aiResponses.monthly;
    } else {
      return aiResponses.default;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Generate AI response
    const aiResponse = {
      id: messages.length + 2,
      type: 'ai',
      content: getAIResponse(inputMessage),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg animate-pulse hover:animate-none transition-all duration-300"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
        {!isOpen && (
          <div className="absolute -top-2 -left-20 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            Ask Me
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-50">
          <Card className="shadow-2xl border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Benki AI Assistant</CardTitle>
                    <CardDescription className="text-green-100">
                      Your wealth building companion
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                  <div className="space-y-1">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about saving and investing..."
                    className="flex-1 border-green-200 focus:border-green-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}