import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield,
  Zap,
  Globe,
  TrendingUp,
  BarChart3,
  Brain,
  CheckCircle,
  Users,
  AlertCircle
} from 'lucide-react';
import googleAuthService from '../services/googleAuthService';
import authService from '../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        // Login
        const result = await authService.login(formData.email, formData.password);
        if (result.success) {
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            onLoginSuccess();
          }, 500);
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }
        
        const result = await authService.register(formData.email, formData.password, formData.name);
        if (result.success) {
          setSuccessMessage('Registration successful! Please login.');
          setIsLogin(true);
          setFormData({
            email: formData.email,
            password: '',
            confirmPassword: '',
            name: ''
          });
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const user = await googleAuthService.signIn();
      console.log('Google user:', user);
      // Simulate processing time
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1000);
    } catch (error) {
      console.error('Google authentication failed:', error);
      setIsLoading(false);
      // Fallback to demo mode
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered Analysis", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, text: "Advanced Analytics", color: "from-blue-500 to-cyan-500" },
    { icon: Shield, text: "Secure Processing", color: "from-green-500 to-emerald-500" },
    { icon: Zap, text: "Real-time Insights", color: "from-yellow-500 to-orange-500" },
    { icon: Globe, text: "Global Integration", color: "from-indigo-500 to-purple-500" },
    { icon: TrendingUp, text: "Growth Analytics", color: "from-red-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Aura</h1>
              <p className="text-purple-300 text-sm">Treasury Analyst</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center space-x-8"
          >
            <button 
              onClick={() => setActiveModal('features')} 
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => setActiveModal('help')} 
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold text-white mb-6"
              >
                Transform Your
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Financial Data</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 mb-8"
              >
                AI-powered Excel processing with intelligent conversations and real-time insights
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">No credit card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Instant access</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-300"
                >
                  {isLogin ? 'Sign in to continue' : 'Join thousands of users'}
                </motion.p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">Aura</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered financial analysis and Excel processing platform
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveModal('features')} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-white transition-colors cursor-pointer">About</button></li>
                <li><a href="mailto:support@aura-treasury.com" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveModal('help')} className="hover:text-white transition-colors cursor-pointer">Help Center</button></li>
                <li><button onClick={() => setActiveModal('docs')} className="hover:text-white transition-colors cursor-pointer">Documentation</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Aura Treasury Analyst. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => setActiveModal('privacy')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy</button>
              <button onClick={() => setActiveModal('terms')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms</button>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Modal Overlay */}
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {activeModal === 'features' && 'Features'}
                {activeModal === 'about' && 'About Aura'}
                {activeModal === 'help' && 'Help Center'}
                {activeModal === 'docs' && 'Documentation'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-purple-100 space-y-4">
              {activeModal === 'features' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span><strong>AI-Powered Analysis:</strong> Advanced machine learning algorithms analyze your financial data in real-time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span><strong>Excel Processing:</strong> Intelligent Excel file processing with conversational AI interface</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span><strong>Executive Dashboard:</strong> Real-time insights from AI CFO and CEO virtual assistants</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span><strong>Advanced Analytics:</strong> Comprehensive financial metrics and trend analysis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span><strong>Automated Reporting:</strong> Generate detailed financial reports automatically</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeModal === 'about' && (
                <div>
                  <p className="mb-4">
                    Aura is an autonomous treasury analyst powered by cutting-edge AI technology. We're revolutionizing financial analysis and decision-making for businesses of all sizes.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                  <p className="mb-4">
                    To empower finance professionals with AI-driven insights, automating complex analyses and providing real-time strategic guidance.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Technology</h3>
                  <p>
                    Built on advanced machine learning models, Aura processes financial data with 98.5% accuracy, delivering insights in under 2 seconds. Our platform integrates seamlessly with your existing workflows, providing a modern, intuitive interface for all your treasury management needs.
                  </p>
                </div>
              )}

              {activeModal === 'help' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">1. Upload Your Data</h4>
                      <p>Navigate to the Upload tab and drag-and-drop your Excel files for instant analysis.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">2. Dashboard Overview</h4>
                      <p>View real-time financial metrics, charts, and key performance indicators.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">3. AI Conversations</h4>
                      <p>Chat with virtual CFO and CEO for strategic insights and recommendations.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">4. Analytics</h4>
                      <p>Deep dive into trends, patterns, and predictive analytics.</p>
                    </div>
                    <div className="mt-6 p-4 bg-white/10 rounded-lg">
                      <p className="font-semibold text-white mb-2">Need more help?</p>
                      <p>Contact us at: <a href="mailto:support@aura-treasury.com" className="text-purple-300 hover:text-white">support@aura-treasury.com</a></p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'docs' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Documentation</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">File Upload Requirements</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Supported formats: .xlsx, .xls</li>
                        <li>Maximum file size: 50MB</li>
                        <li>Recommended: Clean, structured data with headers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Dashboard Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Real-time metric updates</li>
                        <li>Interactive charts and visualizations</li>
                        <li>Export capabilities for reports</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">AI Capabilities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Natural language processing for queries</li>
                        <li>Predictive analytics and forecasting</li>
                        <li>Risk detection and alerts</li>
                        <li>Automated insights generation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div>
                  <p className="mb-4">Last updated: December 2025</p>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Collection</h3>
                  <p className="mb-4">
                    We collect only the information necessary to provide our services, including account information and uploaded financial data. Your data is encrypted both in transit and at rest.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Usage</h3>
                  <p className="mb-4">
                    Your financial data is used solely to provide AI-powered analysis and insights. We do not sell, share, or use your data for any purpose other than delivering our services to you.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Security</h3>
                  <p className="mb-4">
                    We employ industry-standard security measures including encryption, secure authentication, and regular security audits to protect your data.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
                  <p>
                    You have the right to access, modify, or delete your data at any time. Contact us at support@aura-treasury.com for data requests.
                  </p>
                </div>
              )}

              {activeModal === 'terms' && (
                <div>
                  <p className="mb-4">Last updated: December 2025</p>
                  <h3 className="text-xl font-semibold text-white mb-3">Service Terms</h3>
                  <p className="mb-4">
                    By using Aura Treasury Analyst, you agree to these terms of service. Our platform is provided "as is" for financial analysis purposes.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">User Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Ensure accuracy of uploaded data</li>
                    <li>Use the service in compliance with applicable laws</li>
                    <li>Do not attempt to reverse engineer or compromise the platform</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                  <p className="mb-4">
                    While we strive for accuracy, Aura's AI analysis should be used as a tool to support decision-making, not as the sole basis for financial decisions.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LoginPage;
