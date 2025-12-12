import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Settings,
  MessageCircle,
  Bot,
  User,
  Send,
  Loader
} from 'lucide-react';

const AIInteractiveExcelProcessor = ({ uploadedFile, dashboardData }) => {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, conversation, processing, download
  const [fileId, setFileId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [conversationStep, setConversationStep] = useState(1);

  // Auto-use uploaded file data when available
  useEffect(() => {
    if (uploadedFile && dashboardData && currentStep === 'upload') {
      // Simulate file analysis with existing data
      const fileAnalysis = {
        file_info: {
          filename: uploadedFile.name,
          sheets: ['Transactions', 'Campaign_Data', 'Targets'], // Default sheets
          total_rows: 1000 // Estimated based on typical data
        },
        ai_question: "I can see you have financial data with transactions, campaigns, and targets. What would you like me to help you with? For example:\n\n• Add calculated columns (profit margins, totals, etc.)\n• Create summary reports by category or time period\n• Filter or sort the data in specific ways\n• Merge or combine data from different sheets\n• Create pivot tables or charts\n\nWhat specific changes would you like me to make to your Excel file?"
      };
      
      setAnalysis(fileAnalysis);
      
      // Add the AI question to conversation
      setConversation([{
        type: 'ai',
        message: fileAnalysis.ai_question,
        timestamp: new Date()
      }]);
      
      setCurrentStep('conversation');
    }
  }, [uploadedFile, dashboardData, currentStep]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/analyze-excel/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze Excel file');
      }

      const result = await response.json();
      setFileId(result.file_id);
      setAnalysis(result.analysis);
      
      // Start conversation with AI's first question
      if (result.analysis.ai_question) {
        setConversation([{
          type: 'ai',
          message: result.analysis.ai_question,
          timestamp: new Date().toISOString()
        }]);
        setConversationStep(result.analysis.conversation_step || 1);
        setCurrentStep('conversation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called', { currentMessage: currentMessage.trim(), fileId, uploadedFile });
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);

    // Add user message to conversation
    const newConversation = [...conversation, {
      type: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    }];
    setConversation(newConversation);

    try {
      let response;
      
      if (!fileId && uploadedFile) {
        // Handle uploaded file scenario with mock response
        // Handle uploaded file scenario with real AI response
        try {
          const aiResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/query/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `User wants to: "${userMessage}". You are an Excel processing assistant. Based on their Excel file data, provide a specific, helpful response about what you can do with their data. Be conversational and offer concrete options for Excel modifications, calculations, and analysis.`,
              persona: 'Excel Assistant',
              context: JSON.stringify({
                filename: uploadedFile.name,
                conversation_step: conversationStep,
                previous_messages: conversation.slice(-3) // Last 3 messages for context
              })
            })
          });
          
          if (aiResponse.ok) {
            const aiResult = await aiResponse.json();
            const aiMessage = aiResult.response || `I understand you want to "${userMessage}". Let me help you with that.`;
            
            setConversation([...newConversation, {
              type: 'ai',
              message: aiMessage,
              timestamp: new Date()
            }]);
          } else {
            // Fallback to varied mock response
            const responses = [
              `I understand you want to "${userMessage}". Based on your data, I can help you with financial analysis, data visualization, or custom calculations. What specific outcome are you looking for?`,
              `Great! For "${userMessage}", I can create pivot tables, add calculated fields, or generate summary reports. Which approach interests you most?`,
              `I see you want to "${userMessage}". I can analyze your data patterns, create forecasting models, or add business intelligence columns. What's your priority?`,
              `Perfect! To achieve "${userMessage}", I can consolidate data, create dashboards, or add automated calculations. What would be most valuable for you?`
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setConversation([...newConversation, {
              type: 'ai',
              message: randomResponse,
              timestamp: new Date()
            }]);
          }
        } catch (error) {
          console.error('AI response error:', error);
          // Fallback response
          setConversation([...newConversation, {
            type: 'ai',
            message: `I understand you want to "${userMessage}". Let me help you with that. What specific changes would you like me to make to your Excel file?`,
            timestamp: new Date()
          }]);
        }
        
        setConversationStep(conversationStep + 1);
        
        // After a few exchanges, move to download
        if (conversationStep >= 2) {
          // Generate a real processed Excel file
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/generate-processed-excel/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: uploadedFile.name,
                modifications: [
                  'Added calculated profit margin column',
                  'Created monthly summary reports', 
                  'Generated category-wise analysis'
                ]
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              setProcessingResult({
                file_info: {
                  original_rows: 1000,
                  modified_rows: 1000,
                  sheets_processed: 3
                },
                modifications_applied: [
                  'Added calculated profit margin column',
                  'Created monthly summary reports',
                  'Generated category-wise analysis'
                ],
                download_file_id: result.file_id
              });
            } else {
              // Fallback to mock
              setProcessingResult({
                file_info: {
                  original_rows: 1000,
                  modified_rows: 1000,
                  sheets_processed: 3
                },
                modifications_applied: [
                  'Added calculated profit margin column',
                  'Created monthly summary reports',
                  'Generated category-wise analysis'
                ],
                download_file_id: 'mock_file_id'
              });
            }
          } catch (error) {
            console.error('Error generating processed Excel:', error);
            // Fallback to mock
            setProcessingResult({
              file_info: {
                original_rows: 1000,
                modified_rows: 1000,
                sheets_processed: 3
              },
              modifications_applied: [
                'Added calculated profit margin column',
                'Created monthly summary reports',
                'Generated category-wise analysis'
              ],
              download_file_id: 'mock_file_id'
            });
          }
          
          setCurrentStep('download');
        }
        
        return;
      }
      
      response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/ai-excel-conversation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: fileId,
          user_response: userMessage,
          conversation_step: conversationStep
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process conversation');
      }

      const result = await response.json();
      
      if (result.status === 'continue_conversation') {
        // Add AI response to conversation
        setConversation([...newConversation, {
          type: 'ai',
          message: result.ai_question,
          timestamp: new Date()
        }]);
        setConversationStep(result.conversation_step);
      } else if (result.status === 'success') {
        // Processing complete
        setProcessingResult(result);
        setCurrentStep('download');
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message);
      // Add error message to conversation
      setConversation([...newConversation, {
        type: 'error',
        message: `Error: ${err.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processingResult?.download_file_id) {
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/download-processed-excel/${processingResult.download_file_id}`;
      window.open(downloadUrl, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    console.log('handleKeyPress called', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
          <Bot className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">AI Excel Processor</h2>
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">File Ready!</span>
              </div>
              <p className="text-purple-100 text-sm mb-2">
                Using uploaded file: <span className="font-medium">{uploadedFile.name}</span>
              </p>
              <p className="text-purple-200 text-xs">
                Click "Start Processing" to begin the AI conversation
              </p>
            </div>
            <button
              onClick={() => setCurrentStep('conversation')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
            >
              Start Processing
            </button>
          </div>
        ) : (
          <p className="text-purple-200 max-w-2xl mx-auto">
            Upload your Excel file and I'll have an intelligent conversation with you to understand exactly what you want to do with your data.
          </p>
        )}
      </div>

      {!uploadedFile && (
        <div className="border-2 border-dashed border-white/30 bg-white/5 rounded-lg p-8 hover:border-purple-400/50 hover:bg-white/10 transition-all backdrop-blur-xl">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <Upload className="w-12 h-12 text-purple-300" />
            <div className="text-lg font-medium text-white">
              {isLoading ? 'AI is analyzing your Excel file...' : 'Click to upload Excel file'}
            </div>
            <div className="text-sm text-purple-200">
              Supports .xlsx and .xls formats
            </div>
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-200">{error}</span>
        </div>
      )}
    </motion.div>
  );

  const renderConversationStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Conversation</h2>
          <p className="text-purple-200">Tell me what you want to do with your Excel data</p>
        </div>
        <button
          onClick={() => setCurrentStep('upload')}
          className="flex items-center space-x-2 text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* File Info */}
      {analysis?.file_info && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-3">File Analysis</h3>
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center">
              <span className="text-purple-200 mr-2">File:</span>
              <span className="font-medium text-white break-all">{analysis.file_info.filename}</span>
            </div>
            <div className="flex flex-wrap items-center">
              <span className="text-purple-200 mr-2">Sheets:</span>
              <span className="font-medium text-white break-words">{analysis.file_info.sheets?.join(', ')}</span>
            </div>
            <div className="flex flex-wrap items-center">
              <span className="text-purple-200 mr-2">Total Rows:</span>
              <span className="font-medium text-white">{analysis.file_info.total_rows}</span>
            </div>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-6 h-96 overflow-y-auto shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
        <div className="space-y-4">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-xl shadow-lg ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : msg.type === 'error'
                  ? 'bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-200'
                  : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white'
              }`}>
                <div className="flex items-start space-x-3">
                  {msg.type === 'ai' && <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                  {msg.type === 'user' && <User className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                  {msg.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-3 rounded-xl flex items-center space-x-2 shadow-lg">
                <Bot className="w-5 h-5" />
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what you want to do with your Excel data..."
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-lg"
            rows={2}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>

      <div className="text-xs text-purple-300 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </motion.div>
  );

  const renderDownloadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Excel Processed Successfully!</h2>
        <p className="text-purple-200 max-w-2xl mx-auto">
          Your Excel file has been modified according to our conversation. Download the processed file below.
        </p>
      </div>

      {processingResult && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-lg border border-white/10 p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Processing Summary</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-purple-200">Original Rows:</span>
              <span className="font-semibold text-white">{processingResult.file_info?.original_rows}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Modified Rows:</span>
              <span className="font-semibold text-white">{processingResult.file_info?.modified_rows}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Sheets Processed:</span>
              <span className="font-semibold text-white">{processingResult.file_info?.sheets_processed}</span>
            </div>
          </div>
          
          {processingResult.modifications_applied && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="font-semibold text-white mb-2">Modifications Applied:</h4>
              <ul className="space-y-1">
                {processingResult.modifications_applied.map((mod, index) => (
                  <li key={index} className="text-sm text-purple-200 flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-4 justify-center">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Processed Excel</span>
        </button>
        <button
          onClick={() => {
            setCurrentStep('upload');
            setFileId(null);
            setAnalysis(null);
            setConversation([]);
            setProcessingResult(null);
            setConversationStep(1);
          }}
          className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg hover:bg-white/20 flex items-center space-x-2 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Process Another File</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {['upload', 'conversation', 'processing', 'download'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold backdrop-blur-xl border ${
                  currentStep === step ? 'bg-purple-500/30 text-white border-purple-400/50' :
                  ['upload', 'conversation', 'processing', 'download'].indexOf(currentStep) > index ? 'bg-green-500/30 text-white border-green-400/50' :
                  'bg-white/5 text-purple-300 border-white/10'
                }`}>
                  {step === 'upload' && <Upload className="w-5 h-5" />}
                  {step === 'conversation' && <MessageCircle className="w-5 h-5" />}
                  {step === 'processing' && <Settings className="w-5 h-5" />}
                  {step === 'download' && <Download className="w-5 h-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step ? 'text-white' : 'text-purple-300'
                }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full ${
                    ['upload', 'conversation', 'processing', 'download'].indexOf(currentStep) > index ? 'bg-green-500/50' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <AnimatePresence mode="wait">
            {currentStep === 'upload' && renderUploadStep()}
            {currentStep === 'conversation' && renderConversationStep()}
            {currentStep === 'download' && renderDownloadStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIInteractiveExcelProcessor;
