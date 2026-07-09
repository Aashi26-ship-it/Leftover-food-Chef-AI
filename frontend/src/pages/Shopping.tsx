import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  ShoppingCart,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '../components/PremiumUI';

interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  price: number;
  checked: boolean;
}

const initialItems: ShoppingItem[] = [
  { id: 1, name: 'Pasta', category: 'Dry Goods', quantity: '1 lb', price: 2.99, checked: false },
  { id: 2, name: 'Olive Oil', category: 'Pantry', quantity: '1 bottle', price: 8.99, checked: false },
  { id: 3, name: 'Garlic', category: 'Produce', quantity: '1 head', price: 0.99, checked: true },
  { id: 4, name: 'Soy Sauce', category: 'Asian', quantity: '1 bottle', price: 4.99, checked: false },
  { id: 5, name: 'Ginger', category: 'Produce', quantity: '2 oz', price: 1.49, checked: false },
  { id: 6, name: 'Sesame Oil', category: 'Asian', quantity: '1 bottle', price: 6.99, checked: false },
  { id: 7, name: 'Butter', category: 'Dairy', quantity: '1 stick', price: 2.49, checked: true },
  { id: 8, name: 'Bread', category: 'Bakery', quantity: '1 loaf', price: 3.99, checked: false },
  { id: 9, name: 'Lemon', category: 'Produce', quantity: '3 pieces', price: 1.99, checked: false },
  { id: 10, name: 'Cucumber', category: 'Produce', quantity: '2 pieces', price: 1.49, checked: true },
];

const categories = ['Produce', 'Dairy', 'Pantry', 'Dry Goods', 'Asian', 'Bakery'];

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
}

function ShoppingItemCard({ item, onToggle, onDelete }: ShoppingItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      whileHover={{ x: 4 }}
      onClick={onToggle}
      className="group cursor-pointer"
    >
      <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        item.checked
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg'
      }`}>
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{ scale: item.checked ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {item.checked ? (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center group-hover:border-emerald-400 transition-colors" />
            )}
          </motion.div>
        </motion.button>

        {/* Item info */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate transition-all ${
            item.checked
              ? 'text-gray-400 dark:text-gray-500 line-through'
              : 'text-gray-900 dark:text-white'
          }`}>
            {item.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.quantity}
          </p>
        </div>

        {/* Price */}
        <div className="text-right pr-2">
          <p className={`font-semibold ${
            item.checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
          }`}>
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function Shopping() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;
  const totalCost = items.reduce((sum, item) => sum + item.price, 0);
  const remainingCost = items.filter(i => !i.checked).reduce((sum, item) => sum + item.price, 0);

  const itemsByCategory = categories.reduce((acc, cat) => {
    const categoryItems = items.filter((item) => item.category === cat);
    if (categoryItems.length > 0) acc[cat] = categoryItems;
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium mb-4"
          >
            <ShoppingBag className="w-4 h-4" />
            Shopping List
          </motion.span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping List
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Auto-generated from your meal plan. Check off items as you shop!
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-card p-6">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <ShoppingCart className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {checkedCount} of {items.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    items checked off
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${remainingCost.toFixed(2)}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative mt-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              <p className="mt-2 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {progress}% Complete
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-3 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            Download List
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-4 px-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setItems([])}
            className="py-4 px-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Shopping Items by Category */}
        {items.length === 0 ? (
          <EmptyState
            title="Your list is empty"
            description="Start adding items or generate from your meal plan"
            icon={<ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600" />}
          />
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {Object.entries(itemsByCategory).map(([category, categoryItems], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: catIndex * 0.05 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      {category}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      {categoryItems.filter(i => i.checked).length}/{categoryItems.length} checked
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {categoryItems.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          item={item}
                          onToggle={() => toggleItem(item.id)}
                          onDelete={() => deleteItem(item.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
