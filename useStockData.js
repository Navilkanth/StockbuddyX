import { useState, useEffect, useCallback } from 'react';
import { yahooFinanceAPI, POPULAR_SYMBOLS } from '../services/yahooFinanceApi';

export const useStockData = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch stock data
  const fetchStocks = useCallback(async (symbols = POPULAR_SYMBOLS) => {
    try {
      setLoading(true);
      setError(null);
      
      const stockData = await yahooFinanceAPI.getStockQuotes(symbols);
      setStocks(stockData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search stocks
  const searchStocks = useCallback(async (query) => {
    try {
      const results = await yahooFinanceAPI.searchStocks(query);
      return results;
    } catch (err) {
      console.error('Error searching stocks:', err);
      return [];
    }
  }, []);

  // Get historical data for a stock
  const getHistoricalData = useCallback(async (symbol) => {
    try {
      const data = await yahooFinanceAPI.getHistoricalData(symbol);
      return data;
    } catch (err) {
      console.error('Error fetching historical data:', err);
      return [];
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Initial data fetch
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchStocks]);

  return {
    stocks,
    loading,
    error,
    lastUpdated,
    refreshData,
    searchStocks,
    getHistoricalData,
    fetchStocks
  };
};