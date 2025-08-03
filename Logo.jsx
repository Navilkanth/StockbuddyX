import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
          <TrendingDown className="w-3 h-3 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Stock<span className="text-green-600">Buddy</span><span className="text-blue-600">X</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Real-Time Market Analysis</p>
      </div>
    </div>
  );
};

export default Logo;