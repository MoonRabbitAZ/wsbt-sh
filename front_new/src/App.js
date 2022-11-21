import React, { Suspense, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Spiner } from './component/Spiner';
import { ToastContainer, toast } from 'react-toastify';
import { Web3Provider } from './web3/contexts/web3Context';
import { loadWeb3, loadBlockChainData, listenNetworkChange } from './web3/helpers/web3';
import { AppProvider } from './helpers/appProvider.helper';
import { startPreloader, endPreloader } from './redux/action/web3.action';

import MainRoutes from './routes/MainRoutes';
import LottieLoader from './helpers/lottieLoader';

import './assets/scss/App.scss';

require('dotenv').config();

const App = () => {
  const defaultNetworkDetails = {
    address: '',
    web3: '',
    connected: '',
    connectTag: '',
    chainData: '',
    wallet: '',
    chainId: '',
    networkId: '',
    balance: ''
  };

  const [networkDetails, setNetworkDetails] = useState(defaultNetworkDetails);

  const dispatch = useDispatch();
  const preloader = useSelector((state) => state.web3Reducer);

  useEffect(async () => {
    await handleConnect();
  }, []);

  const handleConnect = async (autoConnect = false) => {
    dispatch(startPreloader());
    try {
      await loadWeb3(autoConnect);
      await loadBlockChainData(autoConnect, defaultNetworkDetails, setNetworkDetails, networkDetails);
      await listenNetworkChange(setNetworkDetails);
    } catch(e) {
      toast.info(e.message);
    }
    dispatch(endPreloader());
  };

  return (
    <>
      {preloader.current !== preloader.potential ? (
          <div className="lotties-loader">
            <LottieLoader />
          </div>
        ) : (
          ''
        )}

        <Web3Provider
        value={{
          loadWeb3,
          networkDetails,
          setNetworkDetails,
          loadBlockChainData,
          listenNetworkChange,
          handleConnect
        }}
      >
        <Router>
          <div className="App">
            <Suspense fallback={<Spiner />}>
              <AppProvider>
                 <MainRoutes />
              </AppProvider>
            </Suspense>
            <ToastContainer theme="colored" autoClose={3000} />
          </div>
        </Router>
      </Web3Provider>
    </>
  );
};

export default App;
