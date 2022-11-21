const axios = require('axios');

const baseUrl = 'http://localhost:5000/api';
// axios.post(`${baseUrl}/prediction/new`, {
//     address: "0x19ec1E4b714990620edf41fE28e9a1552953a7F4",
//     balance: "100000000000000000000",
//     bundleId: "20",
//     index: 11,
//     price: "2860000000000000000",
//     value: "1036269430051813471",
// }).then((res) => {
//     console.log(res.data);
// }).catch((err) => {
//     console.log(err);
// });

// axios.get(`${baseUrl}/crypto-prices`).then((res) => {
//     console.log(res.data);
// }).catch((err) => {
//     console.log(err);
// });
//
// axios.post(`${baseUrl}/NFT/create`, {
//     walletAddress: "0x8b09cd2Dd711c70e939A8Aee42DB8b3871e72D57",
//     userName: "Alex",
// }).then((res) => {
//     console.log(res.data);
// }).catch((err) => {
//     console.log(err);
// });

axios.get(`${baseUrl}/details/0x19ec1E4b714990620edf41fE28e9a1552953a7F4/90`).then((res) => {
    console.log(res.data);
}).catch((err) => {
    console.log(err);
});

// axios.get(`${baseUrl}/check-user-status/0x19ec1E4b714990620edf41fE28e9a1552953a7F4`).then((res) => {
//     console.log(res.data);
// }).catch((err) => {
//     console.log(err);
// });

// axios
//   .get(`${baseUrl}/overall/117`)
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
