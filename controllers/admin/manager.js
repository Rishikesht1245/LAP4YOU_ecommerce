const mongoose = require('mongoose');
const managerCLTN = require('../../models/admin/managerDetails');
const nodemailer = require('nodemailer');

const rolesArray = ['Product', 'Category', 'Brand', 'Banner', 'Order', 'Coupon'];
// managers view 
exports.view = async(req, res) => {
      try {
            const allManagers = await managerCLTN.find();

            res.render('admin/partials/managers', {
                  session : req.session.admin,
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

            let mailOptions = {
                  from:process.env.TRANSPORTER_USERNAME,
                  to: req.body.email,
                  subject : `Manager Account has been created successfully.`,
                  html: `<h3>Your account as a manager in LAP4YOU has been created successfully. </h3>
                        </br><h4 style="text-color: red, font-weight: bold"><p>Your Roles : ${selectedRoles}</p></h4>
                        </br><p>Please login with your email Id and password : Manager@1245. Request you to change the password once you 
                        are logged in. </p>`,
            };

                    // creating transporter
                  let transporter = nodemailer.createTransport({
                        service:'Gmail',
                        auth: {
                              user : process.env.TRANSPORTER_USERNAME,
                              pass : process.env.TRANSPORTER_PASSWORD,
                        },
                  });

            transporter.sendMail(mailOptions, (error, info)=> {
                  if(error){
                        console.log('error Occured : '+error);
                  } else{
                        console.log(`Email Sent SuccessFully`);
                  }
            });


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
            res.render("admin/partials/editManager", {
                  session : req.session.admin,
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

