import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [currentTheme, setCurrentThemeState] = useState<string | null>('');

  const setTheme = (theme: string) => {
    if (currentTheme) {
      document.body.classList.remove(currentTheme);
    }
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    setCurrentThemeState(theme);
  };

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
  }, []);

  const toggleTheme = () => {
    return currentTheme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return {
    toggleTheme,
    currentTheme,
  };
};
