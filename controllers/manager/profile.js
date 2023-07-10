const managerCLTN = require('../../models/admin/managerDetails');


// manager Page 
exports.view = async(req, res) => {
      try {
            const currentManager = await managerCLTN.findById(req.session.manager._id);
            if(currentManager){
                  res.render('admin/partials/profile', {
                        session : req.session.admin,
                        documentTitle : 'Profile Management | LAP4YOU',
                        admin : req.admin,
                        currentManager,
                  });
            }
      } catch (error) {
            console.log("Error in Rendering Manager View Profile : " + error);
      }
};