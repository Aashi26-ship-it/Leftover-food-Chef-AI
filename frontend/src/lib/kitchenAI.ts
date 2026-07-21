// Frontend-only "Leftover Food Chef AI" logic.
// Everything here runs entirely in the browser with no backend calls.
// This exists so the UI is fully demoable now; a backend/AI teammate can
// later swap these pure functions for real API calls without touching
// any component markup — the function signatures are the contract.

export interface PantryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: number;
  image: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  time: number;
  calories: number;
  servings: number;
  difficulty: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  nutrition: { protein: number; carbs: number; fat: number; fiber: number };
}

export interface RecipeMatch {
  haveCount: number;
  totalCount: number;
  matchPercent: number;
  have: string[];
  missing: string[];
}

// Common substitute suggestions, keyed by lowercase ingredient name.
// This is a static starter dictionary — swap for a real model/lookup later.
export const SUBSTITUTES: Record<string, string[]> = {
  butter: ['Olive oil', 'Margarine', 'Coconut oil'],
  cream: ['Greek Yogurt', 'Whole milk + cornstarch', 'Evaporated milk'],
  'greek yogurt': ['Sour cream', 'Plain yogurt', 'Cottage cheese (blended)'],
  garlic: ['Garlic powder', 'Shallots', 'Asafoetida (a pinch)'],
  'soy sauce': ['Tamari', 'Worcestershire sauce', 'Coconut aminos'],
  ginger: ['Ground ginger', 'Allspice (small amount)'],
  'sesame oil': ['Peanut oil', 'Olive oil (different flavor)'],
  lemon: ['Lime', 'White wine vinegar (small amount)'],
  cucumber: ['Zucchini', 'Celery'],
  bread: ['Tortilla', 'Pita', 'Crackers'],
  pasta: ['Rice', 'Zucchini noodles', 'Any short pasta shape'],
  'olive oil': ['Vegetable oil', 'Avocado oil', 'Butter'],
  'feta cheese': ['Goat cheese', 'Ricotta salata', 'Cheddar Cheese'],
};

export function getSubstitutes(ingredientName: string): string[] {
  return SUBSTITUTES[ingredientName.toLowerCase()] ?? [];
}

const normalize = (s: string) => s.trim().toLowerCase();

/** How well does the current pantry cover this recipe's ingredient list? */
export function matchRecipe(recipe: Recipe, pantryItems: PantryItem[]): RecipeMatch {
  const pantryNames = new Set(pantryItems.map((p) => normalize(p.name)));
  const have: string[] = [];
  const missing: string[] = [];

  for (const ing of recipe.ingredients) {
    if (pantryNames.has(normalize(ing))) {
      have.push(ing);
    } else {
      missing.push(ing);
    }
  }

  const totalCount = recipe.ingredients.length;
  const haveCount = have.length;
  const matchPercent = totalCount === 0 ? 0 : Math.round((haveCount / totalCount) * 100);

  return { haveCount, totalCount, matchPercent, have, missing };
}

/** Ingredients that will expire soon and should be prioritized. */
export function getExpiringSoon(pantryItems: PantryItem[], thresholdDays = 4): PantryItem[] {
  return pantryItems
    .filter((item) => item.expiry <= thresholdDays)
    .sort((a, b) => a.expiry - b.expiry);
}

/**
 * The core "AI suggestion" mock: ranks recipes by how well they use up
 * what's already in the pantry, weighted toward ingredients expiring soon.
 * Higher score = better suggestion.
 */
export function rankRecipesForPantry(recipes: Recipe[], pantryItems: PantryItem[]) {
  const expiringNames = new Set(getExpiringSoon(pantryItems).map((i) => normalize(i.name)));

  return recipes
    .map((recipe) => {
      const match = matchRecipe(recipe, pantryItems);
      const usesExpiring = recipe.ingredients.filter((ing) => expiringNames.has(normalize(ing))).length;
      // Weight: mostly the match percent, with a bonus per expiring ingredient used.
      const score = match.matchPercent + usesExpiring * 15;
      return { recipe, match, usesExpiring, score };
    })
    .sort((a, b) => b.score - a.score);
}
export async function generateAIRecipe(ingredients: string[]) {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "https://leftover-food-chef-ai-production.up.railway.app").replace(/\/$/, '');

  try {
    const response = await fetch(
      `${apiBaseUrl}/agent-recipe?ingredients=${encodeURIComponent(ingredients.join(","))}`
    );

    if (!response.ok) {
      const errorBody: unknown = await response.json().catch(() => null);
      const detail = typeof errorBody === 'object' && errorBody !== null && 'detail' in errorBody && typeof errorBody.detail === 'string'
        ? errorBody.detail
        : `Request failed with status ${response.status}.`;
      throw new Error(detail);
    }

    const data = await response.json();

    if (!data || typeof data.recipe !== "string") {
      throw new Error("Invalid backend response: 'recipe' content was missing or empty.");
    }

    return data.recipe;
  } catch (error) {
    console.error("Error in generateAIRecipe:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected network error occurred while generating your recipe.");
  }
}
