import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  TrendingUp, 
  DollarSign,
  Shield,
  Zap,
  Star,
  Target
} from 'lucide-react';

const Footer = () => {
  const icons = [
    { icon: Heart, color: 'text-red-400', delay: 0 },
    { icon: Sparkles, color: 'text-yellow-400', delay: 0.2 },
    { icon: TrendingUp, color: 'text-green-400', delay: 0.4 },
    { icon: DollarSign, color: 'text-blue-400', delay: 0.6 },
    { icon: Shield, color: 'text-purple-400', delay: 0.8 },
    { icon: Zap, color: 'text-orange-400', delay: 1.0 },
    { icon: Star, color: 'text-pink-400', delay: 1.2 },
    { icon: Target, color: 'text-indigo-400', delay: 1.4 }
  ];

  return (
    <motion.footer 
      className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-t border-purple-500/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
          />
        ))}
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {[...Array(96)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-purple-400/20"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.02
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">Aura</h3>
                  <p className="text-purple-300 text-sm">The Autonomous Treasury Analyst</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering businesses with AI-driven financial insights and autonomous treasury management.
              </p>
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-white">Key Features</h4>
              <div className="space-y-2">
                {[
                  "Real-time Financial Analysis",
                  "AI-Powered Risk Detection", 
                  "Executive Dashboard",
                  "Automated Reporting"
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-2 text-gray-300 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-white">Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Analysis Accuracy", value: "98.5%" },
                  { label: "Avg Processing", value: "<2s" },
                  { label: "System Uptime", value: "99.8%" },
                  { label: "Data Points", value: "1M+" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-3 bg-white/5 rounded-lg border border-purple-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Animated Icon Row */}
          <motion.div 
            className="flex justify-center space-x-8 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {icons.map(({ icon: Icon, color, delay }, index) => (
              <motion.div
                key={index}
                className={`p-3 bg-white/5 rounded-full border border-purple-500/20 ${color}`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay
                }}
                whileHover={{
                  scale: 1.2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <span>Powered by</span>
              <motion.span 
                className="text-purple-400 font-semibold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Advanced AI Technology
              </motion.span>
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-gray-500 text-xs">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </motion.div>
              <span>for Financial Excellence</span>
            </div>

            <div className="text-gray-500 text-xs">
              © 2025 Clutch Gods. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
