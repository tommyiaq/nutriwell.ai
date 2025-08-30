/**
 * Utility functions for nutrition calculations
 */

import { NutritionParams, NutritionResults } from '@/types';

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
} as const;

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * @param params - User's physical parameters
 * @returns BMR value in calories per day
 */
export function calculateBMR(params: NutritionParams): number {
  const { age, gender, height, weight } = params;

  // Mifflin-St Jeor Equation
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;

  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * Calculate Total Daily Energy Expenditure
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - User's activity level
 * @returns TDEE value in calories per day
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: NutritionParams['activityLevel']
): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate daily calorie needs based on goals
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - User's fitness goal
 * @returns Adjusted calorie target
 */
export function calculateCalorieTarget(
  tdee: number,
  goal: NutritionParams['goal']
): number {
  switch (goal) {
    case 'lose':
      return Math.round(tdee * 0.8); // 20% deficit
    case 'gain':
      return Math.round(tdee * 1.15); // 15% surplus
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * Calculate macronutrient distribution
 * @param calories - Daily calorie target
 * @returns Macronutrient breakdown in grams
 */
export function calculateMacros(calories: number) {
  // Standard macro distribution: 30% protein, 40% carbs, 30% fat
  const protein = Math.round((calories * 0.3) / 4); // 4 cal/g protein
  const carbs = Math.round((calories * 0.4) / 4); // 4 cal/g carbs
  const fat = Math.round((calories * 0.3) / 9); // 9 cal/g fat

  return { protein, carbs, fat };
}

/**
 * Complete nutrition calculation
 * @param params - User's parameters
 * @returns Complete nutrition results
 */
export function calculateNutrition(params: NutritionParams): NutritionResults {
  const bmr = calculateBMR(params);
  const tdee = calculateTDEE(bmr, params.activityLevel);
  const calories = calculateCalorieTarget(tdee, params.goal);
  const macros = calculateMacros(calories);

  return {
    bmr: Math.round(bmr),
    tdee,
    calories,
    macros,
  };
}

/**
 * Validate nutrition parameters
 * @param params - Parameters to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateNutritionParams(
  params: Partial<NutritionParams>
): string[] {
  const errors: string[] = [];

  if (!params.age || params.age < 13 || params.age > 120) {
    errors.push('Age must be between 13 and 120 years');
  }

  if (!params.height || params.height < 100 || params.height > 250) {
    errors.push('Height must be between 100 and 250 cm');
  }

  if (!params.weight || params.weight < 30 || params.weight > 300) {
    errors.push('Weight must be between 30 and 300 kg');
  }

  if (!params.gender || !['male', 'female'].includes(params.gender)) {
    errors.push('Gender must be specified');
  }

  if (
    !params.activityLevel ||
    !Object.keys(ACTIVITY_MULTIPLIERS).includes(params.activityLevel)
  ) {
    errors.push('Activity level must be specified');
  }

  if (!params.goal || !['maintain', 'lose', 'gain'].includes(params.goal)) {
    errors.push('Goal must be specified');
  }

  return errors;
}
