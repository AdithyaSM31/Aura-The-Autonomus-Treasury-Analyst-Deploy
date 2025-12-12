import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('cashflow');

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available. Please upload a file first.</p>
      </div>
    );
  }

  const { kpis } = data;

  // Generate sample data for charts
  const generateCashFlowData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenue = [120000, 135000, 142000, 158000, 165000, 172000];
    const expenses = [95000, 102000, 108000, 115000, 120000, 125000];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: revenue,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: expenses,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const generateROIData = () => {
    const channels = ['Adwords', 'Facebook', 'Organic', 'Email', 'LinkedIn'];
    const roi = [3.2, 2.8, 4.1, 5.2, 2.5];
    
    return {
      labels: channels,
      datasets: [
        {
          label: 'ROI',
          data: roi,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const generateBudgetData = () => {
    return {
      labels: ['Marketing', 'Operations', 'R&D', 'Sales'],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
        },
      },
    },
  };

  const charts = [
    { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
    { id: 'roi', label: 'ROI by Channel', icon: BarChart3 },
    { id: 'budget', label: 'Budget Allocation', icon: PieChart },
  ];

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' },
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'cashflow':
        return <Line data={generateCashFlowData()} options={chartOptions} />;
      case 'roi':
        return <Bar data={generateROIData()} options={chartOptions} />;
      case 'budget':
        return <Doughnut data={generateBudgetData()} options={doughnutOptions} />;
      default:
        return <Line data={generateCashFlowData()} options={chartOptions} />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <h2 className="text-heading text-white">Analytics Dashboard</h2>
            <div className="flex items-center space-x-3 text-caption">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-3">
              {charts.map((chart) => {
                const Icon = chart.icon;
                return (
                  <button
                    key={chart.id}
                    onClick={() => setSelectedChart(chart.id)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${selectedChart === chart.id
                        ? 'btn-primary shadow-lg'
                        : 'btn-secondary'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{chart.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="form-input w-auto"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button className="btn-primary flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-8"
      >
        <div className="h-[500px]">
          {renderChart()}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="glass rounded-2xl p-8 card-hover">
          <h3 className="text-subheading text-white mb-6">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg. Daily Revenue</span>
              <span className="text-white font-bold text-lg">$5,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Growth Rate</span>
              <span className="text-green-400 font-bold text-lg">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Customer LTV</span>
              <span className="text-white font-bold text-lg">$2,400</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 card-hover">
          <h3 className="text-subheading text-white mb-6">Channel Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Organic</span>
              <span className="text-green-400 font-bold text-lg">4.1x ROI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email</span>
              <span className="text-green-400 font-bold text-lg">5.2x ROI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Adwords</span>
              <span className="text-yellow-400 font-bold text-lg">3.2x ROI</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 card-hover">
          <h3 className="text-subheading text-white mb-6">Financial Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cash Runway</span>
              <span className="text-white font-bold text-lg">18 months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Burn Rate</span>
              <span className="text-white font-bold text-lg">$45K/month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Profit Margin</span>
              <span className="text-green-400 font-bold text-lg">28.5%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
