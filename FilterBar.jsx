import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { SORT_FIELDS, SORT_ORDERS } from '../types/stock.js';
import { sectors } from '../data/mockStocks.js';

const FilterBar = ({
  selectedSector,
  sortField,
  sortOrder,
  onSectorChange,
  onSortChange
}) => {
  const sortOptions = [
    { field: SORT_FIELDS.NAME, label: 'Name' },
    { field: SORT_FIELDS.PRICE, label: 'Price' },
    { field: SORT_FIELDS.CHANGE, label: 'Change' },
    { field: SORT_FIELDS.CHANGE_PERCENT, label: 'Change %' },
    { field: SORT_FIELDS.VOLUME, label: 'Volume' },
    { field: SORT_FIELDS.MARKET_CAP, label: 'Market Cap' }
  ];

  const handleSortClick = (field) => {
    const newOrder = sortField === field && sortOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC;
    onSortChange(field, newOrder);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sector:</label>
            <select
              value={selectedSector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <div className="flex gap-1">
              {sortOptions.map(option => (
                <button
                  key={option.field}
                  onClick={() => handleSortClick(option.field)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    sortField === option.field
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                  {sortField === option.field && (
                    <ArrowUpDown className={`w-3 h-3 transition-transform ${
                      sortOrder === SORT_ORDERS.DESC ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;