import { motion } from 'framer-motion';

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Main gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-20 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -30, 10, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/15 to-blue-400/10 rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-8"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-32 h-32 mx-auto mb-8"
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-orange-400/10 blur-2xl" />

        {/* Icon container */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          {icon}
        </div>

        {/* Decorative sparkles */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          className="absolute -bottom-1 -left-2 w-3 h-3 bg-orange-400 rounded-full"
        />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>

      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-card overflow-hidden">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export function GlowButton({
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30',
    secondary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700/50',
    ghost: 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {/* Glow effect */}
      {variant === 'primary' && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 blur-lg -z-10"
        />
      )}
      {children}
    </motion.button>
  );
}

export function ShimmerText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
        {children}
      </span>
    </span>
  );
}
