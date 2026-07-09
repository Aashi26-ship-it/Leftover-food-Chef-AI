import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Flame,
  Users,
  ChevronRight,
  X,
  Star,
  Sparkles,
  Filter,
  Heart,
  Timer,
  ChefHat,
} from 'lucide-react';
import { EmptyState } from '../components/PremiumUI';
import { recipes as rawRecipes } from '../data';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type DifficultyFilter = 'all' | Difficulty;

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  time: number;
  calories: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  ingredients: string[];
  steps: string[];
  nutrition: { protein: number; carbs: number; fat: number; fiber: number };
  missing: string[];
}

const recipes = rawRecipes as Recipe[];

function RecipeModal({
  recipe,
  isOpen,
  onClose,
}: {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden my-8"
          >
            {/* Header Image */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {recipe.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/90 text-white backdrop-blur-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{recipe.name}</h2>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              {[
                { icon: Timer, label: `${recipe.time} min`, color: 'text-orange-500' },
                { icon: Flame, label: `${recipe.calories} cal`, color: 'text-red-500' },
                { icon: Users, label: `${recipe.servings} servings`, color: 'text-emerald-500' },
                { icon: ChefHat, label: recipe.difficulty, color: 'text-purple-500' },
              ].map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-r last:border-r-0 border-gray-100 dark:border-gray-700"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="p-6 lg:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{recipe.description}</p>

              {/* Missing Ingredients Alert */}
              {recipe.missing.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Missing Ingredients
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.missing.map((ing, i) => (
                      <motion.span
                        key={ing}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="px-3 py-1.5 rounded-full text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium"
                      >
                        + {ing}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  Ingredients
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {recipe.ingredients.map((ing, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{ing}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recipe Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Timer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </span>
                  Instructions
                </h3>
                <div className="space-y-4">
                  {recipe.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex gap-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                      >
                        <span className="text-sm font-bold text-white">{i + 1}</span>
                      </motion.div>
                      <div className="flex-1 pt-2">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </span>
                  Nutrition per Serving
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(recipe.nutrition).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-center"
                    >
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}g</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{key}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
              >
                Start Cooking
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    Easy: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.3, 1] } : undefined}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </motion.div>
          </motion.button>

          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-semibold">4.8</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {recipe.name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                {recipe.time}m
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500" />
                {recipe.calories}
              </span>
            </div>

            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-sm"
            >
              <span>View</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Recipes() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase()) ||
                          recipe.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  const difficulties: DifficultyFilter[] = ['all', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium mb-4"
          >
            <ChefHat className="w-4 h-4" />
            AI-Curated Recipes
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Smart Recipes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover delicious recipes tailored to your pantry ingredients and dietary preferences
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes, tags, ingredients..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <span className="flex items-center gap-2 text-gray-400 px-2">
              <Filter className="w-5 h-5" />
            </span>
            {difficulties.map((diff) => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(diff)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  difficulty === diff
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredRecipes.length}</span> recipes
          </p>
        </motion.div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <EmptyState
            title="No recipes found"
            description="Try adjusting your search or filters to find more recipes"
            icon={<ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600" />}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setShowModal(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <RecipeModal
          recipe={selectedRecipe}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}
