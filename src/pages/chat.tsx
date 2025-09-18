import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import LandingHeader from '../components/landing-Header';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const t = useTranslations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/signin';
    }
  }, [isAuthenticated]);
  

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Ciao! Sono il tuo assistente nutrizionale AI. Come posso aiutarti oggi?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle mobile keyboard visibility
  useEffect(() => {
    let initialViewportHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;

      // If viewport height decreased significantly (keyboard opened)
      if (heightDifference > 150) {
        setIsKeyboardOpen(true);
        setTimeout(() => {
          scrollToBottom();
          // Additional scroll to ensure input is visible
          const inputContainer = document.querySelector(
            '.nv-chat-input-container'
          );
          if (inputContainer) {
            inputContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      } else {
        // Keyboard closed
        setIsKeyboardOpen(false);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    };

    // Also handle orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        initialViewportHeight = window.innerHeight;
        scrollToBottom();
      }, 500);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Handle input focus for mobile
  const handleInputFocus = () => {
    // Scroll to bottom first
    setTimeout(() => {
      scrollToBottom();
      // Then ensure input is visible
      const inputContainer = document.querySelector('.nv-chat-input-container');
      if (inputContainer) {
        inputContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 300);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (dummy for now)
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: 'Thank you for your question! This is a demo version. In the full version, I would provide personalized nutrition guidance based on your specific needs and goals.',
        sender: 'ai',
        timestamp: new Date(),
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
      hour12: false,
    });
  };

  return (
    <div className={`nv-chat-page ${isKeyboardOpen ? 'nv-keyboard-open' : ''}`}>
      <LandingHeader logoOnly={true} />

      {/* Desktop Main Content Wrapper */}
      <div className={`nv-chat-main-content ${!isMobile ? 'nv-desktop' : ''}`}>
        {/* Side Panel */}
        <div
          className={`nv-side-panel ${(isSidePanelOpen && isMobile) || !isMobile ? 'nv-side-panel-open' : ''}`}
        >
          <div className="nv-side-panel-content">
            {/* Configuration Section */}
            <div className="nv-side-section">
              <h3 className="nv-side-section-title">Configuration</h3>
              <div className="nv-side-section-item">
                <span>Knowledge Base</span>
              </div>
            </div>

            {/* Chat Sessions Section */}
            <div className="nv-side-section">
              <h3 className="nv-side-section-title">Chat Sessions</h3>
              <div className="nv-side-section-item nv-active">
                <span>Current Session</span>
              </div>
              <div className="nv-side-section-item">
                <span>Previous Session 1</span>
              </div>
              <div className="nv-side-section-item">
                <span>Previous Session 2</span>
              </div>
            </div>

            {/* User Section */}
            <div className="nv-side-section nv-side-user">
              <div className="nv-user-info">
                <div className="nv-user-avatar">👤</div>
                <span className="nv-username">
                  {isAuthenticated && user 
                    ? `${user.firstName} ${user.lastName}` 
                    : 'Guest User'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel Overlay */}
        {isSidePanelOpen && isMobile && (
          <div
            className="nv-side-panel-overlay"
            onClick={() => setIsSidePanelOpen(false)}
          ></div>
        )}

        <div className="nv-chat-container">
          {/* Messages Container */}
          <div className="nv-messages-container">
            <div className="nv-messages-list">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`nv-message ${message.sender === 'user' ? 'nv-message-user' : 'nv-message-ai'}`}
                >
                  <div className="nv-message-avatar">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="nv-message-content">
                    <div className="nv-message-bubble">{message.text}</div>
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
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="nv-chat-input-container">
            <div className="nv-chat-input-wrapper">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                placeholder={t('chat.placeholder')}
                className="nv-chat-input"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="nv-chat-send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <p className="nv-chat-disclaimer">{t('chat.disclaimer')}</p>
          </div>
        </div>
      </div>

      {/* Side Panel Overlay */}
      {isSidePanelOpen && isMobile && (
        <div
          className="nv-side-panel-overlay"
          onClick={() => setIsSidePanelOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Chat;
