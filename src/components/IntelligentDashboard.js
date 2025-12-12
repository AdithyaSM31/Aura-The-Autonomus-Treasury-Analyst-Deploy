import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const IntelligentDashboard = ({ data }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30_days');
  const [activeTab, setActiveTab] = useState('current');

  if (!data || !data.current_metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No analysis data available</div>
      </div>
    );
  }

  const { current_metrics, predictions, ai_insights, patterns } = data;

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Intelligent Financial Analysis</h2>
          <p className="text-purple-200">Real-time insights and future predictions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 backdrop-blur-lg text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            Current Analysis
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'predictions'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 backdrop-blur-lg text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            Future Predictions
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 backdrop-blur-lg text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            AI Insights
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'current' && (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Revenue Metrics */}
            {current_metrics.revenue && (
              <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Revenue Analysis
                  </h3>
                  {getTrendIcon(current_metrics.revenue.revenue_growth_rate)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(current_metrics.revenue.total_revenue)}
                    </div>
                    <div className="text-sm text-purple-300">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(current_metrics.revenue.total_expenses)}
                    </div>
                    <div className="text-sm text-purple-300">Total Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(current_metrics.revenue.net_income)}
                    </div>
                    <div className="text-sm text-purple-300">Net Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(current_metrics.revenue.revenue_growth_rate * 100)}
                    </div>
                    <div className="text-sm text-purple-300">Growth Rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Flow Metrics */}
            {current_metrics.cash_flow && (
              <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Cash Flow Analysis
                  </h3>
                  {getTrendIcon(current_metrics.cash_flow.cash_flow_trend)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(current_metrics.cash_flow.monthly_average)}
                    </div>
                    <div className="text-sm text-purple-300">Monthly Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(current_metrics.cash_flow.monthly_volatility)}
                    </div>
                    <div className="text-sm text-purple-300">Volatility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {current_metrics.cash_flow.positive_months}
                    </div>
                    <div className="text-sm text-purple-300">Positive Months</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {current_metrics.cash_flow.negative_months}
                    </div>
                    <div className="text-sm text-purple-300">Negative Months</div>
                  </div>
                </div>
              </div>
            )}

            {/* Marketing Metrics */}
            {current_metrics.marketing && (
              <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-500" />
                    Marketing Analysis
                  </h3>
                  {getTrendIcon(current_metrics.marketing.acquisition_growth_rate)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(current_metrics.marketing.total_spend)}
                    </div>
                    <div className="text-sm text-purple-300">Total Spend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(current_metrics.marketing.total_acquisitions)}
                    </div>
                    <div className="text-sm text-purple-300">Total Acquisitions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(current_metrics.marketing.cost_per_acquisition)}
                    </div>
                    <div className="text-sm text-purple-300">Cost Per Acquisition</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPercentage(current_metrics.marketing.acquisition_growth_rate * 100)}
                    </div>
                    <div className="text-sm text-purple-300">Acquisition Growth</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'predictions' && (
          <motion.div
            key="predictions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Timeframe Selector */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Future Predictions
              </h3>
              <div className="flex space-x-2 mb-6">
                {Object.keys(predictions).map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>

              {predictions[selectedTimeframe] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Revenue Prediction */}
                  {predictions[selectedTimeframe].projected_revenue && (
                    <div className="bg-green-500/20 backdrop-blur-xl rounded-lg p-4 border border-green-400/30 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Projected Revenue</h4>
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {formatCurrency(predictions[selectedTimeframe].projected_revenue)}
                      </div>
                      <div className="text-sm text-green-300">
                        Growth: {formatPercentage(predictions[selectedTimeframe].revenue_growth)}
                      </div>
                    </div>
                  )}

                  {/* Cash Flow Prediction */}
                  {predictions[selectedTimeframe].projected_cash_flow && (
                    <div className="bg-blue-500/20 backdrop-blur-xl rounded-lg p-4 border border-blue-400/30 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Projected Cash Flow</h4>
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {formatCurrency(predictions[selectedTimeframe].projected_cash_flow)}
                      </div>
                      <div className="text-sm text-blue-300">
                        Trend: {formatPercentage(predictions[selectedTimeframe].cash_flow_trend)}
                      </div>
                    </div>
                  )}

                  {/* Marketing Prediction */}
                  {predictions[selectedTimeframe].projected_acquisitions && (
                    <div className="bg-purple-500/20 backdrop-blur-xl rounded-lg p-4 border border-purple-400/30 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Projected Acquisitions</h4>
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {Math.round(predictions[selectedTimeframe].projected_acquisitions)}
                      </div>
                      <div className="text-sm text-purple-300">
                        Spend: {formatCurrency(predictions[selectedTimeframe].projected_marketing_spend)}
                      </div>
                    </div>
                  )}

                  {/* Risk Assessment */}
                  {predictions[selectedTimeframe].risk_level && (
                    <div className="bg-orange-500/20 backdrop-blur-xl rounded-lg p-4 border border-orange-400/30 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Risk Assessment</h4>
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${predictions[selectedTimeframe].risk_level === 'high' ? 'text-red-400' : predictions[selectedTimeframe].risk_level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {predictions[selectedTimeframe].risk_level.toUpperCase()}
                      </div>
                      <div className="text-sm text-orange-300">
                        Risk Level
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* AI Insights */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                AI-Powered Insights
              </h3>
              
              {ai_insights.executive_summary && (
                <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">Executive Summary</h4>
                  <p className="text-blue-200">{ai_insights.executive_summary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                {ai_insights.strengths && ai_insights.strengths.length > 0 && (
                  <div className="bg-green-500/20 backdrop-blur-xl rounded-lg p-4 border border-green-400/30">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {ai_insights.strengths.map((strength, index) => (
                        <li key={index} className="text-green-200 flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Opportunities */}
                {ai_insights.opportunities && ai_insights.opportunities.length > 0 && (
                  <div className="bg-blue-500/20 backdrop-blur-xl rounded-lg p-4 border border-blue-400/30">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {ai_insights.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-blue-200 flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {ai_insights.weaknesses && ai_insights.weaknesses.length > 0 && (
                  <div className="bg-yellow-500/20 backdrop-blur-xl rounded-lg p-4 border border-yellow-400/30">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {ai_insights.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-yellow-200 flex items-start">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {ai_insights.recommendations && ai_insights.recommendations.length > 0 && (
                  <div className="bg-purple-500/20 backdrop-blur-xl rounded-lg p-4 border border-purple-400/30">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-400" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {ai_insights.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-purple-200 flex items-start">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentDashboard;
