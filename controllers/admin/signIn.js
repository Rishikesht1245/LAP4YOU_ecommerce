const adminCLTN = require('../../models/admin/adminDetails');
// admin page rendering
exports.page = async (req, res)=> {
      try{
            res.render('admin/partials/signIn', {
                  documentTitle : 'Admin SignIn Page | LAP4YOU',
                  admin : true,
                  signIn : false,
            })
      } catch(err){
            console.log('Error occured while rendering the Admin sign in page' + err);
      }
};


// admin verification 
exports.adminVerification = async(req, res)=> {
      try{
              const inputPassword = req.body.password;
             const inputEmail = req.body.email.toLowerCase();
             const adminFind = await adminCLTN.findOne({email : inputEmail});
            //  console.log(adminFind);
             if(adminFind){
                  if(adminFind.password === inputPassword){
                        req.session.admin = adminFind;
                        console.log('Admin session created successfully');
                        res.redirect('/admin/dashboard');
                  }
                  else{
                        res.render('admin/partials/signIn',{
                              documentTitle : 'Admin SignIn Page | LAP4YOU',
                              errorMessage:'Incorrect Password',
                              admin : true,
                              }
                        );
                  }
            }
            else{
                  res.render('admin/partials/signIn', {
                  errorMessage:'Admin not Found !', 
                   admin : true});
            }
      }
      catch(error){
            console.log('Failed to login'+ error);
      }

};
