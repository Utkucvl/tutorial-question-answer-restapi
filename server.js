const express = require("express");

const dotenv = require("dotenv");

const connectDataBase = require("./helpers/database/connectDatabase")

const router = require("./routers/index");

const customErrorHandler = require("./middlewares/error/customErrorHandler");

const path = require("path");




// Environment variables 

dotenv.config({
    path : "./config/env/config.env"
});

// MongoDb Connection 

connectDataBase();




const app = express();

const PORT =  process.env.PORT;

app.use(express.json());

app.use("/api" , router);

app.use(customErrorHandler);

app.use(express.static(path.join(__dirname,"public")));


app.listen(PORT, () => {
    console.log("Server started on " + PORT + " Updated on " + process.env.NODE_ENV);
});
