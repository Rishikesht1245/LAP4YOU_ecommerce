const mongoose = require('mongoose');


const managerSchema = new mongoose.Schema({
      name : {
            type : String,
            required : true,
      },
      email : {
            type : String,
            required : true,
      },
      number : {
            type : Number,
            required : true,
      },
      password : {
            type : String,
            default : "Manager@1245",
      },
      roles: {
            type: [String], // or define a subdocument schema for more complex access control
            required: true,
      },
      access : {
            type : Boolean,
            default : true,
      }
});

const managerCLTN = new mongoose.model("Managers", managerSchema);

module.exports = managerCLTN;