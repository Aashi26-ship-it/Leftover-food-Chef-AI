import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Logo } from './Logo';

const footerLinks = {
  Product: [
    { name: 'Features', path: '/#features' },
    { name: 'Pantry', path: '/pantry' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Meal Planner', path: '/planner' },
  ],
  Company: [
    { name: 'About Us', path: '#' },
    { name: 'Blog', path: '#' },
    { name: 'Careers', path: '#' },
    { name: 'Press', path: '#' },
  ],
  Support: [
    { name: 'Help Center', path: '#' },
    { name: 'Contact', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/50 to-transparent dark:from-emerald-900/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo size="lg" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              AI-powered kitchen assistant that helps you cook smarter, reduce waste, and eat better.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 SmartSpoon. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for a sustainable future
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
