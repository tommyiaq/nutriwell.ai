import { useState } from 'react';
import Header from '../components/Header';
import { useTranslations } from 'next-intl';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI nutrition assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (dummy for now)
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: "Thank you for your question! This is a demo version. In the full version, I would provide personalized nutrition guidance based on your specific needs and goals.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="nv-chat-page">
      <Header />
      
      <div className="nv-chat-container">
        {/* Chat Header */}
        <div className="nv-chat-header">
          <div className="nv-chat-title">
            <div className="nv-ai-avatar">🤖</div>
            <div>
              <h1>nutriwell AI Assistant</h1>
              <p className="nv-chat-status">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="nv-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`nv-message ${message.sender === 'user' ? 'nv-message-user' : 'nv-message-ai'}`}
            >
              <div className="nv-message-avatar">
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="nv-message-content">
                <div className="nv-message-bubble">
                  {message.text}
                </div>
                <div className="nv-message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="nv-message nv-message-ai">
              <div className="nv-message-avatar">🤖</div>
              <div className="nv-message-content">
                <div className="nv-message-bubble nv-typing">
                  <div className="nv-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="nv-chat-input-container">
          <div className="nv-chat-input-wrapper">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about nutrition, calories, meal planning..."
              className="nv-chat-input"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="nv-chat-send-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 21l21-9L2 3v7l15 2-15 2v7z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <p className="nv-chat-disclaimer">
            This is a demo version. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
