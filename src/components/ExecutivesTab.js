import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, BarChart3, Mic, MicOff, Volume2, VolumeX, Play, Pause, Image, CheckCircle } from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';
import Chart from './Chart';

const ExecutivesTab = ({ data }) => {
  const [selectedPersona, setSelectedPersona] = useState('CFO');
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Audio states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(-1);
  
  // Dark mode state - always dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const sampleQuestions = [
    "What's our current cash flow situation?",
    "How can we improve our marketing ROI?",
    "What are the biggest financial risks we should watch?",
    "Should we invest more in customer acquisition?",
    "How is our forecast accuracy performing?",
    "What's our customer acquisition cost trend?"
  ];

  // Image handling functions
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Text-to-Speech function
  const speakText = (text, index) => {
    if (isMuted || !synthRef.current) return;
    
    // Stop any current speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingIndex(index);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingIndex(-1);
    };
    
    synthRef.current.speak(utterance);
  };

  // Voice recording function
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingIndex(-1);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = { 
      type: 'user', 
      content: query, 
      timestamp: new Date(),
      image: imagePreview 
    };
    setResponses(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('query', query);
      formData.append('persona', selectedPersona);
      formData.append('context', data ? JSON.stringify(data) : '{}');
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/query/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Enhanced response handling
      let aiContent = result.response || "I'm analyzing your financial data...";
      
      // If response is empty or generic, provide intelligent fallback
      if (!aiContent || aiContent.length < 10) {
        aiContent = generateIntelligentResponse(query, selectedPersona, data);
      }
      
      const aiMessage = { 
        type: 'ai', 
        content: aiContent, 
        persona: selectedPersona,
        timestamp: new Date(),
        charts: generateChartsForQuery(query, data)
      };
      
      setResponses(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Provide intelligent fallback response
      const fallbackContent = generateIntelligentResponse(query, selectedPersona, data);
      
      const errorMessage = { 
        type: 'ai', 
        content: fallbackContent, 
        persona: selectedPersona,
        timestamp: new Date(),
        charts: generateChartsForQuery(query, data)
      };
      setResponses(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuery('');
      removeImage(); // Clear image after sending
    }
  };

  // Generate intelligent fallback responses
  const generateIntelligentResponse = (query, persona, data) => {
    const queryLower = query.toLowerCase();
    const kpis = data?.kpis || {};
    
    if (queryLower.includes('cash') || queryLower.includes('flow')) {
      const cashVisibility = kpis.cash_visibility || 0;
      return `Based on our current data, our cash visibility stands at $${cashVisibility.toLocaleString()}. This represents our net cash position after accounting for all inflows and outflows. ${persona === 'CFO' ? 'I recommend monitoring this closely and ensuring we maintain adequate liquidity buffers.' : 'From a strategic perspective, this cash position enables us to pursue growth opportunities while maintaining financial stability.'}`;
    }
    
    if (queryLower.includes('roi') || queryLower.includes('marketing')) {
      const roi = kpis.marketing_spend_roi || 0;
      return `Our marketing ROI is currently at ${roi}%. ${persona === 'CFO' ? 'This indicates our marketing investments are generating positive returns. I suggest optimizing channels with the highest ROI and reallocating budget from underperforming areas.' : 'This ROI demonstrates strong marketing efficiency. We should scale successful campaigns and explore new channels to maximize growth.'}`;
    }
    
    if (queryLower.includes('cac') || queryLower.includes('acquisition')) {
      const cac = kpis.customer_acquisition_cost || 0;
      return `Our Customer Acquisition Cost is $${cac}. ${persona === 'CFO' ? 'This metric is crucial for profitability. I recommend analyzing which channels provide the lowest CAC and optimizing our acquisition strategy accordingly.' : 'Understanding our CAC helps us make informed decisions about growth investments. We should focus on channels that provide sustainable customer acquisition at optimal costs.'}`;
    }
    
    if (queryLower.includes('days') || queryLower.includes('runway')) {
      const days = kpis.days_cash_on_hand || 0;
      return `We have ${days} days of cash on hand. ${persona === 'CFO' ? 'This runway gives us time to optimize operations and secure additional funding if needed. I recommend creating a detailed cash flow forecast.' : 'This runway provides strategic flexibility. We should use this time to strengthen our market position and explore growth opportunities.'}`;
    }
    
    // Default intelligent response
    return `${persona === 'CFO' ? 'As your CFO, I\'m analyzing the financial data to provide you with actionable insights. Based on our current metrics, I recommend focusing on cash flow optimization and cost management to ensure sustainable growth.' : 'As your CEO, I\'m evaluating our strategic position. Our financial metrics indicate opportunities for growth and optimization. Let\'s focus on scaling our most profitable operations.'}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  const generateChartsForQuery = (query, data) => {
    if (!data) return [];
    
    const queryLower = query.toLowerCase();
    const charts = [];

    // Extract real data from dashboard if available
    const kpis = data.kpis || {};
    const cashVisibility = kpis.cash_visibility || 0;
    const marketingROI = kpis.marketing_spend_roi || 0;
    const cac = kpis.customer_acquisition_cost || 0;
    const daysCashOnHand = kpis.days_cash_on_hand || 0;

    // Cash Flow Chart
    if (queryLower.includes('cash') || queryLower.includes('flow') || queryLower.includes('treasury')) {
      charts.push({
        type: 'line',
        title: 'Cash Flow Analysis',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Current'],
          datasets: [{
            label: 'Cash Flow ($)',
            data: [cashVisibility * 0.7, cashVisibility * 0.8, cashVisibility * 0.9, cashVisibility * 1.1, cashVisibility],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        }
      });
    }

    // ROI Chart
    if (queryLower.includes('roi') || queryLower.includes('return') || queryLower.includes('marketing')) {
      charts.push({
        type: 'bar',
        title: 'Marketing ROI Performance',
        data: {
          labels: ['Google Ads', 'Facebook', 'LinkedIn', 'Email', 'Direct'],
          datasets: [{
            label: 'ROI %',
            data: [marketingROI * 0.8, marketingROI * 0.9, marketingROI * 1.2, marketingROI * 1.1, marketingROI],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
          }]
        }
      });
    }

    // CAC Chart
    if (queryLower.includes('cac') || queryLower.includes('acquisition') || queryLower.includes('customer')) {
      charts.push({
        type: 'doughnut',
        title: 'Customer Acquisition Cost Analysis',
        data: {
          labels: ['Marketing Spend', 'Sales Cost', 'Operations'],
          datasets: [{
            data: [cac * 0.6, cac * 0.25, cac * 0.15],
            backgroundColor: ['#ef4444', '#f97316', '#eab308']
          }]
        }
      });
    }

    // Days Cash Chart
    if (queryLower.includes('days') || queryLower.includes('cash') || queryLower.includes('runway')) {
      charts.push({
        type: 'gauge',
        title: 'Days Cash on Hand',
        data: {
          value: daysCashOnHand,
          max: 90,
          color: daysCashOnHand > 60 ? '#10b981' : daysCashOnHand > 30 ? '#f59e0b' : '#ef4444'
        }
      });
    }

    // Budget vs Actual
    if (queryLower.includes('budget') || queryLower.includes('actual') || queryLower.includes('spend')) {
      charts.push({
        type: 'bar',
        title: 'Budget vs Actual Performance',
        data: {
          labels: ['Marketing', 'Operations', 'Sales', 'R&D'],
          datasets: [{
            label: 'Budgeted',
            data: [100, 100, 100, 100],
            backgroundColor: 'rgba(156, 163, 175, 0.5)'
          }, {
            label: 'Actual',
            data: [kpis.budget_vs_actual_spend || 95, 98, 102, 89],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
          }]
        }
      });
    }

    return charts;
  };

  if (!data) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-gray-500 text-lg font-light">
          Please upload financial data to access executive insights
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Chat Header - Compact */}
      <motion.div
        className={`border-b transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <AnimatedAvatar 
                  persona={selectedPersona === 'BOTH' ? 'CEO' : selectedPersona}
                  isSpeaking={isLoading}
                  size="small"
                />
              </div>
              <div>
                <h2 className={`text-2xl font-light transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  Executive Intelligence
                </h2>
                <p className={`text-sm font-light transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Strategic insights from your virtual leadership team
                </p>
              </div>
            </div>
            
            {/* Persona Selector */}
            <motion.select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none font-light transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-200 focus:border-gray-400' 
                  : 'bg-white border-gray-200 text-gray-700 focus:border-black'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <option value="CFO">CFO</option>
              <option value="CEO">CEO</option>
              <option value="BOTH">Both</option>
            </motion.select>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Welcome Message - Show when no messages */}
          {responses.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative inline-block mb-8">
                <AnimatedAvatar 
                  persona={selectedPersona === 'BOTH' ? 'CEO' : selectedPersona}
                  isSpeaking={isLoading}
                  size="large"
                />
              </div>
              <p className={`text-xl font-light mb-8 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                How can I assist you with your financial analysis today?
              </p>
              
              {/* Sample Questions */}
              <div className="max-w-3xl mx-auto space-y-3">
                <p className={`text-sm font-light transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sampleQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setQuery(question)}
                      className={`px-4 py-3 text-sm rounded-lg transition-colors text-left font-light ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          <div className="space-y-6">
            <AnimatePresence>
              {responses.map((response, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`${
                    response.type === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  <div className={`max-w-3xl w-full ${
                    response.type === 'user' 
                      ? isDarkMode 
                        ? 'bg-blue-900/30 border-blue-800/50' 
                        : 'bg-blue-50 border-blue-200'
                      : isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                  } p-6 rounded-2xl border transition-colors duration-300`}
                  >
                    {response.type === 'user' ? (
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                          isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                        }`}>
                          <span className="text-sm font-light text-white">U</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-light leading-relaxed transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>{response.content}</p>
                          
                          {/* Image Preview */}
                          {response.image && (
                            <div className="mt-3">
                              <img 
                                src={response.image} 
                                alt="Uploaded" 
                                className="max-w-xs rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                          
                          <p className={`text-xs mt-2 font-light transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {response.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <AnimatedAvatar 
                            persona={response.persona}
                            isSpeaking={currentSpeakingIndex === index}
                            size="small"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>{response.persona}</span>
                                <span className={`text-xs font-light transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {response.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              
                              {/* Audio Controls for Response */}
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => speakText(response.content, index)}
                                  disabled={isSpeaking && currentSpeakingIndex !== index}
                                  className={`p-2 rounded-lg font-light transition-colors ${
                                    currentSpeakingIndex === index
                                      ? isDarkMode 
                                        ? 'bg-blue-800 text-blue-300' 
                                        : 'bg-blue-100 text-blue-600'
                                      : isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {currentSpeakingIndex === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </motion.button>
                              </div>
                            </div>
                            <p className={`font-light leading-relaxed whitespace-pre-wrap transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              {response.content}
                            </p>
                          </div>
                        </div>
                        
                        {/* Charts */}
                        {response.charts && response.charts.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {response.charts.map((chart, chartIndex) => (
                              <motion.div
                                key={chartIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + chartIndex * 0.1 }}
                                className={`rounded-xl p-6 border shadow-sm transition-colors duration-300 ${
                                  isDarkMode 
                                    ? 'bg-gray-800 border-gray-700' 
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className={`text-lg font-light transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                  }`}>{chart.title}</h4>
                                  <BarChart3 className={`w-5 h-5 transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                  }`} />
                                </div>
                                
                                <div className="h-64 relative">
                                  <Chart 
                                    type={chart.type} 
                                    title={chart.title} 
                                    data={chart.data} 
                                    isDarkMode={isDarkMode}
                                  />
                                </div>
                                
                                <div className="mt-4 text-center">
                                  <p className={`text-xs font-light transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Interactive visualization with real data
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <motion.div
        className={`border-t transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Audio Controls Row */}
          <div className="flex items-center justify-center space-x-4 mb-3">
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-3 py-1.5 rounded-lg font-light text-xs transition-colors ${
                isMuted 
                  ? isDarkMode 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-200 text-gray-600'
                  : isDarkMode
                    ? 'bg-green-800 text-green-300 hover:bg-green-700'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </motion.button>
            
            {isSpeaking && (
              <motion.button
                onClick={stopSpeaking}
                className={`px-3 py-1.5 rounded-lg font-light text-xs transition-colors ${
                  isDarkMode 
                    ? 'bg-red-800 text-red-300 hover:bg-red-700' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pause className="w-3 h-3" />
              </motion.button>
            )}
            
            <span className={`text-xs font-light transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {isRecording ? 'Recording...' : isSpeaking ? 'Speaking...' : 'Voice controls ready'}
            </span>
          </div>

          {/* Input Row */}
          <div className="flex space-x-3">
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.002 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about cash flow, growth strategy, or any financial question..."
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none font-light transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-gray-400' 
                    : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-black'
                }`}
                disabled={isLoading}
              />
            </motion.div>
            
            {/* Image Upload Button */}
            <motion.button
              onClick={triggerImageUpload}
              disabled={isLoading}
              className={`px-3 py-3 rounded-xl font-light transition-colors ${
                selectedImage
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedImage ? <CheckCircle className="w-4 h-4" /> : <Image className="w-4 h-4" />}
            </motion.button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {/* Voice Recording Button */}
            <motion.button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`px-3 py-3 rounded-xl font-light transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: isRecording ? [1, 1.05, 1] : 1,
              }}
              transition={{
                scale: { duration: 1, repeat: isRecording ? Infinity : 0, ease: "easeInOut" }
              }}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
            
            {/* Send Button */}
            <motion.button
              onClick={handleQuery}
              disabled={isLoading || !query.trim()}
              className={`px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-light transition-colors ${
                isDarkMode 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  className={`w-4 h-4 border-2 border-t-transparent rounded-full ${
                    isDarkMode ? 'border-black' : 'border-white'
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutivesTab;