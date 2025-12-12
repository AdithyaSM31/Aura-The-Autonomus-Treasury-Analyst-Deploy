import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, TrendingUp, Users, Settings } from 'lucide-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import UploadTab from './components/UploadTab';
import DashboardTab from './components/DashboardTab';
import AnalyticsTab from './components/AnalyticsTab';
import ExecutivesTab from './components/ExecutivesTab';
import AIInteractiveExcelProcessor from './components/AIInteractiveExcelProcessor';
import LoginPage from './components/LoginPage';
import LoadingOverlay from './components/LoadingOverlay';
import Footer from './components/Footer';
import authService from './services/authService';
import './styles/index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'executives', label: 'Executives', icon: Users },
    { id: 'excel-processor', label: 'Excel Processor', icon: Settings },
  ];

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const userInfo = await authService.getUserInfo();
        if (userInfo) {
          setIsAuthenticated(true);
          setUser(userInfo);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setDashboardData(null);
    setFileInfo(null);
    setActiveTab('upload');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUser(authService.getUser());
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploadfile/`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setFileInfo({
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toLocaleString(),
        });
        setActiveTab('dashboard');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadTab onFileUpload={handleFileUpload} />;
      case 'dashboard':
        return <DashboardTab data={dashboardData} fileInfo={fileInfo} />;
      case 'analytics':
        return <AnalyticsTab data={dashboardData} />;
      case 'executives':
        return <ExecutivesTab data={dashboardData} />;
      case 'excel-processor':
        return <AIInteractiveExcelProcessor uploadedFile={fileInfo} dashboardData={dashboardData} />;
      default:
        return <UploadTab onFileUpload={handleFileUpload} />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Beautiful Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1),transparent_60%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_60%)]" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Elegant Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Header onSignOut={handleSignOut} user={user} />
        </motion.div>
        
        {/* Minimalist Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Navigation 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </motion.div>
        
        {/* Main Content with Beautiful Glass Morphism */}
        <main className="flex-1 container mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-12">
                {renderTabContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Elegant Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Footer />
        </motion.div>
      </div>
      
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
};

export default App;