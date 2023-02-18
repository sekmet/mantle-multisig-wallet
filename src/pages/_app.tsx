import '../styles/css/app.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { WalletContextProvider } from '@/state/context/walletContextProvider';
import { Web3ContextProvider } from '@/state/context/web3ContextProvider';
import store from '@/state/store';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Provider store={store}>
      <Web3ContextProvider>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </Web3ContextProvider>
    </Provider>
  </>
);

export default MyApp;
