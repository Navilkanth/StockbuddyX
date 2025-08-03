import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import StockCard from './components/StockCard';
import ComparisonPanel from './components/ComparisonPanel';
import Watchlist from './components/Watchlist';
import Partnerships from './components/Partnerships';
import ChartView from './components/ChartView';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import AIAssistant from './components/AIAssistant';
import { useStockData } from './hooks/useStockData';
import { SORT_FIELDS, SORT_ORDERS } from './types/stock';
import { sectors } from './data/mockStocks';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [sortField, setSortField] = useState(SORT_FIELDS.NAME);
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.ASC);
  const [comparisonStocks, setComparisonStocks] = useState([]);

  // Use real stock data
  const { stocks, loading, error, lastUpdated, refreshData } = useStockData();

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by sector
    if (selectedSector !== 'All Sectors') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === SORT_ORDERS.ASC) {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [stocks, searchTerm, selectedSector, sortField, sortOrder]);

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleCompareStock = (stock) => {
    if (comparisonStocks.find(s => s.symbol === stock.symbol)) {
      setComparisonStocks(prev => prev.filter(s => s.symbol !== stock.symbol));
    } else if (comparisonStocks.length < 4) {
      setComparisonStocks(prev => [...prev, stock]);
    }
  };

  const handleRemoveFromComparison = (symbol) => {
    setComparisonStocks(prev => prev.filter(s => s.symbol !== symbol));
  };

  const handleClearComparison = () => {
    setComparisonStocks([]);
  };

  const renderContent = () => {
    if (loading && stocks.length === 0) {
      return <LoadingSpinner size="lg" text="Loading real-time market data..." />;
    }

    if (error && stocks.length === 0) {
      return <ErrorMessage message={error} onRetry={refreshData} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stocks={stocks} />;
      case 'stocks':
        return (
          <div className="space-y-6">
            <FilterBar
              selectedSector={selectedSector}
              sortField={sortField}
              sortOrder={sortOrder}
              onSectorChange={setSelectedSector}
              onSortChange={handleSortChange}
            />
            {filteredAndSortedStocks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No stocks found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedStocks.map((stock) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    onCompare={handleCompareStock}
                    isComparing={comparisonStocks.length > 0}
                    isSelected={comparisonStocks.some(s => s.symbol === stock.symbol)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'charts':
        return <ChartView stocks={stocks} />;
      case 'watchlist':
        return <Watchlist stocks={stocks} />;
      case 'compare':
        return (
          <div className="space-y-6">
            <ComparisonPanel
              selectedStocks={comparisonStocks}
              onRemoveStock={handleRemoveFromComparison}
              onClearAll={handleClearComparison}
            />
            {comparisonStocks.length < 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select stocks to compare ({comparisonStocks.length}/4 selected)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedStocks
                    .filter(stock => !comparisonStocks.some(s => s.symbol === stock.symbol))
                    .map((stock) => (
                      <StockCard 
                        key={stock.symbol} 
                        stock={stock} 
                        onCompare={handleCompareStock}
                        isComparing={true}
                        isSelected={false}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'partnerships':
        return <Partnerships stocks={stocks} />;
      default:
        return <Dashboard stocks={stocks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        onRefresh={refreshData}
        lastUpdated={lastUpdated}
        isLoading={loading}
        error={error}
      />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

export default App;