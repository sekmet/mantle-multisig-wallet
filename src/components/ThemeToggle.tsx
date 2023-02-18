import type { FC } from 'react';
import { MdDarkMode, MdWbSunny } from 'react-icons/md';

import Button from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: FC = () => {
  const { toggleTheme, currentTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="rounded-xl !bg-slate-200 py-3 px-2 dark:!bg-navy-900"
    >
      {currentTheme === 'light' ? (
        <MdDarkMode className="text-navy-900" />
      ) : (
        <MdWbSunny className="text-amber-400" />
      )}
    </Button>
  );
};

export default ThemeToggle;
