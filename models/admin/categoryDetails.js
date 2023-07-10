const mongoose = require('mongoose');

//creating and designing categorySchema
const categorySchema = new mongoose.Schema({
      name:{
            type:'String',
            required : true,
            unique : true,
      },
      isDeleted :{
            type : Boolean,
            default : false,
      },
      updatedBy : String,
})

const categoryCLTN = new mongoose.model("categories", categorySchema);
module.exports = categoryCLTN;