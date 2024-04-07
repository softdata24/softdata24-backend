const mongoose = require("mongoose");
require("dotenv").config();

const connection_string = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`;

mongoose
  .connect(connection_string)
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((err) => {
    console.log("Error connecting to database: " + err.message);
  });
