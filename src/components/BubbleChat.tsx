import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useUser } from '../contexts/UserContext';
import { getChatMessages, sendChatMessageStream, ApiChatMessage } from '../utils/api';
import { useRouter } from 'next/router';
import Image from "next/image";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface BubbleChatProps {
  autoOpen?: boolean;
}

const BubbleChat: React.FC<BubbleChatProps> = ({ autoOpen = false }) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading } = useUser();

  const [isOpen, setIsOpen] = useState(autoOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  // Handle autoOpen prop
  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  // Load chat messages from API when opened
  useEffect(() => {
    const loadMessages = async () => {
      if (!isOpen || !isAuthenticated) return;

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
  }, [isOpen, isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

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
          console.log('BubbleChat: Delta received for update:', delta, 'at time:', new Date().toISOString());
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
          setCurrentSessionId(data.sessionId);
          setIsTyping(false);
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

  const handleExpandClick = () => {
    router.push('/chat');
  };

  const handleBubbleClick = () => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else {
      setIsOpen(true);
    }
  };

  // Don't show bubble chat while loading or for unauthenticated users (when closed)
  if (isLoading || (!isAuthenticated && !isOpen)) {
    return (
      <div className="bubble-chat-container">
        {!isLoading && (
          <div className="bubble-chat-trigger" onClick={handleBubbleClick}>
            <div className="bubble-chat-icon">
              💬
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bubble-chat-container">
      {/* Bubble trigger when closed */}
      {!isOpen && (
        <div className="bubble-chat-trigger" onClick={() => setIsOpen(true)}>
          <div className="bubble-chat-icon">
            💬
          </div>
        </div>
      )}

      {/* Chat window when open */}
      {isOpen && (
        <div className="bubble-chat-window">
          {/* Header */}
          <div className="bubble-chat-header">
            <div className="bubble-chat-title">
              <span>💬</span>
              <span>NutriWell Chat</span>
            </div>
            <div className="bubble-chat-actions">
              <button 
                className="bubble-chat-expand-btn"
                onClick={handleExpandClick}
                title="Espandi chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 14H5v5h5v-2M17 14h2v5h-5v-2M7 10H5V5h5v2M17 10h2V5h-5v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="bubble-chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Chiudi chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="bubble-chat-messages">
            {isLoadingMessages ? (
              <div className="bubble-message bubble-message-ai">
                <div className="bubble-message-avatar">
                    <Image
                      src="/images/logo02.svg"
                      alt="Logo Bot"
                      width={32}
                      height={32}
                    />
                </div>
                <div className="bubble-message-content">
                  <div className="bubble-message-bubble bubble-typing">
                    <div className="bubble-typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="bubble-chat-empty">
                <div className="bubble-chat-welcome">
                  <span>
                    <Image
                      src="/images/logo02.svg"
                      alt="Logo Bot"
                      width={32}
                      height={32}
                    />
                  </span>
                  <p>Ciao! Come posso aiutarti oggi con la tua nutrizione?</p>
                </div>
              </div>
            ) : (
              messages.slice(-5).map(message => ( // Show only last 5 messages
                <div
                  key={message.id}
                  className={`bubble-message ${message.sender === 'user' ? 'bubble-message-user' : 'bubble-message-ai'}`}
                >
                  <div className="bubble-message-avatar">
                    {message.sender === "user" ? (
                      "👤"
                    ) : (
                      <Image
                        src="/images/logo02.svg"
                        alt="Logo Bot"
                        width={32}
                        height={32}
                      />
                    )}
                  </div>
                  <div className="bubble-message-content">
                    <div className={`bubble-message-bubble ${message.sender === 'ai' && message.text === '' && isTyping ? 'bubble-typing' : ''}`}>
                      {message.sender === 'ai' && message.text === '' && isTyping ? (
                        <div className="bubble-typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : (
                        formatMessageText(message.text)
                      )}
                    </div>
                    <div className="bubble-message-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bubble-chat-input-container">
            <div className="bubble-chat-input-wrapper">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="bubble-chat-input"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bubble-chat-send-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleChat;
