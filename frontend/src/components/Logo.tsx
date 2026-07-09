import { motion } from 'framer-motion';

export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg' },
    md: { container: 'w-10 h-10', text: 'text-xl' },
    lg: { container: 'w-14 h-14', text: 'text-2xl' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className={`${sizes[size].container} relative flex items-center justify-center`}
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          {/* Background circle */}
          <circle cx="24" cy="24" r="22" className="fill-emerald-50 dark:fill-emerald-900/30" />

          {/* Main spoon */}
          <motion.path
            d="M20 8C20 8 16 12 16 18C16 22 18 25 21 26L21 42C21 44 23 45 24 45C25 45 27 44 27 42L27 26C30 25 32 22 32 18C32 12 28 8 28 8"
            className="fill-emerald-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Spoon highlight */}
          <path
            d="M22 10C22 10 19 13 19 17C19 19.5 20.5 21.5 22.5 22.5"
            className="stroke-white/40"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Leaf accent */}
          <motion.path
            d="M34 14C34 14 38 10 42 14C42 18 38 22 34 22C30 22 34 14 34 14Z"
            className="fill-emerald-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />

          {/* Leaf vein */}
          <path
            d="M35 16C35 16 37 18 40 17"
            className="stroke-white/60"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Sparkle/circuit dots */}
          <motion.circle
            cx="38"
            cy="26"
            r="2"
            className="fill-orange-400"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
          <motion.circle
            cx="42"
            cy="20"
            r="1.5"
            className="fill-emerald-300"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 1, duration: 0.4 }}
          />

          {/* Circuit line connecting elements */}
          <motion.path
            d="M32 20L36 24L40 24"
            className="stroke-emerald-400"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20"
            initial={{ strokeDashoffset: 20 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </svg>
      </motion.div>

      <span className={`${sizes[size].text} font-bold tracking-tight`}>
        <span className="text-emerald-600 dark:text-emerald-400">Smart</span>
        <span className="text-gray-800 dark:text-white">Spoon</span>
      </span>
    </div>
  );
}

export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="22" className="fill-emerald-50 dark:fill-emerald-900/30" />
        <path
          d="M20 8C20 8 16 12 16 18C16 22 18 25 21 26L21 42C21 44 23 45 24 45C25 45 27 44 27 42L27 26C30 25 32 22 32 18C32 12 28 8 28 8"
          className="fill-emerald-500"
        />
        <path
          d="M22 10C22 10 19 13 19 17C19 19.5 20.5 21.5 22.5 22.5"
          className="stroke-white/40"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M34 14C34 14 38 10 42 14C42 18 38 22 34 22C30 22 34 14 34 14Z"
          className="fill-emerald-400"
        />
        <circle cx="38" cy="26" r="2" className="fill-orange-400" />
        <circle cx="42" cy="20" r="1.5" className="fill-emerald-300" />
        <path
          d="M32 20L36 24L40 24"
          className="stroke-emerald-400"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
