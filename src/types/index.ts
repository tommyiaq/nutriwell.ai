/**
 * Core type definitions for the NutriWell.ai application
 */

/**
 * Feature item structure for the homepage carousel
 */
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/**
 * Navigation link structure
 */
export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

/**
 * Language configuration
 */
export interface Language {
  code: string;
  name: string;
  flag: string;
}

/**
 * User authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}


/**
 * Chat message content structure (from API)
 */
export interface MessageContent {
  type?: 'text';
  text: string;
}

/**
 * Chat message structure (from API)
 */
export interface ApiChatMessage {
  role: 'user' | 'assistant';
  content: MessageContent[];
}

/**
 * Local chat message structure for UI
 */
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'calculation' | 'recommendation';
}
