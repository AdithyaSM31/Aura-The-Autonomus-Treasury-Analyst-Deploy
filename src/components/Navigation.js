import React from 'react';
import { motion } from 'framer-motion';

const Navigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <motion.nav 
      className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-20 z-40"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex space-x-2 py-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                    layoutId="activeTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
