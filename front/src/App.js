import React, { Suspense, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Spiner } from './component/Spiner';
import MainRoutes from './routes/MainRoutes';
import { ToastContainer, toast } from "react-toastify"
import { GlobalContext } from './context/globalContext';

import { Web3Provider } from "./web3/contexts/web3Context";
import {
  loadWeb3,
  loadBlockChainData,
  listenAccountChange,
  listenNetworkChange,
} from "./web3/functions/web3";

import { get } from './Utils/AppUtill';
import { AppProvider } from './state/app';
import { LOG_IN } from './action/reducer.types';
import './App.scss';

const App = ({ store }) => {
  /* web3 setup start */
  const [loading, setLoading] = useState(false);
  const [networkDetails, setNetworkDetails] = useState({
    address: "",
    web3: "",
    connected: "",
    connectTag: "",
    chainData: "",
    wallet: "",
    chainId: "",
    networkId: "",
    balance: "",
  });

  const resetApp = async () => {
    setNetworkDetails({
      address: "",
      web3: "",
      connected: false,
      connectTag: "",
      chainData: "",
      wallet: "",
      chainId: "",
      networkId: "",
      balance: "",
    });
    const web3 = window.web3;
    // localStorage.clear();
    //close -> disconnect
    if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
      await web3.currentProvider.disconnect();
    }
  };

  const handleConnect = async () => {
    
    const metaMaskInstalled = typeof window.web3 !== "undefined";
    if (metaMaskInstalled) {
      setLoading(true);
      await loadWeb3(setLoading);
      await loadBlockChainData(setNetworkDetails, networkDetails, setLoading);
      await listenAccountChange(
        setNetworkDetails,
        networkDetails,
        setLoading,
        resetApp
      );
      await listenNetworkChange(
        setNetworkDetails,
        networkDetails,
        setLoading,
        resetApp
      );
    } else {
      toast.info(
        "Metamask Extension Not Found ! Please Install Metamask to Connect"
      );
    }
  };

  useEffect(() => {
    let injected = localStorage.getItem("injected");
    if (injected && injected !== undefined) {
      let walletName = localStorage.getItem("wallet_name");
      //&& store.getState().auth.tokenVerified
      if (walletName && walletName !== undefined) {
        if (walletName === "metamask") {
          handleConnect();
        }
      }
    }
  }, []);

  /* web3 setup end */

  const [isLoggedIn, setIsLoggedIn] = useState(
    window.localStorage.getItem('token') !== 'null' &&
    window.localStorage.getItem('token'),
  )

  const [userData, setUserData] = useState(
    JSON.parse(window.localStorage.getItem('userData') || '{}'),
  )
  const [appToken, setAppToken] = useState(
    window.localStorage.getItem('token'),
  )

  const setUserInfo = data => {
    setUserData(data)
    window.localStorage.setItem('userData', JSON.stringify(data))
  }
  const setUserToken = data => {
    setAppToken(data)
    window.localStorage.setItem('token', data)
  }

  const { successLabels = [] } = useSelector(state => state.apiReducer)
  const { loginData = {} } = useSelector(state => state.authReducer)

  useEffect(() => {
    if (successLabels.includes(LOG_IN)) {
      setUserInfo(get(['user'], loginData))
      setUserToken(get(['jwt'], loginData))
      setIsLoggedIn(true)
    }
  }, [loginData, successLabels])

  return (
    <Web3Provider
      value={{
        loadWeb3,
        loading,
        setLoading,
        networkDetails,
        setNetworkDetails,
        loadBlockChainData,
        listenAccountChange,
        listenNetworkChange,
        handleConnect,
        resetApp,
      }}
    >
      <Router>
        <div className="App">
          <GlobalContext.Provider
            value={{
              isLoggedIn,
              setIsLoggedIn,
              setUserInfo,
              userData,
              appToken,
              setUserToken,
            }}
          >
            <Suspense fallback={<Spiner />}>
              <AppProvider>
                <MainRoutes />
              </AppProvider>
            </Suspense>
            <ToastContainer theme="colored" autoClose={3000} />
          </GlobalContext.Provider>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
