import React, { useState } from 'react';
import { 
  DollarSign,
  Download,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AnalyticsTab = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30_days');

  const handleExportData = () => {
    if (!data) {
      alert('No data available to export');
      return;
    }

    // Create comprehensive Excel-like data structure
    const exportData = {
      'Current Metrics': [],
      'Predictions': [],
      'AI Insights': [],
      'Data Quality': []
    };

    // Add current metrics
    if (data.current_metrics) {
      exportData['Current Metrics'] = Object.entries(data.current_metrics).map(([key, metric]) => ({
        'Metric Name': metric.name || key,
        'Current Value': metric.current_value || 'N/A',
        'Target': metric.target || 'N/A',
        'Status': metric.status || 'N/A',
        'Trend': metric.trend || 'N/A',
        'Change': metric.change || 'N/A'
      }));
    }

    // Add predictions for all timeframes
    if (predictions) {
      Object.entries(predictions).forEach(([timeframe, pred]) => {
        exportData['Predictions'].push({
          'Timeframe': timeframe,
          'Projected Revenue': pred.projected_revenue || 'N/A',
          'Projected Acquisitions': pred.projected_acquisitions || 'N/A',
          'Projected Marketing Spend': pred.projected_marketing_spend || 'N/A',
          'Risk Level': pred.risk_level || 'N/A',
          'Confidence': pred.confidence || 'N/A'
        });
      });
    }

    // Add AI insights
    if (data.ai_insights) {
      Object.entries(data.ai_insights).forEach(([category, insight]) => {
        exportData['AI Insights'].push({
          'Category': category,
          'Insight': insight,
          'Generated At': new Date().toISOString()
        });
      });
    }

    // Add data quality info
    exportData['Data Quality'] = [{
      'Available Metrics': availableMetrics.length,
      'Data Completeness': `${Math.round((availableMetrics.length / 8) * 100)}%`,
      'Last Updated': new Date().toISOString(),
      'Data Source': 'Uploaded Excel File'
    }];

    // Convert to CSV format with multiple sheets simulation
    let csvContent = '';
    
    // Add current metrics
    if (exportData['Current Metrics'].length > 0) {
      csvContent += 'CURRENT METRICS\n';
      csvContent += 'Metric Name,Current Value,Target,Status,Trend,Change\n';
      exportData['Current Metrics'].forEach(row => {
        csvContent += `${row['Metric Name']},${row['Current Value']},${row['Target']},${row['Status']},${row['Trend']},${row['Change']}\n`;
      });
      csvContent += '\n';
    }

    // Add predictions
    if (exportData['Predictions'].length > 0) {
      csvContent += 'PREDICTIONS\n';
      csvContent += 'Timeframe,Projected Revenue,Projected Acquisitions,Projected Marketing Spend,Risk Level,Confidence\n';
      exportData['Predictions'].forEach(row => {
        csvContent += `${row['Timeframe']},${row['Projected Revenue']},${row['Projected Acquisitions']},${row['Projected Marketing Spend']},${row['Risk Level']},${row['Confidence']}\n`;
      });
      csvContent += '\n';
    }

    // Add AI insights
    if (exportData['AI Insights'].length > 0) {
      csvContent += 'AI INSIGHTS\n';
      csvContent += 'Category,Insight,Generated At\n';
      exportData['AI Insights'].forEach(row => {
        csvContent += `${row['Category']},"${row['Insight']}",${row['Generated At']}\n`;
      });
      csvContent += '\n';
    }

    // Add data quality
    if (exportData['Data Quality'].length > 0) {
      csvContent += 'DATA QUALITY\n';
      csvContent += 'Available Metrics,Data Completeness,Last Updated,Data Source\n';
      exportData['Data Quality'].forEach(row => {
        csvContent += `${row['Available Metrics']},${row['Data Completeness']},${row['Last Updated']},${row['Data Source']}\n`;
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_comprehensive_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!data || !data.current_metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No analysis data available</div>
      </div>
    );
  }

  const { current_metrics, predictions, patterns } = data;

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

  // Only show metrics that have actual data
  const availableMetrics = [
    {
      id: 'revenue',
      title: 'Revenue Analysis',
      icon: DollarSign,
      data: current_metrics.revenue,
      color: 'from-green-500 to-emerald-500',
      hasData: current_metrics.revenue && Object.keys(current_metrics.revenue).length > 0
    },
    {
      id: 'cash_flow',
      title: 'Cash Flow Analysis',
      icon: Activity,
      data: current_metrics.cash_flow,
      color: 'from-blue-500 to-cyan-500',
      hasData: current_metrics.cash_flow && Object.keys(current_metrics.cash_flow).length > 0
    },
    {
      id: 'marketing',
      title: 'Marketing Analysis',
      icon: Target,
      data: current_metrics.marketing,
      color: 'from-purple-500 to-pink-500',
      hasData: current_metrics.marketing && Object.keys(current_metrics.marketing).length > 0
    }
  ].filter(metric => metric.hasData);

  const selectedMetricData = availableMetrics.find(m => m.id === selectedMetric);

  // Enhanced bar chart component with better visuals
  const SimpleBarChart = ({ data, title, color = 'blue' }) => {
    if (!data || Object.keys(data).length === 0) return null;

    const entries = Object.entries(data).slice(0, 6); // Show max 6 items
    const maxValue = Math.max(...entries.map(([_, value]) => Math.abs(value || 0)));

    // Get icon for metric type
    const getMetricIcon = (key) => {
      if (key.includes('revenue') || key.includes('income')) return <DollarSign className="w-4 h-4" />;
      if (key.includes('expense')) return <TrendingDown className="w-4 h-4" />;
      if (key.includes('growth') || key.includes('positive')) return <TrendingUp className="w-4 h-4" />;
      if (key.includes('negative') || key.includes('burn')) return <AlertTriangle className="w-4 h-4" />;
      if (key.includes('count') || key.includes('acquisition')) return <Target className="w-4 h-4" />;
      return <Activity className="w-4 h-4" />;
    };

    // Get gradient color based on value
    const getBarGradient = (key, value, baseColor) => {
      const isNegative = value < 0;
      const isGrowth = key.includes('growth') || key.includes('rate') || key.includes('trend');
      
      if (isGrowth) {
        return value > 0 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : 'bg-gradient-to-r from-red-500 to-pink-500';
      }
      
      if (key.includes('expense') || key.includes('burn') || key.includes('negative')) {
        return 'bg-gradient-to-r from-red-400 to-orange-400';
      }
      
      if (baseColor === 'green') return 'bg-gradient-to-r from-green-500 to-emerald-500';
      if (baseColor === 'blue') return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      if (baseColor === 'purple') return 'bg-gradient-to-r from-purple-500 to-pink-500';
      
      return isNegative ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500';
    };

    // Format value with proper display
    const formatValue = (key, value) => {
      if (typeof value !== 'number') return value;
      
      if (key.includes('rate') || key.includes('growth') || key.includes('percentage') || key.includes('trend')) {
        return formatPercentage(value * 100);
      }
      
      if (key.includes('revenue') || key.includes('spend') || key.includes('income') || 
          key.includes('cash') || key.includes('cost') || key.includes('average') || 
          key.includes('volatility') || key.includes('expense') || key.includes('burn')) {
        return formatCurrency(value);
      }
      
      return Math.round(value).toLocaleString();
    };

    return (
      <div className="bg-white/5 backdrop-blur-2xl rounded-lg p-6 border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]">
        <h4 className="font-semibold text-white mb-6 text-lg">{title}</h4>
        <div className="space-y-4">
          {entries.map(([key, value]) => {
            const percentage = maxValue > 0 ? (Math.abs(value || 0) / maxValue) * 100 : 0;
            const formattedValue = formatValue(key, value);
            const barGradient = getBarGradient(key, value, color);
            const isNegative = value < 0;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${
                      key.includes('revenue') || key.includes('income') ? 'bg-green-500/20 text-green-400' :
                      key.includes('expense') || key.includes('burn') ? 'bg-red-500/20 text-red-400' :
                      key.includes('growth') ? (value > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getMetricIcon(key)}
                    </div>
                    <span className="text-white font-medium capitalize text-sm">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className={`font-bold text-base ${
                    isNegative ? 'text-red-400' :
                    key.includes('revenue') || key.includes('income') ? 'text-green-400' :
                    key.includes('expense') ? 'text-orange-400' :
                    'text-white'
                  }`}>
                    {formattedValue}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-700 ease-out ${barGradient} shadow-lg relative`}
                      style={{ 
                        width: `${percentage}%`,
                        boxShadow: '0 0 10px rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
                      {percentage > 25 && (
                        <span className="absolute right-2 top-0 text-xs font-semibold text-white drop-shadow-lg">
                          {percentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Trend indicator component
  const TrendIndicator = ({ value, label }) => {
    if (typeof value !== 'number') return null;
    
    const isPositive = value > 0;
    const isNegative = value < 0;
    
    return (
      <div className="flex items-center space-x-2">
        {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
        {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 
          isNegative ? 'text-red-400' : 'text-purple-200'
        }`}>
          {label}: {formatPercentage(value * 100)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Analytics</h2>
          <p className="text-purple-200">Data-driven insights and visualizations</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportData}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Available Metrics Selector */}
      {availableMetrics.length > 0 && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Analysis Metric</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMetric === metric.id
                      ? 'border-purple-400 bg-white/15 backdrop-blur-xl'
                      : 'border-white/20 bg-white/5 backdrop-blur-xl hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-white">{metric.title}</h4>
                      <p className="text-sm text-purple-300">Click to analyze</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Metric Analysis */}
      {selectedMetricData && selectedMetricData.data && (
        <div className="space-y-6">
          {/* Metric Overview */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">{selectedMetricData.title}</h3>
              <div className={`w-12 h-12 bg-gradient-to-r ${selectedMetricData.color} rounded-lg flex items-center justify-center`}>
                <selectedMetricData.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(selectedMetricData.data).map(([key, value]) => (
                <div key={key} className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
                  <h4 className="font-semibold text-purple-300 mb-2 capitalize text-sm">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <div className="text-2xl font-bold text-white">
                    {typeof value === 'number' ? (
                      key.includes('rate') || key.includes('growth') || key.includes('percentage') || key.includes('trend') ? 
                        formatPercentage(value * 100) : 
                        key.includes('revenue') || key.includes('spend') || key.includes('income') || key.includes('cash') || key.includes('cost') || key.includes('average') || key.includes('volatility') || key.includes('acquisition') ?
                          formatCurrency(value) :
                          Math.round(value)
                    ) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleBarChart 
              data={selectedMetricData.data} 
              title={`${selectedMetricData.title} Breakdown`}
              color={selectedMetricData.id === 'revenue' ? 'green' : 
                     selectedMetricData.id === 'cash_flow' ? 'blue' : 'purple'}
            />
            
            {/* Trend Analysis */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-lg p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]">
              <h4 className="font-semibold text-white mb-4">Trend Analysis</h4>
              <div className="space-y-3">
                {Object.entries(selectedMetricData.data)
                  .filter(([key, value]) => 
                    typeof value === 'number' && 
                    (key.includes('growth') || key.includes('rate') || key.includes('trend') || key.includes('change'))
                  )
                  .map(([key, value]) => (
                    <TrendIndicator 
                      key={key}
                      value={value} 
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                    />
                  ))}
                {Object.entries(selectedMetricData.data).filter(([key, value]) => 
                  typeof value === 'number' && 
                  (key.includes('growth') || key.includes('rate') || key.includes('trend') || key.includes('change'))
                ).length === 0 && (
                  <div className="text-purple-200 text-sm">
                    <p>Key Metrics:</p>
                    {Object.entries(selectedMetricData.data).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex justify-between mt-2 p-2 bg-white/5 rounded">
                        <span className="text-purple-300 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-white font-semibold">
                          {typeof value === 'number' ? 
                            (key.includes('revenue') || key.includes('spend') || key.includes('income') || key.includes('cash') || key.includes('cost') ?
                              formatCurrency(value) : Math.round(value)) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Future Predictions */}
      {predictions && Object.keys(predictions).length > 0 && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Future Predictions</h3>
            <div className="flex space-x-2">
              {Object.keys(predictions).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {predictions[selectedTimeframe] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {predictions[selectedTimeframe].projected_acquisitions && (
                <div className="bg-purple-500/20 backdrop-blur-xl rounded-lg p-4 border border-purple-400/30 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Projected Acquisitions</h4>
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {Math.round(predictions[selectedTimeframe].projected_acquisitions)}
                  </div>
                  <div className="text-sm text-purple-300">
                    Spend: {formatCurrency(predictions[selectedTimeframe].projected_marketing_spend)}
                  </div>
                </div>
              )}

              {predictions[selectedTimeframe].risk_level && (
                <div className="bg-orange-500/20 backdrop-blur-xl rounded-lg p-4 border border-orange-400/30 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Risk Assessment</h4>
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${
                    predictions[selectedTimeframe].risk_level === 'high' ? 'text-red-400' :
                    predictions[selectedTimeframe].risk_level === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
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
      )}

      {/* Data Quality Indicator */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-white">Data Quality Status</h3>
              <p className="text-sm text-purple-200">
                {availableMetrics.length} metrics available from uploaded data
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {availableMetrics.length}/3
            </div>
            <div className="text-sm text-purple-300">Metrics</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;