import Web3 from 'web3';
import { Toast } from '../../component/Toast';
import { getChainData } from './utils';
import { fromWei } from '../../helpers/bn.helper';

const loadWeb3 = async (autoConnect) => {
  if (!window.ethereum) {
    if (autoConnect) {
      Toast.fire({ icon: 'error', title: 'Metamask extension is not found! Please install Metamask to connect.' });
    }
    return;
  }

  try {
    window.web3 = new Web3(window.ethereum);

    const accounts = await window.web3.eth.getAccounts();
    if (accounts.length !== 0 || autoConnect) {
      await window.ethereum.enable();
    }
  } catch (e) {
    console.error(e.message);
  }
};

const loadBlockChainData = async (autoConnect, defaultNetworkDetails, setNetworkDetails, networkDetails) => {
  if (!window.ethereum) return;

  const accounts = await window.web3.eth.getAccounts();
  if (accounts.length === 0) return;

  try {
    const web3 = await window.web3;

    const chainId = await web3.eth.getChainId();
    const chainData = chainId ? getChainData(chainId) : 1280;

    if (chainData && chainData.isChainValid) {
      await setNetworkDetails({
        ...networkDetails,
        address: accounts[0],
        web3: web3,
        connected: accounts.length > 0,
        wallet: 'metamask',
        chainData: chainData,
        chainId: chainId,
        networkId: await web3.eth.net.getId(),
        balance: accounts.length > 0 ? fromWei(await web3.eth.getBalance(accounts[0])).toString() : 0,
      });
    } else {
      if (autoConnect) {
        Toast.fire({ icon: 'error', title: 'Network is not supported.' });
      }
      await setNetworkDetails({ ...defaultNetworkDetails, connected: false });
    }
  } catch (err) {
    console.log(err);
  }
};

const listenNetworkChange = async (setNetworkDetails) => {
  if (!window.ethereum) return;

  window.ethereum.on('networkChanged', async () => {
    const chainId = await window.web3.eth.getChainId();
    const chainData = chainId ? getChainData(chainId) : 1280;
    const networkId = await window.web3.eth.net.getId();

    if (chainData && chainData.isChainValid) {
      await setNetworkDetails((prevState) => ({
        ...prevState,
        chainId: chainId,
        networkId: networkId,
        chainData: chainData
      }));
    } else {
      Toast.fire({ icon: 'error', title: 'Network is not supported.' });
    }
  });
};

export { loadWeb3, loadBlockChainData, listenNetworkChange };
