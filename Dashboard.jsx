import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const Dashboard = ({ stocks }) => {
  const topGainers = stocks
    .filter(stock => stock.change > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = stocks
    .filter(stock => stock.change < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const DashboardCard = ({ title, stocks, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(stock.price)}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              stock.change >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {stock.changePercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Market Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Real-time stock performance and market trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Top Gainers"
          stocks={topGainers}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Top Losers"
          stocks={topLosers}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-red-500"
        />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Market Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Stocks</span>
              <span className="font-medium text-gray-900 dark:text-white">{stocks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gainers</span>
              <span className="font-medium text-green-600 dark:text-green-400">{topGainers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Losers</span>
              <span className="font-medium text-red-600 dark:text-red-400">{topLosers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Change</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(stocks.reduce((acc, stock) => acc + stock.changePercent, 0) / stocks.length).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;