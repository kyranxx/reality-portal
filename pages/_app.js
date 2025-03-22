import '../src/app/globals.css';
import { AppProps } from 'next/app';
import { FirebaseAuthProvider } from '../src/utils/FirebaseAuthContext';
import { AppProvider } from '../src/contexts/AppContext';

/**
 * Custom App component for the Pages Router
 * This ensures that auth context is properly provided to all pages
 */
function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <FirebaseAuthProvider>
        <Component {...pageProps} />
      </FirebaseAuthProvider>
    </AppProvider>
  );
}

export default MyApp;
