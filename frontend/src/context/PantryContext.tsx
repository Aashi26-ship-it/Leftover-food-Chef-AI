import { createContext, useContext, useState, ReactNode } from 'react';
import { ingredients as initialIngredients, recipes, shoppingItems as initialShoppingItems } from '../data';
import type { PantryItem } from '../lib/kitchenAI';

export interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  price: number;
  checked: boolean;
}

export interface MealPlanDay {
  day: string;
  breakfast: (typeof recipes)[number] | null;
  lunch: (typeof recipes)[number] | null;
  dinner: (typeof recipes)[number] | null;
}

const initialMealPlan: MealPlanDay[] = [
  { day: 'Mon', breakfast: recipes[3], lunch: null, dinner: recipes[0] },
  { day: 'Tue', breakfast: null, lunch: recipes[1], dinner: recipes[2] },
  { day: 'Wed', breakfast: recipes[3], lunch: recipes[4], dinner: recipes[0] },
  { day: 'Thu', breakfast: null, lunch: recipes[1], dinner: recipes[2] },
  { day: 'Fri', breakfast: recipes[3], lunch: null, dinner: recipes[0] },
  { day: 'Sat', breakfast: recipes[3], lunch: recipes[1], dinner: recipes[2] },
  { day: 'Sun', breakfast: null, lunch: null, dinner: recipes[2] },
];

let nextPantryId = Math.max(...initialIngredients.map((i) => i.id)) + 1;
let nextShoppingId = Math.max(...initialShoppingItems.map((i) => i.id)) + 1;

interface PantryContextValue {
  pantryItems: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  removePantryItem: (id: number) => void;

  mealPlan: MealPlanDay[];
  setMealAt: (dayIndex: number, type: 'breakfast' | 'lunch' | 'dinner', recipe: (typeof recipes)[number] | null) => void;
  generateRandomPlan: () => void;

  shoppingItems: ShoppingItem[];
  toggleShoppingItem: (id: number) => void;
  removeShoppingItem: (id: number) => void;
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  addShoppingItems: (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
  clearShoppingList: () => void;
}

const PantryContext = createContext<PantryContextValue | null>(null);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(initialIngredients);
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(initialMealPlan);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(initialShoppingItems);

  const addPantryItem = (item: Omit<PantryItem, 'id'>) => {
    setPantryItems((prev) => [...prev, { ...item, id: nextPantryId++ }]);
  };

  const removePantryItem = (id: number) => {
    setPantryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const setMealAt = (dayIndex: number, type: 'breakfast' | 'lunch' | 'dinner', recipe: (typeof recipes)[number] | null) => {
    setMealPlan((prev) => prev.map((day, idx) => (idx === dayIndex ? { ...day, [type]: recipe } : day)));
  };

  const generateRandomPlan = () => {
    const randomRecipe = () => recipes[Math.floor(Math.random() * recipes.length)];
    setMealPlan((prev) =>
      prev.map((day) => ({ ...day, breakfast: randomRecipe(), lunch: randomRecipe(), dinner: randomRecipe() }))
    );
  };

  const toggleShoppingItem = (id: number) => {
    setShoppingItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const removeShoppingItem = (id: number) => {
    setShoppingItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    setShoppingItems((prev) => [...prev, { ...item, id: nextShoppingId++, checked: false }]);
  };

  const addShoppingItems = (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
    setShoppingItems((prev) => {
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
      const toAdd = items
        .filter((i) => !existingNames.has(i.name.toLowerCase()))
        .map((i) => ({ ...i, id: nextShoppingId++, checked: false }));
      return [...prev, ...toAdd];
    });
  };

  const clearShoppingList = () => setShoppingItems([]);

  return (
    <PantryContext.Provider
      value={{
        pantryItems,
        addPantryItem,
        removePantryItem,
        mealPlan,
        setMealAt,
        generateRandomPlan,
        shoppingItems,
        toggleShoppingItem,
        removeShoppingItem,
        addShoppingItem,
        addShoppingItems,
        clearShoppingList,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used within a PantryProvider');
  return ctx;
}
