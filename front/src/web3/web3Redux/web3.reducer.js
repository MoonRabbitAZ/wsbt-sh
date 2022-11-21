import { web3Map } from "./web3.actions"


const initialState = {
    isStatusChanged: false,
    SADetails: []
}

export const web3Reducer = (state = initialState, action) => {

    switch (action.type) {

        case web3Map.SET_WALLET_ACCOUNT_START: {
            return {
                ...state
            }
        }
        case web3Map.LAUNCH_SALE_START: {
            return {
                ...state,
                isStatusChanged: false
            }
        }

        case web3Map.LAUNCH_SALE_SUCCESS: {
            return {
                ...state,
                isStatusChanged: true
            }
        }

        case web3Map.GET_NFT_ADDRESSES_START: {
            return {
                ...state
            }
        }

        case web3Map.GET_NFT_ADDRESSES_SUCCESS: {
            return {
                ...state,
                SADetails: action.payload
            }
        }

        case web3Map.GET_NFT_ADDRESSES_ERROR: {
            return {
                ...state,
            }
        }


        default: return { ...state }
    }



}