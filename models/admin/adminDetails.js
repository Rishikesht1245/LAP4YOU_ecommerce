const mongoose = require('mongoose');

// schema design and creation
const adminShema = new mongoose.Schema({
      name: {
            type:String,
            required : true
      },
      email: {
            type: String,
            unique : true
      },
      password: {
            type:String,
            required : true
            
      },
});

const adminCLTN = new mongoose.model('adminDetails', adminShema);

module.exports = adminCLTN;