import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays, subMonths, subYears } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ symbol, stockData, onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const periods = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '6M', value: '6M', days: 180 },
    { label: '1Y', value: '1Y', days: 365 }
  ];

  // Generate mock historical data based on current stock price
  const generateHistoricalData = (currentPrice, days) => {
    const data = [];
    const basePrice = currentPrice;
    let price = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      // Add some realistic price variation
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      price = price * (1 + variation);
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        price: Math.max(price, basePrice * 0.7) // Don't go below 70% of current price
      });
    }
    
    // Ensure the last price matches current price
    data[data.length - 1].price = currentPrice;
    
    return data;
  };

  useEffect(() => {
    if (!stockData) return;

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const period = periods.find(p => p.value === selectedPeriod);
      const historicalData = generateHistoricalData(stockData.price, period.days);
      
      const isPositive = stockData.change >= 0;
      const chartColor = isPositive ? '#22c55e' : '#ef4444';
      
      setChartData({
        labels: historicalData.map(item => {
          const date = new Date(item.date);
          if (selectedPeriod === '1D') {
            return format(date, 'HH:mm');
          } else if (selectedPeriod === '1W') {
            return format(date, 'EEE');
          } else {
            return format(date, 'MMM dd');
          }
        }),
        datasets: [
          {
            label: `${symbol} Price`,
            data: historicalData.map(item => item.price),
            borderColor: chartColor,
            backgroundColor: `${chartColor}20`,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: chartColor,
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2
          }
        ]
      });
      
      setLoading(false);
    }, 500);
  }, [symbol, stockData, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: stockData?.change >= 0 ? '#22c55e' : '#ef4444',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 6
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  if (!stockData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Select a stock to view its chart
        </div>
      </div>
    );
  }

  const isPositive = stockData.change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {symbol} - {stockData.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stockData.price.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                ${Math.abs(stockData.change).toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No chart data available
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Open</p>
          <p className="font-semibold text-gray-900 dark:text-white">${stockData.open.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">High</p>
          <p className="font-semibold text-gray-900 dark:text-white">${stockData.high.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Low</p>
          <p className="font-semibold text-gray-900 dark:text-white">${stockData.low.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Volume</p>
          <p className="font-semibold text-gray-900 dark:text-white">{stockData.volume.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;