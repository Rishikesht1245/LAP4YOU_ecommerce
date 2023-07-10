const managerCLTN = require('../../models/admin/managerDetails');
const bcrypt = require('bcrypt');

exports.Page = async (req, res) => {
      try {
            res.render('admin/partials/changePassword', {
                  admin : req.admin,
                  documentTitle : "Change Password | LAP4YOU",
                  session : req.session.manager,
            });
      } catch (error) {
            console.log("Error in manager change password " + error);
      }
};


// change Password 
exports.changePassword = async(req, res) => {
      try {
            const currentPassword = req.body.currentPassword;
            let inputPassword = req.body.newPassword;
            email = req.session.manager.email;
            const manager = await managerCLTN.findOne({email : email});

            const hashedCheck = await bcrypt.compare(currentPassword, manager.password)

            if(hashedCheck){
                  inputPassword = await bcrypt.hash(inputPassword, 10);
                  await managerCLTN.updateOne({email : email}, {
                        $set : {
                              password : inputPassword,
                        }
                  });

                  req.flash('success', 'Password changed successfully !');
                  res.redirect('/admin/dashboard');
            }else{
                  res.render('admin/partials/changePassword', {
                        admin : req.admin,
                        documentTitle : "Change Password | LAP4YOU",
                        session : req.session.manager,
                        errorMessage : "Current Password does not match. Please Try Again"
                  });
            }
      } catch (error) {
            console.log("Error in change Password : " + error);
      }
}