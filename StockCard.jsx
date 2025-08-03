import React from 'react';
import { TrendingUp, TrendingDown, Star, StarOff, Building2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

const StockCard = ({ 
  stock, 
  onCompare, 
  isComparing = false, 
  isSelected = false 
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(stock.symbol);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(stock.symbol);
    } else {
      addToWatchlist(stock.symbol);
    }
  };

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

  const isPositive = stock.change >= 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
      isSelected ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{stock.symbol}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-32">{stock.name}</p>
            </div>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-lg transition-colors ${
              inWatchlist 
                ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900'
            }`}
          >
            {inWatchlist ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stock.price)}
            </span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
              isPositive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Market Cap</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(stock.marketCap)}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Volume</p>
              <p className="font-semibold text-gray-900 dark:text-white">{stock.volume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">P/E Ratio</p>
              <p className="font-semibold text-gray-900 dark:text-white">{stock.pe}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Sector</p>
              <p className="font-semibold text-gray-900 dark:text-white">{stock.sector}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Range: {formatCurrency(stock.low)} - {formatCurrency(stock.high)}
            </div>
            {onCompare && (
              <button
                onClick={() => onCompare(stock)}
                disabled={isComparing && !isSelected}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isSelected ? 'Selected' : 'Compare'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;