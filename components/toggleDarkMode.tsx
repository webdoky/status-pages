import { MoonIcon, SunIcon } from './icons';
import useTheme from '../contexts/theme';

export default function ToggleDarkMode({ className }: { className?: string }) {
  const [isDarkMode, handleToggle] = useTheme();

  return (
    <button
      className={className}
      aria-label="Перемкнути темний режим"
      title="Перемкнути темний режим"
      onClick={handleToggle}
    >
      {' '}
      {isDarkMode ? <MoonIcon size={1.7} /> : <SunIcon size={1.7} />}
    </button>
  );
}
