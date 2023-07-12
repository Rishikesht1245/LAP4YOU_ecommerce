const userCLTN = require('../../models/users/userDetails');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const mongoose = require('mongoose');
const saltRounds = 10;
const NewOTP = require('../../models/users/otp');
const cartCLTN = require('../../models/users/cart');
const wishlistCLTN = require('../../models/users/wishlist');


// signup Page
exports.signUpPage = async(req, res)=> {
      try{
            if(req.session.otp != false){
                  req.session.otp = false;
            }
            res.render('user/partials/signUp',{
                  documentTitle : "User Sign Up | LAP4YOU",
            });
      } catch(error){
            console.log('Error Rendering the User Sign Up Page : ' + error);
      }
};

// User Registration with OTP validation
exports.registerUser = async(req, res) => {
      try{
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const newUserDetails = {
                  name : req.body.name.trim(),
                  number : req.body.number,
                  email : req.body.email.toLowerCase(),
                  password : hashedPassword,
            };
            req.session.newUserDetails = newUserDetails;
            const inputEmail = req.body.email;
            req.session.inputEmail = inputEmail;
            const inputNumber = req.body.number;
            // checking for already existing user
            const emailCheck = await userCLTN.findOne({email:inputEmail});
            const numberCheck = await userCLTN.findOne({number:inputNumber});
            if(emailCheck || numberCheck){
                  res.render('user/partials/signUp', {
                        documentTitle : "User Sign Up | LAP4YOU",
                        errorMessage :'User Already exists',
                  });
            }else{
                  const otp = `${Math.floor(100000+Math.random()*900000)}`
                  console.log(otp +'otp');
                  req.session.otp = otp;

                  const newOTP = new NewOTP({
                        email : inputEmail,
                        otp : otp,
                  });
                  await newOTP.save();

                  // node mailer
                   // creating transporter
                  let transporter = nodemailer.createTransport({
                        service:'Gmail',
                        auth: {
                              user : process.env.TRANSPORTER_USERNAME,
                              pass : process.env.TRANSPORTER_PASSWORD,
                        },
                  });
                  // mail options
                  let mailOptions = {
                        from:process.env.TRANSPORTER_USERNAME,
                        to: inputEmail,
                        subject : "OTP Verification | LAP4YOU eCommerce",
                        html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${otp}
                                                      </h2></br><p>Enter the OTP to create account.</p>`,
                  };

                  transporter.sendMail(mailOptions, (error, info)=> {
                        if(error){
                              console.log('error Occured : '+error);
                        } else{
                              console.log(`OTP sent successfully ${otp}`);
                              res.redirect('/users/otp_verification');
                        }
                  });

                  // twilio
                  const authToken = process.env.TWILIO_AUTH_TOKEN;
                  const accountSId = process.env.TWILIO_ACCOUNT_SID;
                  const client = twilio(accountSId, authToken);
                  const message = `Your OTP for Creating Account in LAP4YOU is : ${otp}`;

                  client.messages
                        .create({
                        body: message,
                        from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio phone number
                        to: `+91${inputNumber}`,
                        })
                        .then((message) => console.log('OTP sent:', message.sid))
                        .catch((error) => console.error('Error sending OTP:', error));

      }

      }catch(error){
            console.log('Error signing up user : ' + error);
      }
};


exports.otpPage = async(req, res) => {
      try{
            res.render('user/partials/otp', {
                  documentTitle:'OTP Verification | LAP4YOU',
            })
      } catch(error){
            console.log('Error in GET OTP Page :' + error);
      }
}


exports.otpVerification = async (req, res)=> {
      try {
            const otp = req.body.otp;
            const inputEmail = req.session.inputEmail;
            const otpDetails = await NewOTP.findOne({otp:otp, email : inputEmail});
            if(otpDetails){
                  // if(otpDetails.expiration > Date.now()){
                        const newUserDetails = await new userCLTN(req.session.newUserDetails);
                        await newUserDetails.save();
                        res.redirect('/users/signIn')
                         // intialising cart and wishlist collections when user sign up
                         const userId = newUserDetails._id;
                         const newCart = await new cartCLTN({
                               customer : new mongoose.Types.ObjectId(userId),
                         });
                         await userCLTN.findByIdAndUpdate(userId, {
                               $set:{cart : new mongoose.Types.ObjectId(newCart._id)},
                         });
                         await newCart.save();
                         // wishlist
                         const newWishlist = await new wishlistCLTN({
                               customer : new mongoose.Types.ObjectId(userId),
                         });
                         await userCLTN.findByIdAndUpdate(userId, {
                               $set: {wishlist : new mongoose.Types.ObjectId(newWishlist._id)},
                         });
                         await newWishlist.save();
                        
                  }else{
                  res.render('user/partials/otp', {
                        documentTitle:'OTP Verification | LAP4YOU',
                        errorMessage:'Invalid OTP',
                  });
            }
            

            const otpNew = req.body.otp;
            const mail = req.session.newUserDetails.email;
            await NewOTP.findOneAndDelete({email : mail , otp: otpNew});
            req.body.otp = false;
      } catch (error) {
            console.log('Error in Sign Up : ' + error);
      }
};


// resend OTP

exports.resendOTP = async(req, res) => {
      const inputEmail = req.session.inputEmail;
      if(inputEmail){
            const otp = `${Math.floor(1000+Math.random()*9000)}`
                  console.log(otp +'otp');
                  req.session.otp = otp;

                  const newOTP = new NewOTP({
                        email : inputEmail,
                        otp : otp,
                  });
                  await newOTP.save();
                   // creating transporter
                  let transporter = nodemailer.createTransport({
                        service:'Gmail',
                        auth: {
                              user : process.env.TRANSPORTER_USERNAME,
                              pass : process.env.TRANSPORTER_PASSWORD,
                        },
                  });
                  // mail options
                  let mailOptions = {
                        from:process.env.TRANSPORTER_USERNAME,
                        to: inputEmail,
                        subject : "OTP Verification | LAP4YOU eCommerce",
                        html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${otp}</h2></br><p>Enter the OTP to create account.</p>`,
                  };

                  transporter.sendMail(mailOptions, (error, info)=> {
                        if(error){
                              console.log('error Occured : '+error);
                        } else{
                              console.log(`OTP sent successfully ${otp}`);
                              res.redirect('/users/otp_verification');
                        }
                  });
      }
}