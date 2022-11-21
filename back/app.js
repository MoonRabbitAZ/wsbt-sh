const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

const api = require("./api");
const fetchPrice = require("./utils/fetchPrice");
const updateBalance = require("./utils/updateBalance");
const fileUpload = require('express-fileupload');

require("./workers");
// require("./rskWorkers");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
).catch((er) => {
  console.log(er)
});
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api", api);

function errorHandler(err, req, res, next) {
  if (err.statusCode) {
    // All errors that have a status code are safe.
    return res.status(err.statusCode).send({ error: err.message });
  } else {
    console.log(err);
    return res.status(500).send({ error: "Something went wrong" });
  }
}
app.use(errorHandler);

const server = app.listen(PORT, "0.0.0.0", async () => {
  console.log(`[*] -> Server started listening!`);
});

require('./middleware/socketHandler').connect(server)



