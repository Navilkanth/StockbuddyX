import React from 'react';
import { Clock, Wifi, WifiOff } from 'lucide-react';

const MarketStatus = ({ lastUpdated, isLoading, error }) => {
  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isLoading) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (error) return <WifiOff className="w-4 h-4" />;
    if (isLoading) return <Clock className="w-4 h-4 animate-spin" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isLoading) return 'Updating...';
    return 'Live Data';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-medium">{getStatusText()}</span>
      </div>
      {lastUpdated && !isLoading && (
        <div className="text-gray-500 dark:text-gray-400">
          Last updated: {formatTime(lastUpdated)}
        </div>
      )}
    </div>
  );
};

export default MarketStatus;