const mongoose = require('mongoose');
const userCLTN = require('../../models/users/userDetails');


// view all customers
exports.viewAll = async (req, res) =>{
      try{
            const allCustomers = await userCLTN.find().sort({name:-1});
            res.render('admin/partials/customers', {
                  documentTitle : "Customer Management | LAP4YOU",
                  allCustomers,
                  session: req.session.admin,
            });
      }catch(error){
            console.log('Error in Listing All User :' + error);
      }
};


// change access of customers
exports.changeAccess = async(req, res) => {
    try {   
            console.log('Reached changeAccess');
            let currentAccess = req.body.currentAccess;
            currentAccess = JSON.parse(currentAccess);
            currentAccess = !currentAccess;
            await userCLTN.findByIdAndUpdate(req.body.userId, {
                  access : currentAccess,
            });
            console.log('Updated')
            res.json({
                  data : {newAccess : currentAccess},
            })
    } catch (error) {
      console.log("Error Changing User Access :" + error);
    }
};