import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, X, AlertCircle, UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '../components/PremiumUI';
https://images.pexels.com/photos/161514/pexels-photo-161514.jpeg?auto=compress&cs=tinysrgb&w=300
type Freshness = 'fresh' | 'warning' | 'expired';
type Category = 'all' | 'Meat' | 'Vegetables' | 'Dairy' | 'Seafood';

interface Ingredient {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: number;
  image: string;
}

const ingredients: Ingredient[] = [
  { id: 1, name: 'Chicken Breast', category: 'Meat', quantity: 2, unit: 'lbs', expiry: 3, image: 'https://images.pexels.com/photos/5769373/pexels-photo-5769373.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 2, name: 'Broccoli', category: 'Vegetables', quantity: 1, unit: 'head', expiry: 5, image: 'https://images.pexels.com/photos/3727689/pexels-photo-3727689.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 3, name: 'Milk', category: 'Dairy', quantity: 1, unit: 'gallon', expiry: 7, image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 4, name: 'Eggs', category: 'Dairy', quantity: 12, unit: 'eggs', expiry: 14, image: 'https://images.pexels.com/photos/12969328/pexels-photo-12969328.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 5, name: 'Tomatoes', category: 'Vegetables', quantity: 4, unit: 'pieces', expiry: 2, image: 'https://images.pexels.com/photos/7522774/pexels-photo-7522774.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 6, name: 'Greek Yogurt', category: 'Dairy', quantity: 2, unit: 'cups', expiry: 10, image: 'https://images.pexels.com/photos/29516115/pexels-photo-29516115.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 7, name: 'Salmon Fillet', category: 'Seafood', quantity: 1, unit: 'lb', expiry: 1, image: 'https://images.pexels.com/photos/5014596/pexels-photo-5014596.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 8, name: 'Spinach', category: 'Vegetables', quantity: 1, unit: 'bag', expiry: 4, image: 'https://images.pexels.com/photos/19957370/pexels-photo-19957370.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 9, name: 'Cheddar Cheese', category: 'Dairy', quantity: 8, unit: 'oz', expiry: 30, image: 'https://images.pexels.com/photos/6004715/pexels-photo-6004715.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 10, name: 'Bell Peppers', category: 'Vegetables', quantity: 3, unit: 'pieces', expiry: 6, image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

function getFreshness(days: number): Freshness {
  if (days < 3) return 'expired';
  if (days < 7) return 'warning';
  return 'fresh';
}

function FreshnessBadge({ days }: { days: number }) {
  const freshness = getFreshness(days);
  const config = {
    fresh: {
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle,
      text: 'Fresh',
    },
    warning: {
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: Clock,
      text: 'Use Soon',
    },
    expired: {
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      icon: AlertTriangle,
      text: 'Expiring',
    },
  };

  const { color, icon: Icon, text } = config[freshness];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}

function AddIngredientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-emerald-500 to-teal-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Ingredient</h3>
                  <p className="text-white/80 text-sm">Track what's in your kitchen</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chicken Breast"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                    <option>lbs</option>
                    <option>pieces</option>
                    <option>cups</option>
                    <option>oz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                  <option>Vegetables</option>
                  <option>Meat</option>
                  <option>Dairy</option>
                  <option>Seafood</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Days Until Expiry
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="7"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add to Pantry
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IngredientCard({ ingredient, onClick }: { ingredient: Ingredient; onClick?: () => void }) {
  const freshness = getFreshness(ingredient.expiry);
  const isHovered = useState(false);
  const [hovered, setHovered] = isHovered;

  const progressWidth = Math.min(100, (ingredient.expiry / 30) * 100);
  const progressColor = freshness === 'fresh' ? 'bg-emerald-500' : freshness === 'warning' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800">
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          <motion.img
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            src={ingredient.image}
            alt={ingredient.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Freshness badge */}
          <div className="absolute top-3 right-3">
            <FreshnessBadge days={ingredient.expiry} />
          </div>

          {/* Category */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
            {ingredient.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {ingredient.name}
          </h3>

          {/* Quantity and Expiry */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {ingredient.quantity} {ingredient.unit}
            </p>
            <div className="flex items-center gap-1.5">
              {freshness === 'expired' && <AlertCircle className="w-4 h-4 text-red-500" />}
              <Clock className="w-4 h-4 text-gray-400" />
              <span
                className={`text-sm font-medium ${
                  freshness === 'expired'
                    ? 'text-red-500'
                    : freshness === 'warning'
                    ? 'text-amber-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {ingredient.expiry} days
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`h-full rounded-full ${progressColor}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Pantry() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || ing.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories: Category[] = ['all', 'Meat', 'Vegetables', 'Dairy', 'Seafood'];

  const stats = {
    total: ingredients.length,
    warning: ingredients.filter((i) => getFreshness(i.expiry) === 'warning').length,
    expired: ingredients.filter((i) => getFreshness(i.expiry) === 'expired').length,
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4"
          >
            <UtensilsCrossed className="w-4 h-4" />
            My Pantry
          </motion.span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Pantry Inventory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Track your ingredients, monitor freshness, and never let food go to waste
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { value: stats.total, label: 'Total Items', color: 'from-emerald-500 to-teal-500' },
            { value: stats.warning, label: 'Expiring Soon', color: 'from-amber-500 to-orange-500' },
            { value: stats.expired, label: 'Need Action', color: 'from-red-500 to-rose-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-card hover:shadow-card-hover transition-all text-center"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your pantry..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Ingredients Grid */}
        {filteredIngredients.length === 0 ? (
          <EmptyState
            title="No ingredients found"
            description="Start tracking your pantry items to never waste food again"
            icon={<UtensilsCrossed className="w-16 h-16 text-gray-300 dark:text-gray-600" />}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredIngredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Floating Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center z-40 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all"
          aria-label="Add ingredient"
        >
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Plus className="w-7 h-7" />
          </motion.div>
        </motion.button>

        <AddIngredientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
