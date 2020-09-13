const mongoose = require('mongoose');

function connect() {
  return new Promise(async (resolve, reject) => {

    if (process.env.NODE_ENV === 'test') {
      //NOTE: we should use mockgoose but it does not support transactions yet, hence we are using the test mongo instance itself
      const TEST_DB_URI = process.env.TEST_DB_URI;
      mongoose.connect(TEST_DB_URI,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        .then(async (res, err) => {
          if (err) return reject(err);
          resolve();
        })
    } else {
      const DB_URI = process.env.DB_URI;
      mongoose.connect(DB_URI,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        })
    }
  });
}

function close() {
  return mongoose.disconnect();
}

async function cleardb() {
  
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  return;
}

module.exports = { connect, close, cleardb };