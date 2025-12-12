import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

const Dashboard = ({ data, uploadedFile }) => {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available. Please upload a file first.</p>
      </div>
    );
  }

  const { kpis, sentinel_alert } = data;

  const kpiCards = [
    {
      id: 'cash_visibility',
      title: 'Cash Visibility',
      value: kpis.cash_visibility,
      format: 'currency',
      icon: DollarSign,
      color: 'blue',
      trend: '+12.5%'
    },
    {
      id: 'days_cash_on_hand',
      title: 'Days Cash on Hand',
      value: kpis.days_cash_on_hand,
      format: 'number',
      icon: Calendar,
      color: 'green',
      trend: '+8.2%'
    },
    {
      id: 'forecast_accuracy',
      title: 'Forecast Accuracy',
      value: kpis.forecast_accuracy * 100,
      format: 'percentage',
      icon: Target,
      color: 'purple',
      trend: '+2.1%'
    },
    {
      id: 'budget_vs_actual_spend',
      title: 'Budget vs Actual',
      value: kpis.budget_vs_actual_spend * 100,
      format: 'percentage',
      icon: TrendingUp,
      color: 'orange',
      trend: '-5.3%'
    },
    {
      id: 'payment_stp_rate',
      title: 'Payment STP Rate',
      value: kpis.payment_stp_rate * 100,
      format: 'percentage',
      icon: CheckCircle,
      color: 'green',
      trend: '+0.1%'
    },
    {
      id: 'cost_per_transaction',
      title: 'Cost Per Transaction',
      value: kpis.cost_per_transaction,
      format: 'currency',
      icon: DollarSign,
      color: 'blue',
      trend: '-2.4%'
    },
    {
      id: 'marketing_spend_roi',
      title: 'Marketing ROI',
      value: kpis.marketing_spend_roi,
      format: 'multiplier',
      icon: TrendingUp,
      color: 'green',
      trend: '+15.7%'
    },
    {
      id: 'customer_acquisition_cost',
      title: 'Customer Acquisition Cost',
      value: kpis.customer_acquisition_cost,
      format: 'currency',
      icon: Users,
      color: 'red',
      trend: '+23.1%'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'multiplier':
        return `${value.toFixed(1)}x`;
      case 'number':
        return Math.round(value).toLocaleString();
      default:
        return value.toString();
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (trend) => {
    const isPositive = trend.startsWith('+');
    return isPositive ? ArrowUpRight : ArrowDownRight;
  };

  const getTrendColor = (trend) => {
    const isPositive = trend.startsWith('+');
    return isPositive ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-12">
      {/* File Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-heading text-white mb-2">
              {uploadedFile?.name || 'Financial Data'}
            </h3>
            <p className="text-caption">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = getTrendIcon(kpi.trend);
          
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <TrendIcon className={`w-5 h-5 ${getTrendColor(kpi.trend)}`} />
                  <span className={`text-sm font-semibold ${getTrendColor(kpi.trend)}`}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
              
              <h3 className="text-caption mb-3">
                {kpi.title}
              </h3>
              <p className="text-3xl font-bold text-white">
                {formatValue(kpi.value, kpi.format)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Sentinel Alert */}
      {sentinel_alert && sentinel_alert.status === 'CRITICAL' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-strong border-l-4 border-red-500 rounded-2xl p-8"
        >
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading text-red-400 mb-4">
                🚨 Critical Alert: {sentinel_alert.headline}
              </h3>
              <p className="text-body text-gray-300 mb-6">
                {sentinel_alert.analysis}
              </p>
              <div className="glass rounded-xl p-6">
                <h4 className="text-subheading text-white mb-3">Impact Assessment:</h4>
                <p className="text-body text-gray-300 mb-4">{sentinel_alert.impact_assessment}</p>
                <h4 className="text-subheading text-white mb-3">Recommended Action:</h4>
                <p className="text-body text-gray-300">{sentinel_alert.recommended_action}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="glass-strong rounded-2xl p-8"
      >
        <h3 className="text-heading text-white mb-8">Financial Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 glass rounded-2xl card-hover">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-subheading text-white mb-2">Overall Health</h4>
            <p className="text-caption">Good</p>
          </div>
          
          <div className="text-center p-6 glass rounded-2xl card-hover">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-subheading text-white mb-2">Growth Trend</h4>
            <p className="text-caption">Positive</p>
          </div>
          
          <div className="text-center p-6 glass rounded-2xl card-hover">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-subheading text-white mb-2">Forecast Accuracy</h4>
            <p className="text-caption">Excellent</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
