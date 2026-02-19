// material design 3 landing page
"use client";

// import motion for entrance animations
import { motion } from "framer-motion";

// import icons for the feature cards
import { Shield, Brain, TrendingDown } from "lucide-react";

// import Link to navigate to registration
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-28">

      {/* hero section with staggered entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        {/* app name in display style */}
        <h1 className="text-5xl font-bold text-m3-on-surface tracking-tight">
          Zenith
        </h1>

        {/* tagline below the name */}
        <p className="text-m3-on-surface-variant mt-3 text-lg">
          Your AI-powered financial wellness guardian
        </p>

        {/* call to action buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="m3-btn-filled"
            >
              Get Started
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="m3-btn-tonal"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* feature cards section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-3xl w-full"
      >
        {/* feature card 1: spending guardian */}
        <div className="m3-card flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-m3-full bg-m3-primary-container flex items-center justify-center">
            <Shield className="text-m3-on-primary-container" size={24} />
          </div>
          <h3 className="font-semibold text-m3-on-surface">Spending Guardian</h3>
          <p className="text-sm text-m3-on-surface-variant">
            Blocks impulse purchases when stress is high
          </p>
        </div>

        {/* feature card 2: ai insights */}
        <div className="m3-card flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-m3-full bg-m3-tertiary-container flex items-center justify-center">
            <Brain className="text-m3-on-tertiary-container" size={24} />
          </div>
          <h3 className="font-semibold text-m3-on-surface">AI Insights</h3>
          <p className="text-sm text-m3-on-surface-variant">
            Personalized advice based on your mental state
          </p>
        </div>

        {/* feature card 3: stress tracking */}
        <div className="m3-card flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-m3-full bg-m3-secondary-container flex items-center justify-center">
            <TrendingDown className="text-m3-on-secondary-container" size={24} />
          </div>
          <h3 className="font-semibold text-m3-on-surface">Stress Tracking</h3>
          <p className="text-sm text-m3-on-surface-variant">
            Real-time wellness monitoring aligned with UN SDG #3
          </p>
        </div>
      </motion.div>
    </main>
  );
}
