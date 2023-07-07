const mongoose = require('mongoose');
const managerCLTN = require('../../models/admin/managerDetails');


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
            if(email){
                  if(manager.password === req.body.password){
                        req.session.manager = manager;
                        console.log(req.session.manager);
                        console.log('Manger session created successfully');
                        res.redirect('/admin/dashboard');
                  }else{
                        res.render('admin/partials/signIn', {
                              documentTitle : 'Manager SignIn Page | LAP4YOU',
                              session : manager,
                              admin: false,
                              errorMessage : "Incorrect Password",
                        });
                  }
            }else{
                  res.render('admin/partials/signIn', {
                        documentTitle : 'Manager SignIn Page | LAP4YOU',
                        session : manager,
                        admin: false,
                        errorMessage : "Manager Not Found",
                  })
            }
      } catch (error) {
            console.log("Error in Manager Verification :  " + error);
      }
};
