export const web3Map = {
    SET_WALLET_ACCOUNT_START: "SET_WALLET_ACCOUNT_START",
    SET_WALLET_ACCOUNT_SUCCESS: "SET_WALLET_ACCOUNT_SUCCESS",
    SET_WALLET_ACCOUNT_ERROR: "SET_WALLET_ACCOUNT_ERROR",

    LAUNCH_SALE_START: "LAUNCH_SALE_START",
    LAUNCH_SALE_SUCCESS: "LAUNCH_SALE_SUCCESS",
    LAUNCH_SALE_ERROR: "LAUNCH_SALE_ERROR",

    GET_NFT_ADDRESSES_START: "GET_NFT_ADDRESSES_START",
    GET_NFT_ADDRESSES_SUCCESS: "GET_NFT_ADDRESSES_SUCCESS",
    GET_NFT_ADDRESSES_ERROR: "GET_NFT_ADDRESSES_ERROR"
}

export const web3Actions = {
    setWalletAccountStart: () => ({ type: web3Map.SET_WALLET_ACCOUNT_START }),
    setWalletAccountSuccess: () => ({ type: web3Map.SET_WALLET_ACCOUNT_SUCCESS }),
    setWalletAccountError: () => ({ type: web3Map.SET_WALLET_ACCOUNT_ERROR }),

    launchSaleStart: () => ({ type: web3Map.LAUNCH_SALE_START }),
    launchSaleSuccess: () => ({ type: web3Map.LAUNCH_SALE_SUCCESS }),
    launchSaleError: () => ({ type: web3Map.LAUNCH_SALE_ERROR }),

    getNFTAddressesStart: () => ({ type: web3Map.GET_NFT_ADDRESSES_START }),
    getNFTAddressesSuccess: (data) => ({ type: web3Map.GET_NFT_ADDRESSES_SUCCESS, payload: data }),
    getNFTAddressesError: (error) => ({ type: web3Map.GET_NFT_ADDRESSES_ERROR, payload: error })
}