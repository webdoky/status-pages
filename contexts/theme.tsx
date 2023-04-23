import { createContext, useContext, useEffect } from 'react';

import { useState } from 'react';

export const LIGHTS_OUT = 'lights-out';

const ThemeContext = createContext<[boolean, () => void]>([false, () => {}]);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (shouldBeDark: boolean) => {
    document.documentElement.toggleAttribute(LIGHTS_OUT, shouldBeDark);

    setDarkMode(shouldBeDark);

    writeToStorage(shouldBeDark);
  };

  const writeToStorage = (prefersDark: boolean) => {
    localStorage.setItem(LIGHTS_OUT, prefersDark ? 'true' : 'false');
  };

  const handleToggle = () => {
    const hasDarkMode = document.documentElement.hasAttribute(LIGHTS_OUT);

    return toggleDarkMode(!hasDarkMode);
  };

  useEffect(() => {
    const preservedState = localStorage.getItem(LIGHTS_OUT);

    if (preservedState !== undefined) {
      const shouldBeDark = preservedState === 'true';

      setDarkMode(shouldBeDark);
      document.documentElement.toggleAttribute(LIGHTS_OUT, shouldBeDark);
    }
  }, []);

  return (
    <ThemeContext.Provider value={[isDarkMode, handleToggle]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export default useTheme;
