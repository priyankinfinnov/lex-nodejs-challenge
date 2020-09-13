const app = require('./app.js');
const db = require('./db/index.js');
const port = 3000;

db.connect()
.then(() => {
  console.log(`MongoDB Connected`);
  app.listen(port, () => {
      console.log(`App Server server is running on ${port}`);
  });
})
.catch((err) => {
  console.error(`MongoDB Connection failed with error ${err}`);
});