import React from 'react';
import { motion } from 'framer-motion';

const AnimatedAvatar = ({ persona, isSpeaking, size = 'large' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const isCFO = persona === 'CFO';
  const isCEO = persona === 'CEO';

  // Professional business avatars - Using DiceBear API v9 personas style
  const avatarImage = isCFO 
    ? 'https://api.dicebear.com/9.x/personas/svg?seed=CFO&backgroundColor=10b981&radius=50' // CFO - Professional Avatar
    : 'https://api.dicebear.com/9.x/personas/svg?seed=CEO&backgroundColor=9333ea&radius=50'; // CEO - Professional Avatar

  return (
    <div className="relative flex flex-col items-center">
      {/* Professional Avatar with Unsplash Image */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Animated Border Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isCFO 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' 
              : 'bg-gradient-to-br from-purple-500 to-purple-700'
          }`}
          animate={{
            opacity: isSpeaking ? [0.6, 1, 0.6] : 0.8,
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Avatar Image */}
        <div className="absolute inset-1 rounded-full overflow-hidden bg-white">
          <img 
            src={avatarImage}
            alt={persona}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Subtle Professional Glow */}
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isCFO 
              ? 'shadow-emerald-500/20' 
              : 'shadow-purple-500/20'
          } shadow-lg`}
          animate={{
            boxShadow: isSpeaking 
              ? [
                  `0 0 20px ${isCFO ? 'rgba(16, 185, 129, 0.3)' : 'rgba(147, 51, 234, 0.3)'}`,
                  `0 0 30px ${isCFO ? 'rgba(16, 185, 129, 0.4)' : 'rgba(147, 51, 234, 0.4)'}`,
                  `0 0 20px ${isCFO ? 'rgba(16, 185, 129, 0.3)' : 'rgba(147, 51, 234, 0.3)'}`
                ]
              : `0 0 10px ${isCFO ? 'rgba(16, 185, 129, 0.2)' : 'rgba(147, 51, 234, 0.2)'}`
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Professional Speech Indicators */}
        {isSpeaking && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xs text-gray-600 opacity-60"
                animate={{
                  y: [0, -40],
                  x: [0, Math.random() * 20 - 10],
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.4
                }}
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                {['💬', '🗣️', '✨'][i]}
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Clean Professional Name Badge */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md ${
          isCFO 
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' 
            : 'bg-gradient-to-r from-purple-600 to-purple-700'
        }`}>
          {persona}
        </div>
      </motion.div>

      {/* Professional Status Indicator */}
      <motion.div
        className="mt-2 flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isSpeaking ? 'bg-green-500' : 'bg-gray-400'
          }`}
          animate={{
            scale: isSpeaking ? [1, 1.1, 1] : 1,
            opacity: isSpeaking ? [0.8, 1, 0.8] : 0.8,
          }}
          transition={{
            duration: 1,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        <span className="text-xs text-gray-500 font-medium">
          {isSpeaking ? 'Speaking' : 'Online'}
        </span>
      </motion.div>
    </div>
  );
};

export default AnimatedAvatar;
