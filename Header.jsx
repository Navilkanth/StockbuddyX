import React from 'react';
import { Moon, Sun, Search, Mic, RefreshCw } from 'lucide-react';
import Logo from './Logo';
import MarketStatus from './MarketStatus';
import { useTheme } from '../hooks/useTheme';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

const Header = ({ searchTerm, onSearchChange, onRefresh, lastUpdated, isLoading, error }) => {
  const { theme, toggleTheme } = useTheme();
  const { isListening, transcript, startListening, isSupported } = useVoiceSearch();

  React.useEffect(() => {
    if (transcript) {
      onSearchChange(transcript);
    }
  }, [transcript, onSearchChange]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks by name or symbol..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {isSupported && (
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isListening 
                      ? 'text-red-500 bg-red-100 dark:bg-red-900' 
                      : 'text-gray-400 hover:text-green-500 hover:bg-green-100 dark:hover:bg-green-900'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MarketStatus 
              lastUpdated={lastUpdated} 
              isLoading={isLoading} 
              error={error} 
            />
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;