const mongoose = require('mongoose');

async function connectToDb() {
  const url = `mongodb://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@${process.env.MONGO_INITDB_URL}:${process.env.MONGO_INITDB_PORT}/${process.env.MONGO_INITDB_DATABASE}`;
  await mongoose.connect(url);

  console.log(`DB connected at port ${process.env.MONGO_INITDB_PORT}`);
}

module.exports = {
  connectToDb
};
