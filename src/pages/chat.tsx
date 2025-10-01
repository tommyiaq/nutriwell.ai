import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTranslations } from 'next-intl';
import LandingHeader from '../components/landing-Header';
import { useUser } from '../contexts/UserContext';
import { getChatMessages, sendChatMessageStream, listChatSessions, ApiChatMessage, ChatSession } from '../utils/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const t = useTranslations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading } = useUser();

  // Redirect to login if not authenticated (but wait for loading to complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/signin';
    }
  }, [isAuthenticated, isLoading]);
  

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Session management state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

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
            // Check for HTML links first
            if (part.includes('<a href=')) {
              const linkRegex = /<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
              const linkParts = [];
              let lastIndex = 0;
              let match;

              while ((match = linkRegex.exec(part)) !== null) {
                // Add text before the link
                if (match.index > lastIndex) {
                  linkParts.push(part.slice(lastIndex, match.index));
                }
                // Add the link
                linkParts.push(
                  <a 
                    key={`${partIndex}-${match.index}`}
                    href={match[1]} 
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {match[2]}
                  </a>
                );
                lastIndex = linkRegex.lastIndex;
              }
              
              // Add remaining text after the last link
              if (lastIndex < part.length) {
                linkParts.push(part.slice(lastIndex));
              }
              
              return <React.Fragment key={partIndex}>{linkParts}</React.Fragment>;
            }
            // Check if this part should be bold
            else if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
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
      
      // Don't load messages for 'new' sessions (they have no messages yet)
      if (currentSessionId === 'new') {
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      try {
        setIsLoadingMessages(true);
        const response = await getChatMessages(currentSessionId); // Pass the current session ID
        
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
  }, [isAuthenticated, currentSessionId]); // Re-load when session changes

  // Load chat sessions
  const loadSessions = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoadingSessions(true);
      const response = await listChatSessions();
      
      if (response.status === 'ok' && response.data) {
        // Sort sessions by date (most recent first)
        const sortedSessions = response.data.sessions.sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setChatSessions(sortedSessions);
      } else {
        console.error('Failed to load sessions:', response.error);
        setChatSessions([]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setChatSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
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

  // Session management functions
  const handleSessionSwitch = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setMessages([]); // Clear current messages
    setIsLoadingMessages(true); // Will trigger reload in useEffect
  };

  const createNewSession = () => {
    setCurrentSessionId('new'); // Use 'new' as specified in API
    setMessages([]); // Clear current messages
  };

  const formatSessionDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

    // Create a placeholder AI message that will be updated with streaming content
    const aiMessageId = Date.now() + 1;
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    };
    
    // Add empty AI message to show typing indicator
    setMessages(prev => [...prev, aiMessage]);

    try {
      await sendChatMessageStream(
        messageText, 
        currentSessionId,
        // onDelta: Update the AI message with streaming text
        (delta: string) => {
          console.log('UI: Delta received for update:', delta, 'at time:', new Date().toISOString());
          // Hide typing indicator on first delta
          setIsTyping(false);
          
          // Force immediate update by using flushSync to bypass React batching
          flushSync(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: msg.text + delta }
                : msg
            ));
          });
          
          // Force scroll to bottom after each update
          setTimeout(() => {
            scrollToBottom();
          }, 10);
        },
        // onEnd: Handle stream completion
        (data: { sessionId: string; creditLimit: number; usedCredit: number }) => {
          const wasNewSession = currentSessionId === 'new';
          setCurrentSessionId(data.sessionId);
          setIsTyping(false);
          
          // If this was a new session, refresh the sessions list
          if (wasNewSession) {
            loadSessions();
          }
        },
        // onError: Handle errors
        (error: string) => {
          console.error('Streaming failed:', error);
          setIsTyping(false);
          
          // Replace the empty AI message with the actual error message
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: error }
              : msg
          ));
        }
      );
    } catch (error) {
      // Handle network/other errors
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Replace the empty AI message with error message
      const errorMessage = error instanceof Error ? error.message : 'Mi dispiace, si è verificato un errore di connessione. Riprova più tardi.';
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: errorMessage }
          : msg
      ));
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="nv-chat-page">
        <LandingHeader logoOnly={true} />
        <div className="nv-loading-container">
          <div className="nv-loading-spinner">
            <div className="nv-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`nv-chat-page ${isKeyboardOpen ? 'nv-keyboard-open' : ''}`}>
      <LandingHeader logoOnly={true} />
      
      {/* Back to Index with Bubble Chat Button */}
      <button
        className="nv-back-to-bubble-btn"
        onClick={() => window.location.href = '/?openBubbleChat=true'}
        title="Torna alla home con chat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

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
              <div className="nv-side-section-header">
                <h3 className="nv-side-section-title">Chat Sessions</h3>
                <button 
                  className="nv-new-session-btn"
                  onClick={createNewSession}
                  title="Nuova sessione"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              {isLoadingSessions ? (
                <div className="nv-side-section-item">
                  <span>Caricamento...</span>
                </div>
              ) : chatSessions.length === 0 ? (
                <div className="nv-side-section-item">
                  <span>Nessuna sessione</span>
                </div>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className={`nv-side-section-item ${currentSessionId === session.sessionId ? 'nv-active' : ''}`}
                    onClick={() => handleSessionSwitch(session.sessionId)}
                  >
                    <div className="nv-session-info">
                      <span className="nv-session-date">
                        {formatSessionDate(session.dateTime)}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
                      <div className={`nv-message-bubble ${message.sender === 'ai' && message.text === '' && isTyping ? 'nv-typing' : ''}`}>
                        {message.sender === 'ai' && message.text === '' && isTyping ? (
                          <div className="nv-typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        ) : (
                          formatMessageText(message.text)
                        )}
                      </div>
                      <div className="nv-message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
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
