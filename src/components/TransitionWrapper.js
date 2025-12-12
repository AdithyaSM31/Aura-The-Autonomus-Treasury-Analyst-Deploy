import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const TransitionWrapper = ({ children, isVisible }) => {
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setShowTransition(true);
      
      // Transition steps
      const steps = [
        { delay: 0, text: "Welcome to Aura", icon: Sparkles },
        { delay: 1500, text: "Initializing AI Engine", icon: CheckCircle },
        { delay: 3000, text: "Loading Dashboard", icon: ArrowRight },
        { delay: 4500, text: "Ready!", icon: CheckCircle }
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setTransitionStep(index);
        }, step.delay);
      });

      // Hide transition after completion
      setTimeout(() => {
        setShowTransition(false);
      }, 6000);
    }
  }, [isVisible]);

  return (
    <>
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center"
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-bold text-white mb-4"
              >
                Aura
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-purple-300 mb-12"
              >
                Treasury Analyst
              </motion.p>

              {/* Progress Steps */}
              <div className="space-y-4">
                {[
                  { text: "Welcome to Aura", icon: Sparkles },
                  { text: "Initializing AI Engine", icon: CheckCircle },
                  { text: "Loading Dashboard", icon: ArrowRight },
                  { text: "Ready!", icon: CheckCircle }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ 
                      opacity: transitionStep >= index ? 1 : 0.3,
                      x: transitionStep >= index ? 0 : -50,
                      scale: transitionStep === index ? 1.05 : 1
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-center space-x-3 px-6 py-3 rounded-xl ${
                      transitionStep >= index 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    <step.icon className={`w-5 h-5 ${
                      transitionStep > index ? 'text-green-400' : 
                      transitionStep === index ? 'text-purple-400' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{step.text}</span>
                    {transitionStep > index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </motion.div>

              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-6 text-gray-300 text-sm"
              >
                Preparing your personalized experience...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible && !showTransition ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default TransitionWrapper;
