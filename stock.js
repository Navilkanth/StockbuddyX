// Stock data structure and type definitions

// Base Stock object structure
const Stock = {
  symbol: '',
  name: '',
  price: 0,
  change: 0,
  changePercent: 0,
  volume: 0,
  marketCap: 0,
  sector: '',
  logo: '',
  high: 0,
  low: 0,
  open: 0,
  previousClose: 0,
  eps: 0,
  pe: 0,
  partnerships: []
};

export const StockTypes = {
  // Stock object structure
  Stock,
  
  // Watchlist item structure
  WatchlistItem: {
    symbol: '',
    addedAt: ''
  },
  
  // Comparison stock with historical data
  ComparisonStock: {
    ...Stock,
    historicalData: []
  }
};

// Sort field options
export const SORT_FIELDS = {
  NAME: 'name',
  PRICE: 'price',
  CHANGE: 'change',
  CHANGE_PERCENT: 'changePercent',
  VOLUME: 'volume',
  MARKET_CAP: 'marketCap'
};

// Sort order options
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Theme modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};