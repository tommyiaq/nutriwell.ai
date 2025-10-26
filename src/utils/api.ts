const API_BASE_URL = 'http://10.101.29.182';

export interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  language: string;
}

export interface RegisterRequest {
  mail: string;
  pass: string;
  firstName: string;
  lastName: string;
  language: string;
}

export interface LoginRequest {
  mail: string;
  pass: string;
}

// Utility function to hash password using SHA-256
export async function hashPassword(password: string): Promise<string> {
  try {
    // Check if Web Crypto API is available (for mobile compatibility)
    if (!crypto || !crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    // Fallback: Simple hash for mobile browsers that don't support Web Crypto API
    // Note: This is less secure but ensures compatibility
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex and pad to look like a proper hash
    const simpleHash = Math.abs(hash).toString(16).padStart(8, '0');
    // Make it longer to look more like SHA-256 (for compatibility with backend)
    return simpleHash.repeat(8).substring(0, 64);
  }
}

// Generic API call function
export async function apiCall<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  try {
    console.log('API Call:', { endpoint: `${API_BASE_URL}${endpoint}`, data }); // Debug log
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session management
      body: JSON.stringify(data),
    });

    console.log('API Response status:', response.status); // Debug log
    console.log('API Response headers:', Object.fromEntries(response.headers.entries())); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText); // Debug log
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const result: ApiResponse<T> = await response.json();
    console.log('API Response body:', result); // Debug log
    return result;
  } catch (error) {
    console.error('API Call error:', error); // Debug log
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Register user
export async function registerUser(userData: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
  return apiCall<{ user: User }>('/Services/Register.srv', userData);
}

// Login user (for future use)
export async function loginUser(credentials: LoginRequest): Promise<ApiResponse<{ user: User }>> {
  return apiCall<{ user: User }>('/Services/Login.srv', credentials);
}

// Logout user
export async function logoutUser(): Promise<ApiResponse<{}>> {
  return apiCall<{}>('/Services/Logout.srv', {});
}

// Chat message interfaces
export interface MessageContent {
  type?: 'text';
  text: string;
}

export interface ApiChatMessage {
  role: 'user' | 'assistant';
  content: MessageContent[];
}

export interface ChatGetMessagesRequest {
  sessionId?: string;
}

export interface ChatGetMessagesResponse {
  messages: ApiChatMessage[];
}

// Get chat messages
export async function getChatMessages(sessionId?: string): Promise<ApiResponse<ChatGetMessagesResponse>> {
  const requestData: ChatGetMessagesRequest = {};
  if (sessionId) {
    requestData.sessionId = sessionId;
  }
  return apiCall<ChatGetMessagesResponse>('/Services/ChatGetMessages.srv', requestData);
}

// Chat sessions interfaces
export interface ChatSession {
  sessionId: string;
  dateTime: string;
}

export interface ListChatSessionsResponse {
  sessions: ChatSession[];
}

// List chat sessions
export async function listChatSessions(): Promise<ApiResponse<ListChatSessionsResponse>> {
  return apiCall<ListChatSessionsResponse>('/Services/ListChatSessions.srv', {});
}

// Chat send message interfaces
export interface ChatSendMessageRequest {
  sessionId?: string;
  stream?: boolean;
  input: MessageContent[];
}

export interface ChatSendMessageResponse {
  output: MessageContent[];
  sessionId: string;
  creditLimit: number;
  usedCredit: number;
}

// Streaming event types
export interface StreamDeltaEvent {
  type: 'delta';
  delta: string;
}

export interface StreamEndEvent {
  type: 'end';
  status: 'ok' | 'error';
  data?: {
    sessionId: string;
    creditLimit: number;
    usedCredit: number;
  };
  error?: string;
}

export type StreamEvent = StreamDeltaEvent | StreamEndEvent;

// Send chat message (non-streaming)
export async function sendChatMessage(message: string, sessionId?: string): Promise<ApiResponse<ChatSendMessageResponse>> {
  const requestData: ChatSendMessageRequest = {
    input: [
      {
        type: 'text',
        text: message
      }
    ],
    stream: false
  };
  
  if (sessionId) {
    requestData.sessionId = sessionId;
  }
  
  return apiCall<ChatSendMessageResponse>('/Services/ChatSendMessage.srv', requestData);
}

// Send chat message with streaming
export async function sendChatMessageStream(
  message: string, 
  sessionId?: string,
  onDelta?: (delta: string) => void,
  onEnd?: (data: { sessionId: string; creditLimit: number; usedCredit: number }) => void,
  onError?: (error: string) => void
): Promise<void> {
  const requestData: ChatSendMessageRequest = {
    input: [
      {
        type: 'text',
        text: message
      }
    ],
    stream: true
  };
  
  if (sessionId) {
    requestData.sessionId = sessionId;
  }

  try {
    console.log('Streaming API Call:', { endpoint: `${API_BASE_URL}/Services/ChatSendMessage.srv`, data: requestData });
    
    const response = await fetch(`${API_BASE_URL}/Services/ChatSendMessage.srv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Streaming API Error response:', errorText);
      onError?.(`HTTP error! status: ${response.status}, response: ${errorText}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError?.('Failed to get response reader');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    console.log('Stream reader started at:', new Date().toISOString());

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk received at', new Date().toISOString(), ':', JSON.stringify(chunk));
        buffer += chunk;
        
        // Check if this is a direct error response (not SSE format)
        if (buffer.trim().startsWith('{') && buffer.trim().includes('"status": "error"')) {
          try {
            const errorResponse = JSON.parse(buffer.trim());
            if (errorResponse.status === 'error') {
              console.error('❌ API Error Response:', errorResponse.error);
              
              // Handle specific error types with dedicated messages
              let errorMessage = errorResponse.error;
              if (errorResponse.error === 'Credit limit exceeded') {
                errorMessage = '❌ Limite di credito superato! Hai raggiunto il limite di utilizzo per questo periodo di fatturazione.\n\n💡 Vuoi continuare? Passa a un account a pagamento per ulteriori funzionalità!\n\n👉 <a href="/#prezzi" style="color: #007bff; text-decoration: underline;">Scopri i nostri piani tariffari</a>';
              } else if (errorResponse.error.includes('authentication') || errorResponse.error.includes('session')) {
                errorMessage = '❌ Authentication error! Please log in again.';
              } else if (errorResponse.error.includes('rate limit')) {
                errorMessage = '❌ Rate limit exceeded! Please wait a moment before sending another message.';
              }
              
              onError?.(errorMessage);
              return;
            }
          } catch (e) {
            // Not a JSON error response, continue with SSE processing
          }
        }
        
        // Process complete events (separated by double newlines)
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep incomplete event in buffer
        
        for (const eventBlock of events) {
          if (eventBlock.trim() === '') continue; // Skip empty blocks
          
          console.log('Processing event block:', JSON.stringify(eventBlock)); // Debug log
          
          // The entire event block after "data: " is the JSON (including newlines)
          let eventData = '';
          if (eventBlock.startsWith('data: ')) {
            eventData = eventBlock.substring(6); // Remove 'data: ' prefix from the beginning
          }
          
          if (eventData.trim() === '') continue; // Skip empty data
          
          console.log('Extracted event data:', JSON.stringify(eventData)); // Debug log
          
          try {
            const event: StreamEvent = JSON.parse(eventData);
            console.log('Parsed event successfully:', event); // Debug log
            
            if (event.type === 'delta') {
              console.log('Delta received immediately:', event.delta); // Debug timing
              // Add a tiny delay to ensure DOM can render before next delta
              setTimeout(() => onDelta?.(event.delta), 0);
            } else if (event.type === 'end') {
              console.log('End event received'); // Debug timing
              if (event.status === 'ok' && event.data) {
                onEnd?.(event.data);
              } else {
                onError?.(event.error || 'Stream ended with error');
              }
              return; // End of stream
            }
          } catch (parseError) {
            console.error('Failed to parse SSE event:', parseError, 'Raw data:', JSON.stringify(eventData));
            console.error('Event block was:', JSON.stringify(eventBlock));
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Streaming API Call error:', error);
    onError?.(error instanceof Error ? error.message : 'An unknown error occurred');
  }
}

// Utility function to clear the session cookie
export function clearSessionCookie(): void {
  console.log('Before clearing cookies:', document.cookie); // Debug log
  
  // Simple approach: just clear the cookie name with empty value and past expiry
  // The browser will match it with the existing cookie regardless of other attributes
  document.cookie = '.NutriWellBackend.Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  
  console.log('After clearing cookies:', document.cookie); // Debug log
  console.log('Session cookie cleared'); // Debug log
}
