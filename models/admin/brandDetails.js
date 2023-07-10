const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
      name: {
            type : String, 
            required : true,
            unique : true,
      },
      isDeleted :{
            type : Boolean,
            default : false,
      },
      updatedBy : String,
})

const brandCLTN = new mongoose.model("brands", brandSchema);

module.exports = brandCLTN;