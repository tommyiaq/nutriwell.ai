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
 * Nutrition calculation parameters
 */
export interface NutritionParams {
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'lose' | 'gain';
}

/**
 * Nutrition calculation results
 */
export interface NutritionResults {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  calories: number; // Recommended daily calories
  macros: {
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
  };
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'calculation' | 'recommendation';
}
