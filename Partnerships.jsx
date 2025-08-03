import React from 'react';
import { Building2, Users, ArrowRight } from 'lucide-react';

const Partnerships = ({ stocks }) => {
  const getPartnershipData = () => {
    const partnerships = {};
    stocks.forEach(stock => {
      if (stock.partnerships) {
        partnerships[stock.symbol] = stock.partnerships;
      }
    });
    return partnerships;
  };

  const partnerships = getPartnershipData();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Company Partnerships</h2>
        <p className="text-gray-600 dark:text-gray-400">Explore strategic partnerships and collaborations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(partnerships).map(([symbol, partners]) => {
          const company = stocks.find(s => s.symbol === symbol);
          if (!company) return null;

          return (
            <div key={symbol} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{symbol}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{partners.length} Strategic Partners</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {partners.map((partner, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">{partner}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Partnerships;