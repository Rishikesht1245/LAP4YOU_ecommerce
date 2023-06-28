const mongoose = require('mongoose');
const reviewCLTN = require('../../models/users/review');


// add review for delivered products
exports.addNew = async (req, res) => {
      console.log(req.body.product)
     try {
            req.body.customer = req.session.userId;
            await reviewCLTN.create(req.body);
            res.json({
                  success : 1
            });
     } catch (error) {
            console.log('Error in Add review page : ' + error);
     }
}

// marking review helpful 
exports.helpful = async(req, res) => {
      try {
            if(req.session.userId !=undefined){
                  console.log('reached if')
                  await reviewCLTN.findByIdAndUpdate(req.body.id, {
                        $inc:{
                              helpful : 1
                        }
                  });
                  res.json({
                        message : 1
                  });
            } else{
                  res.json({
                        message : 0
                  });
            }
      } catch (error) {
            console.log("Error in Helpful Review : " + error);
      }
}