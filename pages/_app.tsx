
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import apolloClient from "../utils/apollo-client";
import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import Cookies from "universal-cookie";
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import createEmotionCache from '../utils/createEmotionCache';

const isBrowser = typeof document !== 'undefined';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};