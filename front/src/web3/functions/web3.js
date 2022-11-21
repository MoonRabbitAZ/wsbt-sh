import Web3 from "web3";
import { Toast } from "../../component/Toast";
import { getChainData } from "../helpers/utils";
/////////// CHECK IF BROWSER IS ENABLED WITH Web3 //////////////

const loadWeb3 = async (setLoading) => {
    try {
        if (window.ethereum) {
            window.web3 = await new Web3(window.ethereum);
            await window.ethereum.enable();
            // } else if (window.web3) {
            //   window.web3 = new Web3(window.web3.currentProvider);
            // }
        } else {
            // window.alert('Non-Ethereum browser detected. you should consider trying MetaMask')
        }
    } catch (err) {
        setLoading(false);
        console.log(err, "sssserrorrr");
    }
};

////////// GET METAMASK ACCOUNT AND CREATE CONTRACT INSTANCES ////////////////

const loadBlockChainData = async (
    setNetworkDetails,
    networkDetails,
    setLoading
) => {
    
    try {
        const web3 = await window.web3;
        const wallet = "metamask";

        // listen the Chain ID
        const chainId = await window.ethereum.chainId;
        
        const chainData = chainId ? getChainData(chainId) : "0x500";
        if (chainData && chainData.isChainValid) {
            // Load Account
            const accounts = await web3.eth.getAccounts();
            let balance = await web3.eth.getBalance(accounts[0])
            balance = balance / 1e18
            localStorage.setItem("injected", true);
            localStorage.setItem("wallet_name", "metamask");
            // listen the Network ID
            const networkId = await web3.eth.net.getId();
            await setNetworkDetails({
                ...networkDetails,
                address: accounts[0],
                web3: web3,
                connected: true,
                wallet: wallet,
                chainData: chainData,
                chainId: chainId,
                networkId: networkId,
                balance: balance
            });
            await setLoading(false);
        } else {
            await setNetworkDetails({
                ...networkDetails,
                address: "",
                web3: "",
                connected: false,
                wallet: "",
                chainData: "",
                chainId: "",
                networkId: "",
                balance: ""

            });
            Toast.fire({icon: "error",title: "Network is not supported"});
            await setLoading(false);
        }

        // const tokenContract = await new web3.eth.Contract(
        //   TokenABI,
        //   TokenContractAddress
        // );

        // const guessContract = await new web3.eth.Contract(
        //   GuessABI,
        //   GuessContractAddress
        // );
        // await setTokenContract(tokenContract);

        // await setGuessContract(guessContract);
    } catch (err) {
        setLoading(false);
        console.log(err);
    }
};

////////// CHECK IF USER SELECTED A DIFFERENT ACCOUNT IN METAMASK ///////////////

const listenAccountChange = async (
    setNetworkDetails,
    networkDetails,
    setLoading,
    resetApp
) => {
    try {
        const web3 = window.web3;
        window.ethereum.on("accountsChanged", async () => {
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length !== 0) {
                //window.location.reload();
                setLoading(false);
            } else {
                setLoading(false);
                resetApp();
            }
        });
    } catch (err) {
        setLoading(false);
        console.log(err);
    }
};

////////// CHECK IF USER SELECTED A DIFFERENT NETWORK ////////////

const listenNetworkChange = async (
    setNetworkDetails,
    networkDetails,
    setLoading,
    resetApp
) => {
    try {
        const web3 = window.web3;
        window.ethereum.on("networkChanged", async () => {
            const chainId = await window.ethereum.chainId;
            console.log('chainIdchainId', chainId)
            const chainData = chainId ? await getChainData(chainId) : null;
            const networkId = await web3.eth.net.getId();
            if (chainData && chainData.isChainValid) {
                await setNetworkDetails((prevState) => ({
                    ...prevState,
                    chainId: chainId,
                    networkId: networkId,
                    chainData: chainData,
                }));
                setLoading(false);
            } else {
                console.log("outtttt")
                resetApp();
                Toast.fire({
                    icon: "warning",
                    title: "Network not supported"
                });
                setLoading(false);
            }
        });
    } catch (err) {
        setLoading(false);
    }
};

export {
    loadWeb3,
    loadBlockChainData,
    listenAccountChange,
    listenNetworkChange,
};
