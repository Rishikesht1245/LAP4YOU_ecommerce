const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpCLTN = require('../../models/users/otp');
const userCLTN = require('../../models/users/userDetails');
const saltRounds = 10;


// forgot password page
exports.forgotPasswordPage = async (req, res) => {
      try{
            res.render('user/partials/forgotPassword',{
                  documentTitle:'Forgot Password | User | LAP4YOU',
            });
      } catch(error){
            console.log('Error in GET forgot password Page :' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};

// email verification and sending OTP
exports.emailVerification = async(req, res)=> {
    try {
      const inputEmail = req.body.email;
      const mailChecker = await userCLTN.findOne({email:inputEmail});
      if(mailChecker){
            const tempOTP = Math.floor(1000 + Math.random()*9000);
            req.session.resetPasswordAuth = inputEmail;

            // transporter
            const transporter = nodemailer.createTransport({
                  service:'Gmail',
                  auth:{
                        user: process.env.TRANSPORTER_USERNAME,
                        pass: process.env.TRANSPORTER_PASSWORD,
                  },
            });

            // mail options 
            let mailOptions = {
                  from: process.env.TRANSPORTER_USERNAME,
                  to: inputEmail,
                  subject : "Password Reset OTP | LAP4YOU eCommerce",
                  html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to Reset Password.</p>`,
            };

            //send Email
            await transporter.sendMail(mailOptions);
            req.session.resetOTP = tempOTP;
            console.log('User Reset OTP sent ' + req.session.resetOTP);
            res.redirect('/users/forgotPassword/otpVerification');
            const expiration = new Date();
            // setting otp expiration to five minutes
            expiration.setMinutes(expiration.getMinutes()+5);
            const newOTP = await new otpCLTN({
                  email : inputEmail,
                  otp : tempOTP,
                  expiration: expiration,
            });
            await newOTP.save();  
      } else{
            res.render('user/partials/forgotPassword',{
                  documentTitle: 'Forgot Passoword | User | LAP4YOU',
                  errorMessage : 'User Not Found',
            });
      }
    } catch (error) {
            console.log('Error Email Verification : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
    }
};


// OTP page
exports.otpPage =  (req, res) => {
      if(req.session.resetPasswordAuth && req.session.resetOTP){
            res.render('user/partials/otp', {
                  documentTitle : "Update User Password | LAP4YOU"
            });
      }else{
            res.redirect('/users/signIn');
      }
};


//OTP Verification
exports.otpVerification = async(req, res) => {
      try{
            if(req.session.resetPasswordAuth && req.session.resetOTP){
                  const inputOTP = req.body.otp;
                  const mail = req.session.resetPasswordAuth;
                  const otpDetails = await otpCLTN.findOne({otp:inputOTP, mail:mail});
                  if(otpDetails){
                              req.session.resetOTP = false;
                              req.session.updatePassword = true;
                              console.log('Session Created for User Password Change');
                              res.redirect('/users/changePassword');
                              await otpCLTN.findOneAndDelete({email : mail, otp:inputOTP});
                  }else{
                        res.render("user/partials/otp", {
                              documentTitle: "Update User Password | LAP4YOU",
                              errorMessage: "Invalid OTP",
                            });
                  }
            }else{
                  res.redirect('/users/signIn');
            }
      }catch(error){
            console.log('Error in OTP Verification ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};


// password Change page
exports.passwordChangePage = (req, res)=> {
      if(req.session.updatePassword && req.session.resetPasswordAuth){
            res.render("user/partials/changePassword", {
                  documentTitle : 'User Password Reset | LAP4YOU',
            });
      } else{
            res.redirect('/users/forgotPassword');
      }
};


// password change post
exports.updatePassword = async(req, res) => {
      try{
            if(req.session.resetPasswordAuth && req.session.updatePassword){
                  const userEmail = req.session.resetPasswordAuth;
                  const newPassword = req.body.newPassword;
                  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                  await userCLTN.updateOne(
                        {email : userEmail},
                        {$set:{password : hashedPassword}}
                  );
                  req.session.resetPasswordAuth = false;
                  req.session.updatePassword = false;
                  console.log('User Passwod Updated');
                  res.redirect('/users/signIn');
            } else{
                  res.redirect('/users/signIn')
            }
      } catch(error){
            console.log('Error in Change Password :' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};
