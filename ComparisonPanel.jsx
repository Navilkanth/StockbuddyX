import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const ComparisonPanel = ({
  selectedStocks,
  onRemoveStock,
  onClearAll
}) => {
  if (selectedStocks.length === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Stock Comparison ({selectedStocks.length}/4)
        </h3>
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedStocks.map((stock) => (
          <div key={stock.symbol} className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <button
              onClick={() => onRemoveStock(stock.symbol)}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{stock.symbol}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{stock.name}</p>
              </div>

              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stock.price)}
              </div>

              <div className={`flex items-center gap-1 text-sm font-medium ${
                stock.change >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatNumber(stock.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">P/E Ratio</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stock.pe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volume</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stock.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sector</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stock.sector}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonPanel;