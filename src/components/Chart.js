import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Chart = ({ type, title, data, isDarkMode = false }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    // Import Chart.js dynamically
    import('chart.js/auto').then(({ Chart }) => {
      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      
      // Chart configuration based on type
      let config = {
        type: type,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: isDarkMode ? '#e5e7eb' : '#374151',
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: title,
              color: isDarkMode ? '#f3f4f6' : '#111827',
              font: {
                family: 'Playfair Display, serif',
                size: 16,
                weight: 'normal'
              }
            }
          },
          scales: type !== 'doughnut' ? {
            x: {
              ticks: {
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              },
              grid: {
                color: isDarkMode ? '#374151' : '#e5e7eb'
              }
            },
            y: {
              ticks: {
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              },
              grid: {
                color: isDarkMode ? '#374151' : '#e5e7eb'
              }
            }
          } : {}
        }
      };

      // Special handling for gauge chart
      if (type === 'gauge') {
        config = {
          type: 'doughnut',
          data: {
            labels: ['Used', 'Remaining'],
            datasets: [{
              data: [data.value, data.max - data.value],
              backgroundColor: [data.color, isDarkMode ? '#374151' : '#e5e7eb'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: `${title}: ${data.value}`,
                color: isDarkMode ? '#f3f4f6' : '#111827',
                font: {
                  family: 'Playfair Display, serif',
                  size: 16,
                  weight: 'normal'
                }
              }
            }
          }
        };
      }

      chartInstanceRef.current = new Chart(ctx, config);
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data, title, isDarkMode]);

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

export default Chart;
