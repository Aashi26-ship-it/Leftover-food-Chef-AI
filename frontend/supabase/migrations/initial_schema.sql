/*
# SmartSpoon Initial Database Schema

Creates the core tables for the AI kitchen assistant:

1. New Tables
- `ingredients`: Pantry inventory tracking with name, category, quantity, expiry dates, and images
- `recipes`: Recipe collection with ingredients, instructions, nutrition info, and metadata
- `shopping_items`: Shopping list items with categories, quantities, prices, and checked status
- `meal_plans`: Weekly meal planning with references to recipes for each day/meal

2. Security
- Enable RLS on all tables.
- Allow public CRUD access (anon + authenticated) since this is a single-tenant demo app.
- All data is intentionally shared/public for demonstration purposes.

3. Important Notes
- Uses `gen_random_uuid()` for primary keys.
- Timestamps use `timestamptz` with `now()` default.
- Foreign key constraints ensure data integrity between recipes and meal plans.
- Categories are stored as text for flexibility.
*/

-- Ingredients table (pantry inventory)
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL,
  expiry_days integer NOT NULL DEFAULT 7,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  prep_time integer NOT NULL DEFAULT 0,
  cook_time integer NOT NULL DEFAULT 0,
  servings integer NOT NULL DEFAULT 1,
  difficulty text NOT NULL DEFAULT 'Easy',
  calories integer NOT NULL DEFAULT 0,
  protein integer DEFAULT 0,
  carbs integer DEFAULT 0,
  fat integer DEFAULT 0,
  fiber integer DEFAULT 0,
  ingredients jsonb NOT NULL DEFAULT '[]',
  instructions jsonb NOT NULL DEFAULT '[]',
  tags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shopping items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  quantity text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  checked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date date NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  recipe_id uuid REFERENCES recipes(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(week_start_date, day_of_week, meal_type)
);

-- Enable RLS on all tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Ingredients policies (public access for demo)
DROP POLICY IF EXISTS "anon_select_ingredients" ON ingredients;
CREATE POLICY "anon_select_ingredients" ON ingredients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ingredients" ON ingredients;
CREATE POLICY "anon_insert_ingredients" ON ingredients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ingredients" ON ingredients;
CREATE POLICY "anon_update_ingredients" ON ingredients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ingredients" ON ingredients;
CREATE POLICY "anon_delete_ingredients" ON ingredients FOR DELETE
  TO anon, authenticated USING (true);

-- Recipes policies (public access for demo)
DROP POLICY IF EXISTS "anon_select_recipes" ON recipes;
CREATE POLICY "anon_select_recipes" ON recipes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recipes" ON recipes;
CREATE POLICY "anon_insert_recipes" ON recipes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recipes" ON recipes;
CREATE POLICY "anon_update_recipes" ON recipes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recipes" ON recipes;
CREATE POLICY "anon_delete_recipes" ON recipes FOR DELETE
  TO anon, authenticated USING (true);

-- Shopping items policies (public access for demo)
DROP POLICY IF EXISTS "anon_select_shopping_items" ON shopping_items;
CREATE POLICY "anon_select_shopping_items" ON shopping_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shopping_items" ON shopping_items;
CREATE POLICY "anon_insert_shopping_items" ON shopping_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_shopping_items" ON shopping_items;
CREATE POLICY "anon_update_shopping_items" ON shopping_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_shopping_items" ON shopping_items;
CREATE POLICY "anon_delete_shopping_items" ON shopping_items FOR DELETE
  TO anon, authenticated USING (true);

-- Meal plans policies (public access for demo)
DROP POLICY IF EXISTS "anon_select_meal_plans" ON meal_plans;
CREATE POLICY "anon_select_meal_plans" ON meal_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meal_plans" ON meal_plans;
CREATE POLICY "anon_insert_meal_plans" ON meal_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meal_plans" ON meal_plans;
CREATE POLICY "anon_update_meal_plans" ON meal_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meal_plans" ON meal_plans;
CREATE POLICY "anon_delete_meal_plans" ON meal_plans FOR DELETE
  TO anon, authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category);
CREATE INDEX IF NOT EXISTS idx_shopping_items_checked ON shopping_items(checked);
CREATE INDEX IF NOT EXISTS idx_meal_plans_week ON meal_plans(week_start_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_recipe ON meal_plans(recipe_id);