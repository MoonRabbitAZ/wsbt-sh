import { enviornment } from "../../../constants/constants";
import { Toast } from "../../../helpers/Toast";

function getNFTInstance(address, web3) {
    return new Promise(async (resolve, reject) => {
        if (web3 && web3 != '') {
            try {

                let Instance = await new web3.eth.Contract(
                    enviornment.saNFTABI,
                    address
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


// 
// 

function getIdMapping(NFTInstance, userAccount) {
    return new Promise(async (resolve, reject) => {
        console.log(userAccount, "user--------------------")
        try {
            return await NFTInstance.methods
                .getSAList(userAccount)
                .call({ from: userAccount }, (err, data) => {
                    console.log("renderrrrr...................data.......", data)

                    if (err) {
                        reject({ error: "Issue with allowance" });

                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
};

// getSA

function getSA(NFTInstance, userAccount, id) {
    return new Promise(async (resolve, reject) => {
        try {
            return await NFTInstance.methods
                .getSA(id)
                .call({ from: userAccount }, (err, data) => {
                    console.log("renderrrrr...................data.......", data)

                    if (err) {
                        reject({ error: "Issue with allowance" });

                    } else {
                        resolve(data);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
};



function vest(NFTInstance, userAccount, setSCLoading, saId) {

    return new Promise(async (resolve, reject) => {
        try {
            return await NFTInstance.methods
                .vest(saId)
                .send({ from: userAccount })
                .on("receipt", function (receipt) {
                    setSCLoading(false)
                    resolve(receipt);
                })
                .on("error", function (error, receipt) {
                    setSCLoading(false)
                    reject({ error: error });

                }).then(function (res) {
                    if (res) {
                        setSCLoading(false)
                        resolve({});
                        Toast.fire({
                            icon: "success",
                            title: "Release Successful"
                        })
                        // window.location.reload()
                    }
                }).then((res) => {
                    // window.location.reload()
                })

        } catch (error) {
            reject(error);
        }
    });
};

export const NFTMethods = {
    getNFTInstance,
    getIdMapping,
    getSA,
    vest
}