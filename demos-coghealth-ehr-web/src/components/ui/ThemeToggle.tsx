import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="flex items-center space-x-1 hover:text-white text-blue-200"
    >
      {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
