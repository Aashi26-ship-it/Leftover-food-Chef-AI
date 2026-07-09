import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-card ${
        hover ? 'cursor-pointer hover:shadow-card-hover' : ''
      } ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-orange-500/5 pointer-events-none" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function StatCard({
  value,
  label,
  icon: Icon,
  color = 'emerald',
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  color?: 'emerald' | 'orange' | 'blue' | 'purple';
}) {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card hover:shadow-card-hover border border-gray-100 dark:border-gray-700"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-10 rounded-bl-full`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} text-white mb-4 shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  color = 'emerald',
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color?: 'emerald' | 'orange' | 'teal' | 'cyan';
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-500' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-500' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', gradient: 'from-teal-500' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', gradient: 'from-cyan-500' },
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card hover:shadow-card-hover border border-gray-100 dark:border-gray-700"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color].gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors[color].bg} ${colors[color].text} mb-5 transition-transform group-hover:scale-110`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
