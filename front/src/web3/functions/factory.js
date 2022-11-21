import { enviornment } from "../../constants/constants";
import { launchSaleAsync } from "../web3Redux/web3.api";
import { userDispatch } from "react-redux"
import Web3 from "web3";

function getInstance(web3) {
    return new Promise(async (resolve, reject) => {
        if (web3 && web3 != '') {
            try {
                let Instance = await new web3.eth.Contract(
                    enviornment.ContractABI,
                    enviornment.ContractAddress
                );

                if (Instance) {
                    resolve(Instance);
                } else {
                    reject({ error: "Issue with instance" });
                }
            } catch (error) {
                reject(error);
            }
        }
    });
};

function getERCInstance(web3) {
    return new Promise(async (resolve, reject) => {
        if (web3 && web3 != '') {

            try {
                let Instance = await new web3.eth.Contract(
                    enviornment.ERC20ABI,
                    enviornment.ERC20Address
                );

                if (Instance) {
                    resolve(Instance);
                } else {
                    reject({ error: "Issue with instance" });
                }
            } catch (error) {
                reject(error);
            }
        }
    });
};

function getBalance(ercInstance, walletAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .balanceOf(walletAddress)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        console.log({ data })
                        if (data > 0) {
                            resolve(parseFloat(data / enviornment.divideValue).toFixed(2));
                            //resolve(parseFloat(data).toFixed(2));
                        } else {
                            resolve(data)
                        }
                    }

                });
        } catch (error) {
            reject(error);
        }
    });
};

function getPullAmount(ercInstance, walletAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .totalSupply()
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        if (data > 0) {
                            resolve(parseFloat(data));
                        } else {
                            resolve(data)
                        }
                    }

                });
        } catch (error) {
            reject(error);
        }
    });
};

function registerUser(ercInstance, walletAddress, user_name) {
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .Register(user_name)
                .send({ from: walletAddress })
                .on("receipt", function (receipt) {
                    resolve(receipt);
                })
                .on("error", function (error, receipt) {
                    console.log({ error })
                    reject({ error: error });
                });
        } catch (error) {
            console.log({ error })
            reject(error);
        }
    });
}

function approveTokens(ercInstance, walletAddress, token) {
    console.log({ token, walletAddress })
    return new Promise(async (resolve, reject) => {
        try {

            let amountVal = token
            //console.log({amountVal:Web3.utils.toWei(amountVal.toString(), 'ether')})
            /* console.log("AAAA",Web3.utils.toWei(amountVal.toString(),'ether'));
            console.log("BBB",Web3.utils.toBN(Web3.utils.toWei(amountVal.toString(),'ether')))
            let toBN = Web3.utils.toBN(amountVal)
            console.log("Amount",toBN) */
            return await ercInstance.methods
                .approve(enviornment.ContractAddress, Web3.utils.toWei(amountVal.toString(), 'ether'))
                .send({ from: walletAddress })
                .on("receipt", function (receipt) {
                    resolve(receipt);
                })
                .on("error", function (error, receipt) {
                    console.log({ error })
                    reject({ error: error });
                });
        } catch (error) {
            console.log({ error })
            resolve(error);
        }
    });
}

function getApprovedTokens(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .allowance(walletAddress, enviornment.ContractAddress)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        if (data > 0) {
                            resolve(parseFloat(data / enviornment.divideValue).toFixed(2));
                        } else {
                            resolve(data)
                        }
                    }

                });
        } catch (error) {
            reject(error);
        }
    });
}

function placeBet(ercInstance, walletAddress, data) {
    console.log({ data })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .PlaceBet(data.index, data.price, data.percent, data.bundleId, data.balance)
                .send({ from: walletAddress })
                .on("receipt", function (receipt) {
                    resolve(receipt);
                })
                .on("error", function (error, receipt) {
                    console.log({ error })
                    resolve({ error: error });
                });
        } catch (error) {
            console.log({ error })
            resolve(error);
        }
    });
}

function fetchLatestPool(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .bundleId()
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function fetchPoolDetails(ercInstance, walletAddress, poolId) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .fetchBundle(poolId)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function fetchOwner(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .owner()
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function fetchUser(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .fetchUser(walletAddress)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function fetchUserBets(ercInstance, walletAddress, data) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .fetchUserBets(walletAddress, data.poolId)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        console.log({ data })
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function fetchUserStaked(ercInstance, walletAddress, data) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .fetchUserBets(walletAddress, data.poolId)
                .call({ from: walletAddress }, (err, data) => {

                    if (err) {
                        reject({ error: err });
                    } else {
                        console.log({ data })
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function claimTokens(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {
            return await ercInstance.methods
                .withdraw()
                .send({ from: walletAddress })
                .on("receipt", function (receipt) {
                    resolve(receipt);
                })
                .on("error", function (error, receipt) {
                    console.log({ error })
                    resolve({ error: error });
                });
        } catch (error) {
            resolve(error);
        }
    });
}

function registerforMegapool(ercInstance, walletAddress) {
    console.log({ ercInstance })
    return new Promise(async (resolve, reject) => {
        try {

            const rebaseSessionId = await ercInstance.methods.rebaseSessionId().call();
            console.log({ rebaseSessionId })
            return await ercInstance.methods
                .participateForMegaPool(parseInt(rebaseSessionId) - 1)
                .send({ from: walletAddress }, (err, data) => {
                    if (err) {
                        reject({ error: err });
                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

export const poolMethods = {
    getInstance,
    getBalance,
    getPullAmount,
    approveTokens,
    getERCInstance,
    getApprovedTokens,
    placeBet,
    fetchLatestPool,
    fetchUserBets,
    registerUser,
    claimTokens,
    fetchOwner,
    fetchUser,
    registerforMegapool,
    fetchPoolDetails,
    fetchUserStaked
}