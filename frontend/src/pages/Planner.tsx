import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Flame,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChefHat,
  X,
  Trash2,
} from 'lucide-react';
import { recipes as rawRecipes } from '../data';
import { usePantry } from '../context/PantryContext';
import type { MealPlanDay } from '../context/PantryContext';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  time: number;
  calories: number;
  servings: number;
  difficulty: string;
  tags: string[];
}

const recipes = rawRecipes as Recipe[];

const mealTypeConfig = {
  breakfast: {
    label: 'Breakfast',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
  },
  lunch: {
    label: 'Lunch',
    color: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
  },
  dinner: {
    label: 'Dinner',
    color: 'from-purple-400 to-indigo-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

function MealSlot({
  type,
  recipe,
  onPick,
  onRemove,
}: {
  type: keyof typeof mealTypeConfig;
  recipe: Recipe | null;
  onPick: () => void;
  onRemove: () => void;
}) {
  const config = mealTypeConfig[type];

  return (
    <div className="space-y-2">
      {/* Meal type label */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} ${config.border} border`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`} />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{config.label}</span>
      </div>

      {/* Meal card or empty slot */}
      {recipe ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          onClick={onPick}
          className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all"
        >
          <div className="aspect-[4/3] relative">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-medium line-clamp-1 mb-1">{recipe.name}</p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {recipe.calories}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recipe.time}m
              </span>
            </div>
          </div>

          {/* Remove button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${recipe.name} from ${config.label.toLowerCase()}`}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onPick}
          aria-label={`Add a ${config.label.toLowerCase()} recipe`}
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors bg-gray-50/50 dark:bg-gray-800/30 group"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </motion.div>
          <span className="text-xs text-gray-400 group-hover:text-emerald-500 transition-colors">Add meal</span>
        </motion.button>
      )}
    </div>
  );
}

function DayColumn({
  day,
  meals,
  isToday,
  onPick,
  onRemove,
}: {
  day: string;
  meals: MealPlanDay;
  isToday: boolean;
  onPick: (type: keyof typeof mealTypeConfig) => void;
  onRemove: (type: keyof typeof mealTypeConfig) => void;
}) {
  const dayCalories =
    (meals.breakfast?.calories || 0) +
    (meals.lunch?.calories || 0) +
    (meals.dinner?.calories || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-[140px] sm:min-w-[160px]"
    >
      {/* Day header */}
      <div className={`rounded-xl p-3 mb-4 text-center transition-all ${
        isToday
          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}>
        <p className="text-xs font-medium opacity-80">{meals.day}</p>
        <p className="text-lg font-bold">{day}</p>
        <div className="mt-2 space-y-1">
          <span className={`text-xs ${isToday ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {dayCalories} cal
          </span>
        </div>
      </div>

      {/* Meal slots */}
      <div className="space-y-4">
        <MealSlot type="breakfast" recipe={meals.breakfast} onPick={() => onPick('breakfast')} onRemove={() => onRemove('breakfast')} />
        <MealSlot type="lunch" recipe={meals.lunch} onPick={() => onPick('lunch')} onRemove={() => onRemove('lunch')} />
        <MealSlot type="dinner" recipe={meals.dinner} onPick={() => onPick('dinner')} onRemove={() => onRemove('dinner')} />
      </div>
    </motion.div>
  );
}

function RecipePickerModal({
  isOpen,
  mealType,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  mealType: keyof typeof mealTypeConfig | null;
  onSelect: (recipe: Recipe) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[85vh] bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="relative p-5 sm:p-6 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Choose {mealType ? mealTypeConfig[mealType].label.toLowerCase() : 'a meal'}
                </h3>
                <p className="text-white/80 text-sm">Pick a recipe for this slot</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recipes.map((recipe) => (
                <motion.button
                  key={recipe.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(recipe)}
                  className="text-left rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors group"
                >
                  <div className="aspect-[4/3] relative">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {recipe.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" />{recipe.calories}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{recipe.time}m</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Planner() {
  const { mealPlan: plan, setMealAt, generateRandomPlan } = usePantry();
  const [weekOffset, setWeekOffset] = useState(0);
  const [picker, setPicker] = useState<{ dayIndex: number; type: keyof typeof mealTypeConfig } | null>(null);

  const openPicker = (dayIndex: number, type: keyof typeof mealTypeConfig) => {
    setPicker({ dayIndex, type });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!picker) return;
    setMealAt(picker.dayIndex, picker.type, recipe as unknown as MealPlanDay['breakfast']);
    setPicker(null);
  };

  const handleRemoveMeal = (dayIndex: number, type: keyof typeof mealTypeConfig) => {
    setMealAt(dayIndex, type, null);
  };

  const handleGeneratePlan = () => {
    generateRandomPlan();
  };

  // Calculate week dates
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    const dates: number[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const todayDate = new Date().getDate();

  // Calculate stats
  const totalCalories = plan.reduce((sum, day) => {
    return sum +
      (day.breakfast?.calories || 0) +
      (day.lunch?.calories || 0) +
      (day.dinner?.calories || 0);
  }, 0);

  const avgCalories = Math.round(totalCalories / 7);
  const mealsPlanned = plan.filter(d => d.breakfast || d.lunch || d.dinner).length * 3;

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4"
            >
              <Calendar className="w-4 h-4" />
              Weekly Planner
            </motion.span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Meal Planner
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Plan your week with balanced, nutritious meals. Let AI suggest the perfect menu.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGeneratePlan}
            className="inline-flex items-center gap-2 px-6 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Generate Plan
          </motion.button>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(
                  new Date().setDate(
                    new Date().getDate() - new Date().getDay() + 1 + weekOffset * 7
                  )
                ).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Avg: <span className="font-bold">{avgCalories}</span> cal/day
              </span>
            </div>
          </div>
        </motion.div>

        {/* Meal Plan Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {plan.map((day, i) => (
            <DayColumn
              key={day.day}
              day={weekDates[i].toString()}
              meals={day}
              isToday={weekDates[i] === todayDate}
              onPick={(type) => openPicker(i, type)}
              onRemove={(type) => handleRemoveMeal(i, type)}
            />
          ))}
        </motion.div>

        <RecipePickerModal
          isOpen={picker !== null}
          mealType={picker?.type ?? null}
          onSelect={handleSelectRecipe}
          onClose={() => setPicker(null)}
        />

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-card p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              Weekly Nutrition Summary
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Calories', value: totalCalories.toLocaleString(), unit: 'cal', color: 'from-orange-500 to-red-500' },
                { label: 'Meals Planned', value: mealsPlanned.toString(), unit: 'meals', color: 'from-emerald-500 to-teal-500' },
                { label: 'Avg Protein', value: '45', unit: 'g/day', color: 'from-blue-500 to-cyan-500' },
                { label: 'Avg Carbs', value: '180', unit: 'g/day', color: 'from-purple-500 to-pink-500' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center shadow-sm hover:shadow-lg transition-all"
                >
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.unit}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
