const mongoose = require("mongoose");

const connectDataBase = async () => {
    try {
      const DBURL = process.env.MONGO_URI;
      mongoose.set("strictQuery", false);
      mongoose.connect(DBURL, {
        useNewUrlParser: true,
        ssl: true,
        sslValidate: false,
      })
      .then(console.log("Connection is successful"))
    } catch (err) {
      console.log("Databse Connection Error : " + err.message);
    }
  };

module.exports = connectDataBase;