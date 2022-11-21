
const Web3 = require("web3");
const config = require("./config")
const web3 = new Web3(config.RPCURL);
const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);
const axios = require("axios")

const placeBetCrypto = async (index, price, percent, poolId, amount, address) => {

    let data = {}
    data.value = (Number(percent) * 100).toFixed(6)
    data.index = index
    data.address = address
    data.balance = web3.utils.toWei(amount.toString(), 'ether')
    data.bundleId = Number(poolId)
    data.price = Math.round(Number(price) * 100)
    data.percent = Math.round(Number(percent) * 100)

    let placeBetResp = await placeBet(myContract, address, data)

}

function placeBet(ercInstance, walletAddress, data) {
    let tx = {
        //     // this could be provider.addresses[0] if it exists
        from: config.OWNERAddress,
        //     // target address, this could be a smart contract address
        to: config.CONTRACT_ADDRESS,
        gas: 10000000,
        data: myContract.methods.PlaceBet(data.index, data.price, data.percent, data.bundleId, data.balance).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, "1bfd3e152caf6a2df1d5a22b4441286bce14ddd354a653e2b3239ceb4118ac43");
    signPromise.then(async (signedTx) => {

        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);

        sentTx.on("receipt", async receipt => {
            console.log("Bet Created", receipt.transactionHash);

            data.price = Web3.utils.toWei(data.price.toString(), 'ether')
            data.value = Number(data.percent)
            console.log({data})
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/prediction/new',
                data
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        sentTx.on("error", error => {
            console.log({ error });
        })
    })
}

//placeBetCrypto(index, price, percent, poolId, amount, address)
//0x8Fb2e3F1B02ec3f72a12F1e9de12B23d85825094
//0xBB8cF282aB0529c56a8b76b7AbA6E8f5d7826733
//placeBetCrypto(0, 30477, 0, 15, 300, "0xBB8cF282aB0529c56a8b76b7AbA6E8f5d7826733")
placeBetCrypto(1, 2070, 0, 15, 400, "0x8Fb2e3F1B02ec3f72a12F1e9de12B23d85825094")