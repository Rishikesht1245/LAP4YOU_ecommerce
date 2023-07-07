const mongoose = require('mongoose');
const managerCLTN = require('../../models/admin/managerDetails');

const rolesArray = ['Product', 'Category', 'Brand', 'Banner', 'Order', 'Coupon'];
// managers view 
exports.view = async(req, res) => {
      try {
            const allManagers = await managerCLTN.find();

            res.render('admin/partials/managers', {
                  allManagers,
                  documentTitle : "Managers | LAP4YOU",
                  rolesArray,
                  admin : req.admin,
            });
      } catch (error) {
           console.log("Error in Manager page :" + error); 
      }
};


// add new manger
exports.addManager = async(req,res) => {
      try {
            const selectedRoles = JSON.parse(req.body.selectedRoles);
            const newManager = new managerCLTN({
                  name : req.body.name,
                  email : req.body.email,
                  number : req.body.number,
                  roles : selectedRoles,
            });
            await newManager.save();

            res.redirect('/admin/manager_management');
      } catch (error) {
            console.log("Error in Add Manager : " + error);
      }
};

//edit manager page
exports.editPage = async(req, res) => {
      try {
            const managerId = req.params.id;
            const currentManager = await managerCLTN.findById(managerId);
            console.log(currentManager);
            res.render("admin/partials/editManager", {
                  manager : currentManager,
                  documentTitle : "Managers | LAP4YOU",
                  rolesArray,
                  admin : req.admin,
            })

      } catch (error) {
            console.log('Error in Edit Manager Page : ' + error);
      }
};


// edit manager post
exports.editManager = async(req, res) => {
      try {
            const managerId = req.params.id;
            const selectedRoles = JSON.parse(req.body.selectedRoles);
            const {name , email, number} = req.body;

            await managerCLTN.findByIdAndUpdate(managerId, {
                  $set : {
                        name,
                        email,
                        number,
                        roles : selectedRoles,
                  }
            });

            res.redirect('/admin/manager_management');

      } catch (error) {
            console.log("Error in Edit Manager post : " + error);
      }
};


// change access 
exports.changeAccess = async(req, res) => {
      try {
            const managerId = req.body.id;
            let currentAccess = req.body.currentAccess;
         
            if(currentAccess == 'true'){
                  currentAccess = false;
            }else{
                  currentAccess = true;
            }

            currentAccess = Boolean(currentAccess);
            await managerCLTN.findByIdAndUpdate(managerId, {
                  access : currentAccess,
            });

            res.json({
                  data : "updated"
            });
      } catch (error) {
            console.log("Error in Change Access : " + error);
      }
};

