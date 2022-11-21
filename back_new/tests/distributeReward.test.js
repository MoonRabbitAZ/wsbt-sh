const axios = require('axios');

const baseUrl = 'http://localhost:5000/api';

axios
  .get(`${baseUrl}/distribute-rewards/47`)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
