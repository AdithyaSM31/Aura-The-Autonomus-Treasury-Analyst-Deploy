import React from 'react';
import { motion } from 'framer-motion';
import { Brain, LogOut, User, Settings, HelpCircle, Mail } from 'lucide-react';

const Header = ({ onSignOut, user }) => {
  return (
    <motion.header 
      className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                animate={{ 
                  rotate: [0, 1, -1, 0],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            
            <div>
              <motion.h1 
                className="text-2xl font-bold text-white tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Aura
              </motion.h1>
              <motion.p 
                className="text-sm text-purple-300 font-light -mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Treasury Analyst
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
              </motion.div>
              
              <motion.button
                onClick={onSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
