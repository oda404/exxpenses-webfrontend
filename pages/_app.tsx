
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import apolloClient from "../utils/apollo-client";
import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
function createEmotionCache() {
  let insertionPoint: HTMLElement | undefined;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
    insertionPoint = emotionInsertionPoint as HTMLElement ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint })
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient} >
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
