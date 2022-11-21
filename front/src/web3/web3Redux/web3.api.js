import axios from "axios";
// import { Toast } from "../../../helpers/Toast";
import { web3Actions } from "./web3.actions";


export const setWalletAccountAsync = (walletAddress) => {
    return async (dispatch, getState) => {
        try {
            dispatch(web3Actions.setWalletAccountStart(walletAddress))
            let baseUrl = getState().auth.url.BASE_URL;
            let userToken = getState().auth.user.usr_jwt
            const { data } = await axios({
                method: "POST",
                url: `${baseUrl}user/editProfile`,
                data: {
                    type: "account",
                    usr_wallet_address: walletAddress
                },
                headers: {
                    "Authorization": userToken,
                    'Content-Type': "application/json",
                }
            });
            if (data.code === 200) {
                dispatch(web3Actions.setWalletAccountSuccess(data.data));
            } else {
                dispatch(web3Actions.setWalletAccountError(data.responseMessage));
            }
        } catch (error) {
            dispatch(web3Actions.setWalletAccountError());
        }
    }
}

export const launchSaleAsync = (saleId) => {
    return async (dispatch, getState) => {
        try {
            dispatch(web3Actions.launchSaleStart())
            let baseUrl = getState().auth.url.BASE_URL;
            let userToken = getState().auth.user.usr_jwt
            const { data } = await axios({
                method: "POST",
                url: `${baseUrl}project/pkgChangeStatus/${saleId}`,
                data: {
                    pkg_status: "Launched"
                },
                headers: {
                    "Authorization": userToken,
                    'Content-Type': "application/json",
                }
            });
            if (data.code === 200) {
                dispatch(web3Actions.launchSaleSuccess());
                // Toast.fire({
                //     icon: "success",
                //     title: data.message
                // })
            } else {
                dispatch(web3Actions.launchSaleError());
            }
        } catch (error) {
            dispatch(web3Actions.launchSaleError());
            // Toast.fire({
            //     icon: "error",
            //     title: "Error occured while launching sale"
            // })
        }
    }
}


export const getNFTAddressesAsync = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(web3Actions.getNFTAddressesStart())
            let baseUrl = getState().auth.url.BASE_URL;
            let userToken = getState().auth.user.usr_jwt
            const { data } = await axios({
                method: "POST",
                url: `${baseUrl}investment/NFTdetails`,
                headers: {
                    "Authorization": userToken,
                    'Content-Type': "application/json",
                }
            });
            if (data.code === 200) {
                dispatch(web3Actions.getNFTAddressesSuccess(data.data));
                // Toast.fire({
                //     icon: "success",
                //     title: data.message
                // })
            } else {
                dispatch(web3Actions.getNFTAddressesError(data.message));
            }
        } catch (error) {
            dispatch(web3Actions.getNFTAddressesError());
        }
    }
}
