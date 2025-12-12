import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload, isLoading, error }) => {
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
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-display text-white mb-6">
          Welcome to <span className="gradient-text">Aura</span>
        </h2>
        <p className="text-subheading text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Upload your financial data to unlock AI-powered insights and autonomous treasury analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-strong rounded-3xl p-12"
      >
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 card-hover
            ${isDragActive 
              ? 'border-primary-500 bg-primary-500/10 shadow-2xl' 
              : 'border-gray-600/50 hover:border-primary-500/50 hover:bg-primary-500/5'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0 }}
            className="w-20 h-20 mx-auto mb-8 gradient-bg rounded-2xl flex items-center justify-center shadow-xl"
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>

          <h3 className="text-heading text-white mb-6">
            {isLoading ? 'Processing Your Data...' : 'Drop your Excel file here'}
          </h3>
          
          <p className="text-body text-gray-300 mb-8 max-w-md mx-auto">
            {isLoading 
              ? 'Our AI is analyzing your financial data' 
              : 'or click to browse files'
            }
          </p>

          <div className="flex items-center justify-center space-x-3 text-caption">
            <FileSpreadsheet className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500">Supports .xlsx files</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-semibold text-lg">Upload Error</p>
              <p className="text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {!error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 glass rounded-2xl card-hover">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-subheading text-white mb-3">Smart Processing</h4>
              <p className="text-body text-gray-400">
                AI automatically detects and processes your financial data
              </p>
            </div>
            
            <div className="text-center p-6 glass rounded-2xl card-hover">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-subheading text-white mb-3">Real-time Analysis</h4>
              <p className="text-body text-gray-400">
                Get instant insights and KPI calculations
              </p>
            </div>
            
            <div className="text-center p-6 glass rounded-2xl card-hover">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-subheading text-white mb-3">Proactive Alerts</h4>
              <p className="text-body text-gray-400">
                AI identifies risks and opportunities automatically
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FileUpload;
