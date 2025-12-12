import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Sparkles, Zap, Shield, Star, Heart, Target, Brain } from 'lucide-react';

const UploadTab = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Processing',
      description: 'AI-powered analysis of any Excel structure',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Instant KPI calculations and insights',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Proactive Alerts',
      description: 'Early warning system for financial risks',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="relative text-center mb-12 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Icons */}
          {[
            { icon: Star, color: 'text-yellow-400', delay: 0 },
            { icon: Heart, color: 'text-red-400', delay: 0.5 },
            { icon: Target, color: 'text-green-400', delay: 1 },
            { icon: Brain, color: 'text-purple-400', delay: 1.5 },
            { icon: Sparkles, color: 'text-blue-400', delay: 2 },
            { icon: Zap, color: 'text-orange-400', delay: 2.5 }
          ].map(({ icon: Icon, color, delay }, i) => (
            <motion.div
              key={i}
              className={`absolute w-4 h-4 ${color} opacity-40`}
              animate={{
                x: [0, 120, 0],
                y: [0, -60, 0],
                rotate: [0, 180, 360],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Upload Your Financial Data
            </motion.h2>
          </div>
          <motion.p 
            className="text-xl text-purple-200 max-w-2xl mx-auto flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
            <span>Drop your Excel file here and let Aura analyze your treasury metrics with world-class precision</span>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        {...getRootProps()}
        className={`
          relative rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
          ${isDragActive 
            ? 'border-2 border-dashed border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20 scale-105 shadow-[0_8px_48px_0_rgba(96,165,250,0.3)]' 
            : 'border-2 border-dashed border-white/20 hover:border-blue-400/60 hover:bg-white/10 hover:shadow-[0_8px_48px_0_rgba(255,255,255,0.15)]'
          }
        `}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <motion.div
          className="mb-8"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Upload className="w-20 h-20 text-blue-400 mx-auto" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop your file here!' : 'Drag & Drop Your Excel File'}
          </h3>
          <div className="text-lg text-purple-200 mb-4">
            or <span className="text-blue-400 font-semibold">browse files</span>
          </div>
          <div className="text-sm text-purple-300">
            Supports .xlsx files up to 10MB
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 text-center group transition-all duration-300 border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_48px_0_rgba(255,255,255,0.15)] hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h4 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-purple-200 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
};

export default UploadTab;
