const mongoose = require('mongoose');
const managerCLTN = require('../../models/admin/managerDetails');
const bcrypt = require('bcrypt');


exports.signInPage = async(req, res) => {
      try {
            res.render('admin/partials/signIn', {
                  documentTitle : 'Manager SignIn Page | LAP4YOU',
                  admin: false,
            });
      } catch (error) {
            console.log("Error in Manager Sign In Page : " +error);
      }
};


exports.signInVerification = async(req, res) => {
      try {
            const email = req.body.email.toLowerCase();
            const manager = await managerCLTN.findOne({email : email});
            let inputPassword = req.body.password;
            let errorMessage;
            let allowLogin = false;
            if(manager){
                  if(manager.access === true){
                        const hashedCheck = await bcrypt.compare(
                              inputPassword,
                              manager.password,
                        );
                        console.log(hashedCheck);
                        if(hashedCheck){
                              allowLogin = true;
                              req.session.manager = manager;
                        }else{
                              errorMessage = "Invalid Password"
                        }
                  }else{
                        errorMessage = "Unauthorized to Access";  
                  }                  
            }else{
                  errorMessage = "Manager Not Found ";
            }
            
            if(allowLogin){
                  res.redirect('/admin/dashboard');
            }else{
                  res.render('admin/partials/signIn', {
                        documentTitle : "DashBoard | LAP4YOU",
                        admin : false,
                        errorMessage,
                        
                  });
            }
      } catch (error) {
            console.log("Error in Manager Verification :  " + error);
      }
};
