const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
      title:String,
      image: String,
      description : String,
      url : String,
      videoURL : String,
      active:{
            type: Boolean,
            default:true,
      },
      updatedBy : String,
},
{timestamps:true}
);

const bannerCLTN = new mongoose.model("banners", bannerSchema);

module.exports = bannerCLTN;