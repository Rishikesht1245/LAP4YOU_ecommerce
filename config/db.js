// mongoDB configuration file
const mongoose = require('mongoose');
require('dotenv').config();

//making queries to DB strinct (throw error when queries are invalid)
mongoose.set("strictQuery", true);

//Connecting to mongo DB
mongoose.connect(process.env.MONGODB_URL)
      .then(()=> {
            console.log("Mongo DB connected");
      })
      .catch((error) => {
            console.log("Failed to connect" + error);
      });