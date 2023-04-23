import { ThemeProvider } from '../contexts/theme';
import '../styles/globals.css';
import '../styles/wdPage.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
