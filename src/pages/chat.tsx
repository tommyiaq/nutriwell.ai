import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import LandingHeader from '../components/landing-Header';
import { useUser } from '../contexts/UserContext';
import { getChatMessages, sendChatMessage, ApiChatMessage } from '../utils/api';

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
  

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Helper function to convert API messages to local message format
  const convertApiMessagesToLocal = (apiMessages: ApiChatMessage[]): Message[] => {
    return apiMessages.map((msg, index) => ({
      id: index + 1,
      text: msg.content.map(c => c.text).join(' '), // Combine all text content
      sender: msg.role === 'user' ? 'user' as const : 'ai' as const,
      timestamp: new Date(), // API doesn't provide timestamp, using current time
    }));
  };

  // Helper function to format message text with markdown and newlines
  const formatMessageText = (text: string) => {
    // Split text by newlines to preserve line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check if line is a bullet point
      const isBulletPoint = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      let processedLine = line;
      
      // If it's a bullet point, wrap it appropriately
      if (isBulletPoint) {
        processedLine = line.replace(/^[\s]*[-*]\s/, '• '); // Replace - or * with bullet
      }
      
      // Process the line for formatting (bold, italic)
      // First handle bold (**text**)
      let parts = processedLine.split(/(\*\*.*?\*\*)/g);
      
      // Then handle italic (*text*) - but not if it's part of **
      parts = parts.flatMap(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return [part]; // Keep bold parts as-is
        }
        return part.split(/(\*[^*]+?\*)/g);
      });
      
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) => {
            // Check if this part should be bold
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              const boldText = part.slice(2, -2); // Remove ** from start and end
              return <strong key={partIndex}>{boldText}</strong>;
            }
            // Check if this part should be italic (single * but not part of **)
            else if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.includes('**')) {
              const italicText = part.slice(1, -1); // Remove * from start and end
              return <em key={partIndex}>{italicText}</em>;
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Load chat messages from API
  useEffect(() => {
    const loadMessages = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoadingMessages(true);
        const response = await getChatMessages(); // Call without sessionId to get the last session
        
        if (response.status === 'ok' && response.data) {
          const localMessages = convertApiMessagesToLocal(response.data.messages);
          setMessages(localMessages);
        } else {
          console.error('Failed to load messages:', response.error);
          // No messages available - keep empty array
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        // Error occurred - keep empty array, no placeholder message
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [isAuthenticated]);

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

    const messageText = inputText.trim();
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately to UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Send message to API
      const response = await sendChatMessage(messageText, currentSessionId);
      
      if (response.status === 'ok' && response.data) {
        // Update session ID if we got a new one
        if (response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
        }
        
        // Process AI response
        const aiResponseText = response.data.output
          .map(content => content.text)
          .join(' ');
          
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle API error
        console.error('Failed to send message:', response.error);
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle network/other errors
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Mi dispiace, si è verificato un errore di connessione. Riprova più tardi.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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


            {/* Chat Sessions Section */}
            <div className="nv-side-section">
              <h3 className="nv-side-section-title">Chat Sessions</h3>
              <div className="nv-side-section-item nv-active">
                <span>Current Session</span>
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
              {isLoadingMessages ? (
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
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`nv-message ${message.sender === 'user' ? 'nv-message-user' : 'nv-message-ai'}`}
                  >
                    <div className="nv-message-avatar">
                      {message.sender === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="nv-message-content">
                      <div className="nv-message-bubble">{formatMessageText(message.text)}</div>
                      <div className="nv-message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}

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
