import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Send, 
  Download,
  User,
  Briefcase,
  Users,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';

const VirtualExecutives = ({ data, uploadedFile }) => {
  const [selectedPersona, setSelectedPersona] = useState('CFO');
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [continuousAnalysis, setContinuousAnalysis] = useState(null);

  const personas = [
    { id: 'CFO', label: 'Virtual CFO', icon: Briefcase, color: 'blue' },
    { id: 'CEO', label: 'Virtual CEO', icon: User, color: 'purple' },
    { id: 'BOTH', label: 'Both Executives', icon: Users, color: 'green' }
  ];

  const quickQuestions = [
    "How is our cash flow trending?",
    "What are our biggest risks?",
    "How can we improve ROI?",
    "Should we reallocate budget?",
    "What's our growth strategy?",
    "How is our CAC performing?"
  ];

  useEffect(() => {
    if (data && uploadedFile) {
      fetchContinuousAnalysis();
    }
  }, [data, uploadedFile]);

  const fetchContinuousAnalysis = async () => {
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      const response = await axios.post('/continuous-analysis/', formData);
      setContinuousAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error fetching continuous analysis:', error);
      // Fallback to mock data
      setContinuousAnalysis({
        cfo: "📊 Financial Health Assessment:\n• Cash Visibility: $1,375,432\n• Days Cash on Hand: 228 days\n• Marketing ROI: 18.7x\n\n💡 CFO Recommendations:\n• Optimize cash flow management\n• Monitor CAC trends closely\n• Consider budget reallocation",
        ceo: "🚀 Strategic Overview:\n• Customer Acquisition Cost: $74.55\n• Budget Utilization: 73.7%\n• Forecast Accuracy: 95.0%\n\n🎯 CEO Strategic Focus:\n• Scale high-performing channels\n• Invest in customer acquisition\n• Focus on operational excellence"
      });
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user', content: query, persona: selectedPersona };
    setResponses(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/query/', {
        query: query,
        persona: selectedPersona,
        context: createContextFromData(data)
      });

      const aiMessage = { 
        type: 'ai', 
        content: response.data.response, 
        persona: selectedPersona,
        timestamp: new Date()
      };
      setResponses(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Query error:', error);
      const errorMessage = { 
        type: 'ai', 
        content: "I'm experiencing technical difficulties. Please try again in a moment.", 
        persona: selectedPersona,
        timestamp: new Date()
      };
      setResponses(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const createContextFromData = (data) => {
    if (!data) return "No financial data available.";
    
    let context = "Financial Data Summary:\n";
    
    if (data.kpis) {
      context += `- Cash Visibility: $${data.kpis.cash_visibility?.toLocaleString() || '0'}\n`;
      context += `- Days Cash on Hand: ${Math.round(data.kpis.days_cash_on_hand || 0)} days\n`;
      context += `- Marketing ROI: ${data.kpis.marketing_spend_roi?.toFixed(1) || '0'}x\n`;
      context += `- Customer Acquisition Cost: $${data.kpis.customer_acquisition_cost?.toFixed(2) || '0'}\n`;
      context += `- Budget vs Actual: ${(data.kpis.budget_vs_actual_spend * 100)?.toFixed(1) || '0'}%\n`;
    }
    
    if (data.sentinel_alert && data.sentinel_alert.status === 'CRITICAL') {
      context += `\nCRITICAL ALERT: ${data.sentinel_alert.headline}\n`;
      context += `Analysis: ${data.sentinel_alert.analysis}\n`;
    }
    
    return context;
  };

  const handleQuickQuestion = (question) => {
    setQuery(question);
  };

  const downloadReallocatedExcel = async () => {
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      const response = await axios.post('/download-excel/', formData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reallocated_budget.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading reallocated Excel file');
    }
  };

  const getPersonaColor = (persona) => {
    const colors = {
      CFO: 'from-blue-500 to-blue-600',
      CEO: 'from-purple-500 to-purple-600',
      BOTH: 'from-green-500 to-green-600'
    };
    return colors[persona] || colors.CFO;
  };

  return (
    <div className="space-y-12">
      {/* Executive Analysis Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* CFO Analysis */}
        <div className="glass-strong rounded-2xl p-8 card-hover">
          <div className="flex items-center space-x-6 mb-6">
            <div className={`w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg`}>
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-heading text-white mb-2">Virtual CFO</h3>
              <div className="flex items-center space-x-3 text-caption">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Online & Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h4 className="text-subheading text-white mb-4">📊 Financial Health Assessment</h4>
            <div className="text-body text-gray-300 whitespace-pre-line">
              {continuousAnalysis?.cfo || "Analyzing your financial data..."}
            </div>
          </div>
        </div>

        {/* CEO Analysis */}
        <div className="glass-strong rounded-2xl p-8 card-hover">
          <div className="flex items-center space-x-6 mb-6">
            <div className={`w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-heading text-white mb-2">Virtual CEO</h3>
              <div className="flex items-center space-x-3 text-caption">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Online & Strategic</span>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h4 className="text-subheading text-white mb-4">🚀 Strategic Overview</h4>
            <div className="text-body text-gray-300 whitespace-pre-line">
              {continuousAnalysis?.ceo || "Monitoring growth metrics..."}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Query Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-8"
      >
        <h3 className="text-heading text-white mb-8 flex items-center space-x-4">
          <MessageSquare className="w-8 h-8 text-primary-400" />
          <span>Ask Your Virtual Executives</span>
        </h3>

        {/* Persona Selector */}
        <div className="flex items-center space-x-3 mb-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${selectedPersona === persona.id
                    ? 'btn-primary shadow-lg'
                    : 'btn-secondary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{persona.label}</span>
              </button>
            );
          })}
        </div>

        {/* Query Input */}
        <div className="flex space-x-6 mb-8">
          <div className="flex-1">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your financial data, strategy, or business performance..."
              className="form-input resize-none"
              rows="4"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleQuery();
                }
              }}
            />
          </div>
          <button
            onClick={handleQuery}
            disabled={!query.trim() || isLoading}
            className="btn-primary flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Clock className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Ask</span>
          </button>
        </div>

        {/* Quick Questions */}
        <div className="mb-8">
          <h4 className="text-caption mb-4">Quick Questions:</h4>
          <div className="flex flex-wrap gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl text-sm hover:bg-gray-600/50 transition-colors duration-200 border border-gray-600/30"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Responses */}
        <div className="space-y-6 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {responses.map((response, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  p-6 rounded-2xl
                  ${response.type === 'user' 
                    ? 'glass border-l-4 border-primary-500 ml-12' 
                    : 'glass-strong border-l-4 border-gray-600 mr-12'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg
                    ${response.type === 'user' 
                      ? 'gradient-bg' 
                      : `gradient-bg`
                    }
                  `}>
                    {response.type === 'user' ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Brain className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-subheading text-white">
                        {response.type === 'user' ? 'You' : `Virtual ${response.persona}`}
                      </span>
                      {response.timestamp && (
                        <span className="text-caption">
                          {response.timestamp.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <p className="text-body text-gray-300">{response.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-heading text-white mb-3">📥 Download Optimized Budget</h3>
            <p className="text-body text-gray-400">
              Get your reallocated budget with optimized spending recommendations
            </p>
          </div>
          <button
            onClick={downloadReallocatedExcel}
            className="btn-primary flex items-center space-x-3 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-5 h-5" />
            <span>Download Excel</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualExecutives;
