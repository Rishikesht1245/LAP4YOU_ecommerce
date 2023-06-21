const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
      otp:{
            type:Number,
            required: true,
      },
      email:{
            type:String,
            required:true,
      },
      expiresAt:{
            type:Date,
            default : Date.now,
            required:true,
            expires : 60,
      },
});

const otpCLTN = new mongoose.model('otp', otpSchema);
module.exports = otpCLTN;