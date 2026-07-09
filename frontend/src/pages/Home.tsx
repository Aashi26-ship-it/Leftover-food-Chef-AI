import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  ShoppingCart,
  BarChart3,
  Leaf,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  ChefHat,
  Play,
} from 'lucide-react';
import { FeatureCard, StatCard } from '../components/GlassCard';
import { AIChefMascot } from '../components/AIChefMascot';
import { FloatingBackground, ShimmerText } from '../components/PremiumUI';
import { testimonials, stats } from '../data';

const features = [
  { title: 'AI Pantry', description: 'Smart inventory tracking with expiry alerts and freshness indicators', icon: Sparkles, color: 'emerald' as const },
  { title: 'Smart Recipes', description: 'AI suggests recipes based on your available ingredients', icon: UtensilsCrossed, color: 'orange' as const },
  { title: 'Meal Planner', description: 'Plan your week with balanced, delicious meals', icon: Calendar, color: 'teal' as const },
  { title: 'Shopping List', description: 'Auto-generated lists from your meal plans', icon: ShoppingCart, color: 'cyan' as const },
  { title: 'Nutrition Insights', description: 'Track calories, macros, and dietary goals', icon: BarChart3, color: 'emerald' as const },
  { title: 'Reduce Waste', description: 'Save money and help the environment', icon: Leaf, color: 'orange' as const },
];

const statIcons = { Users, DollarSign, ChefHat, Star };

export function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="overflow-hidden">
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6 border border-emerald-200/50 dark:border-emerald-700/50"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                AI-Powered Kitchen Assistant
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
                Turn Leftovers into{' '}
                <span className="relative inline-block">
                  <ShimmerText>Delicious Meals</ShimmerText>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.path
                      d="M2 8 Q 75 2 150 6 T 298 4"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>{' '}
                with AI
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
                SmartSpoon helps you reduce food waste, save money, and cook amazing meals with what you already have in your kitchen.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/pantry"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden"
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-teal-400" />

                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                    />

                    {/* Animated shimmer */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <span className="relative flex items-center gap-2">
                      Get Started Free
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/recipes"
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200"
                  >
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </Link>
                </motion.div>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-emerald-400 to-teal-400"
                      />
                    ))}
                  </div>
                  <span>50,000+ users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                  <span className="ml-1 font-semibold">4.9 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image / AI Chef Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              {/* Central mascot */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <AIChefMascot size="lg" className="relative z-10" />

                {/* Floating Food Cards */}

                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 w-28 sm:w-32 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white"
                >
                  <img
                    src="https://images.pexels.com/photos/5769373/pexels-photo-5769373.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Fresh chicken breast"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/3 right-2 w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white"
                >
                  <img
                    src="https://images.pexels.com/photos/20422131/pexels-photo-20422131.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Pizza"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-10 w-40 sm:w-40 h-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white"
                >
                  <img
                    src="https://images.pexels.com/photos/37233498/pexels-photo-37233498.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Mediterranean Chicken Bowl"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -left-8 w-24 sm:w-28 h-24 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white"
                >
                  <img
                    src="https://images.pexels.com/photos/4252133/pexels-photo-4252133.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Broccoli"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 right-6 w-28 sm:w-32 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white"
                >
                  <img
                    src="https://images.pexels.com/photos/37219215/pexels-photo-37219215.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Dessert"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Decorative Rings */}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-200/40 dark:border-emerald-700/30"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-14 rounded-full border border-orange-200/30 dark:border-orange-700/20"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Features
            </motion.span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <ShimmerText>Cook Smarter</ShimmerText>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From pantry management to meal planning, SmartSpoon has all the tools to transform your kitchen experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = statIcons[stat.icon as keyof typeof statIcons];
              const colors = ['emerald', 'orange', 'blue', 'purple'] as const;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <StatCard value={stat.value} label={stat.label} icon={Icon} color={colors[i]} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Home Cooks Everywhere
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See what our community has to say about SmartSpoon
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-emerald-100 dark:text-emerald-900/50 font-serif leading-none">"</div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + j * 0.1 }}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">{testimonial.text}</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/50"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }} />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm"
            />
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-8 left-8 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm"
            />

            <div className="relative text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <AIChefMascot size="sm" animate={false} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Cook Smarter?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of home cooks who are saving money, reducing waste, and enjoying delicious meals with SmartSpoon.
              </p>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/pantry"
                  className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-emerald-600 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
