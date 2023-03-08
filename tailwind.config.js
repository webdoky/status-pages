module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          background: 'var(--color-ui-background)',
          sidebar: 'var(--color-ui-sidebar)',
          typo: 'var(--color-ui-typo)',
          primary: 'var(--color-ui-primary)',
          border: 'var(--color-ui-border)',
          footer: 'var(--color-ui-footer)',
        },
      },
      spacing: {
        sm: '24rem',
      },
      screens: {
        xxl: '1400px',
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
};
