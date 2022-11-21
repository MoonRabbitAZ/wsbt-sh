const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const { connectToDb } = require('./db/db');

const api = require('./src/express/api/api');
const errorHandler = require('./src/express/errorHandler');

require('./src/cron/cron');

// Start DB
dotenv.config();
connectToDb().catch((err) => console.log(err));

// Start app
const app = express();
// Enable CORS
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);
app.use(errorHandler);
app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`[*] -> Server started listening on port ${process.env.EXPRESS_PORT}`);
});
