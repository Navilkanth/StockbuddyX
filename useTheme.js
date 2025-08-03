import { useState, useEffect } from 'react';
import { THEME_MODES } from '../types/stock.js';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('stockbuddy-theme');
    return savedTheme || THEME_MODES.LIGHT;
  });

  useEffect(() => {
    localStorage.setItem('stockbuddy-theme', theme);
    if (theme === THEME_MODES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT);
  };

  return { theme, toggleTheme };
};