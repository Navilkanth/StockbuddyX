// Yahoo Finance API service for real market data
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YAHOO_SEARCH_URL = 'https://query2.finance.yahoo.com/v1/finance/search';
const YAHOO_QUOTE_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';

// Popular stock symbols for initial data
export const POPULAR_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 
  'JPM', 'JNJ', 'V', 'WMT', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'PYPL',
  'ADBE', 'CRM', 'INTC', 'AMD', 'ORCL', 'IBM', 'CSCO', 'QCOM'
];

// Sector mapping for stocks
export const SECTOR_MAPPING = {
  'AAPL': 'Technology',
  'GOOGL': 'Technology',
  'MSFT': 'Technology',
  'TSLA': 'Automotive',
  'AMZN': 'E-commerce',
  'NVDA': 'Technology',
  'META': 'Technology',
  'NFLX': 'Entertainment',
  'JPM': 'Financial Services',
  'JNJ': 'Healthcare',
  'V': 'Financial Services',
  'WMT': 'Retail',
  'PG': 'Consumer Goods',
  'UNH': 'Healthcare',
  'HD': 'Retail',
  'MA': 'Financial Services',
  'DIS': 'Entertainment',
  'PYPL': 'Financial Services',
  'ADBE': 'Technology',
  'CRM': 'Technology',
  'INTC': 'Technology',
  'AMD': 'Technology',
  'ORCL': 'Technology',
  'IBM': 'Technology',
  'CSCO': 'Technology',
  'QCOM': 'Technology'
};

// Company partnerships data
export const PARTNERSHIPS = {
  'AAPL': ['Microsoft', 'Samsung', 'TSMC', 'Qualcomm'],
  'GOOGL': ['Samsung', 'LG', 'Qualcomm', 'HTC'],
  'MSFT': ['Apple', 'Samsung', 'Intel', 'AMD'],
  'TSLA': ['Panasonic', 'CATL', 'BYD', 'Samsung SDI'],
  'AMZN': ['Whole Foods', 'Rivian', 'Anthropic', 'Ring'],
  'NVDA': ['AMD', 'Intel', 'TSMC', 'Samsung'],
  'META': ['Oculus', 'WhatsApp', 'Instagram', 'Ray-Ban'],
  'NFLX': ['Disney', 'HBO', 'Paramount', 'Sony Pictures'],
  'JPM': ['Visa', 'Mastercard', 'PayPal', 'Square'],
  'JNJ': ['Pfizer', 'Merck', 'Abbott', 'Medtronic']
};

class YahooFinanceAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  // Helper method to handle CORS and fetch data
  async fetchWithProxy(url) {
    try {
      // Using a CORS proxy for Yahoo Finance API
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return JSON.parse(data.contents);
    } catch (error) {
      console.error('API fetch error:', error);
      // Fallback to mock data if API fails
      return this.getMockData();
    }
  }

  // Get stock quotes for multiple symbols
  async getStockQuotes(symbols = POPULAR_SYMBOLS) {
    const cacheKey = `quotes_${symbols.join(',')}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const symbolsString = symbols.join(',');
      const url = `${YAHOO_QUOTE_URL}?symbols=${symbolsString}`;
      
      const data = await this.fetchWithProxy(url);
      
      if (data && data.quoteResponse && data.quoteResponse.result) {
        const stocks = data.quoteResponse.result.map(quote => this.formatStockData(quote));
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: stocks,
          timestamp: Date.now()
        });
        
        return stocks;
      }
    } catch (error) {
      console.error('Error fetching stock quotes:', error);
    }

    // Return mock data as fallback
    return this.getMockData();
  }

  // Format Yahoo Finance data to our stock structure
  formatStockData(quote) {
    const symbol = quote.symbol;
    const price = quote.regularMarketPrice || quote.ask || 0;
    const previousClose = quote.regularMarketPreviousClose || price;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: symbol,
      name: quote.longName || quote.shortName || symbol,
      price: price,
      change: change,
      changePercent: changePercent,
      volume: quote.regularMarketVolume || quote.volume || 0,
      marketCap: quote.marketCap || 0,
      sector: SECTOR_MAPPING[symbol] || 'Technology',
      high: quote.regularMarketDayHigh || quote.dayHigh || price,
      low: quote.regularMarketDayLow || quote.dayLow || price,
      open: quote.regularMarketOpen || quote.open || price,
      previousClose: previousClose,
      eps: quote.epsTrailingTwelveMonths || 0,
      pe: quote.trailingPE || 0,
      partnerships: PARTNERSHIPS[symbol] || []
    };
  }

  // Search for stocks
  async searchStocks(query) {
    try {
      const url = `${YAHOO_SEARCH_URL}?q=${encodeURIComponent(query)}`;
      const data = await this.fetchWithProxy(url);
      
      if (data && data.quotes) {
        return data.quotes.slice(0, 10).map(quote => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          type: quote.quoteType
        }));
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
    
    return [];
  }

  // Get historical data for a stock
  async getHistoricalData(symbol, period = '1mo') {
    try {
      const url = `${YAHOO_FINANCE_BASE_URL}/${symbol}?period1=0&period2=9999999999&interval=1d`;
      const data = await this.fetchWithProxy(url);
      
      if (data && data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;
        
        return timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          price: prices[index] || 0
        })).filter(item => item.price > 0).slice(-30); // Last 30 days
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    
    return [];
  }

  // Mock data fallback
  getMockData() {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 185.72,
        change: 2.34,
        changePercent: 1.28,
        volume: 45234567,
        marketCap: 2890000000000,
        sector: 'Technology',
        high: 186.95,
        low: 182.10,
        open: 183.45,
        previousClose: 183.38,
        eps: 6.05,
        pe: 30.7,
        partnerships: ['Microsoft', 'Samsung', 'TSMC']
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 139.45,
        change: -1.85,
        changePercent: -1.31,
        volume: 28456789,
        marketCap: 1750000000000,
        sector: 'Technology',
        high: 142.20,
        low: 138.90,
        open: 141.50,
        previousClose: 141.30,
        eps: 5.80,
        pe: 24.0,
        partnerships: ['Samsung', 'LG', 'Qualcomm']
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.85,
        change: 5.67,
        changePercent: 1.52,
        volume: 32567890,
        marketCap: 2810000000000,
        sector: 'Technology',
        high: 380.12,
        low: 375.45,
        open: 376.20,
        previousClose: 373.18,
        eps: 9.65,
        pe: 39.2,
        partnerships: ['Apple', 'Samsung', 'Intel']
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 267.84,
        change: -12.45,
        changePercent: -4.44,
        volume: 89234567,
        marketCap: 852000000000,
        sector: 'Automotive',
        high: 275.30,
        low: 265.10,
        open: 272.85,
        previousClose: 280.29,
        eps: 3.10,
        pe: 86.4,
        partnerships: ['Panasonic', 'CATL', 'BYD']
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 142.37,
        change: 0.89,
        changePercent: 0.63,
        volume: 41234567,
        marketCap: 1480000000000,
        sector: 'E-commerce',
        high: 143.45,
        low: 140.85,
        open: 141.90,
        previousClose: 141.48,
        eps: 0.98,
        pe: 145.3,
        partnerships: ['Whole Foods', 'Rivian', 'Anthropic']
      }
    ];
  }

  // Get market summary
  async getMarketSummary() {
    try {
      const indices = ['^GSPC', '^DJI', '^IXIC']; // S&P 500, Dow Jones, NASDAQ
      const data = await this.getStockQuotes(indices);
      return data;
    } catch (error) {
      console.error('Error fetching market summary:', error);
      return [];
    }
  }
}

export const yahooFinanceAPI = new YahooFinanceAPI();
export default yahooFinanceAPI;