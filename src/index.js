import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { UseWalletProvider } from 'use-wallet';

ReactDOM.render(
  <UseWalletProvider
    chainId={43114}
    connectors={{
      walletconnect: { rpcUrl: 'https://api.avax.network/ext/bc/C/rpc'},
    }}
  >
    <App />
  </UseWalletProvider>
  , document.getElementById('root'));
registerServiceWorker();
