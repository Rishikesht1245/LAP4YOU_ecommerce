const mongoose = require('mongoose');
const reviewCLTN = require('../../models/users/review');


// add review for delivered products
exports.addNew = async (req, res) => {
     try {
            req.body.customer = req.session.userId;
            await reviewCLTN.create(req.body);
            res.json({
                  success : 1
            });
     } catch (error) {
            console.log('Error in Add review page : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
     }
}

// marking review helpful 
exports.helpful = async(req, res) => {
      try {
            if(req.session.userId !=undefined){
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
}