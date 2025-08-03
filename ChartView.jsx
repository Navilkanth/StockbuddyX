import React, { useState } from 'react';
import { BarChart3, TrendingUp, Eye } from 'lucide-react';
import StockChart from './StockChart';
import StockCard from './StockCard';

const ChartView = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1M');

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const topStocks = stocks.slice(0, 8); // Show top 8 stocks for selection

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live Stock Charts</h2>
        <p className="text-gray-600 dark:text-gray-400">Interactive charts with real-time data and historical analysis</p>
      </div>

      {/* Chart Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <StockChart 
            symbol={selectedStock?.symbol}
            stockData={selectedStock}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Stock Selection Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Stock</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose a stock to view its chart</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {topStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedStock?.symbol === stock.symbol
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-24">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                      <p className={`text-xs font-medium ${
                        stock.change >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Info */}
          {selectedStock && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chart Analysis</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Period</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                  <span className="font-medium text-gray-900 dark:text-white">${selectedStock.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Day Change</span>
                  <span className={`font-medium ${
                    selectedStock.change >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Day Range</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${selectedStock.low.toFixed(2)} - ${selectedStock.high.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volume</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(selectedStock.volume / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stock Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Stocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} onClick={() => handleStockSelect(stock)} className="cursor-pointer">
              <StockCard 
                stock={stock}
                isSelected={selectedStock?.symbol === stock.symbol}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartView;