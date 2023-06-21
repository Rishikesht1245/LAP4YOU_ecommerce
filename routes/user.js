const express = require('express');
const router = express.Router();
const signIn = require('../controllers/user/signIn');
const signUp = require('../controllers/user/signUp');
const forgotPassword = require('../controllers/user/forgotPassword');
const sessionCheck = require('../middlewares/users/sessionCheck');
const signOut = require('../controllers/user/signOut');
const profile = require('../controllers/user/profile');
const imageUpload = require('../utilities/imageUpload');
const imageProcessor = require('../utilities/imageProcessor');
const address = require('../controllers/user/address');
const cart = require('../controllers/user/cart');

//========================== SIGN IN ============================
router
      .route('/signIn')
      .get(signIn.signInPage)
      .post(signIn.signInVerification); 


//========================== SIGN UP ============================
router
      .route('/signUp')
      .get(signUp.signUpPage)
      .post(signUp.registerUser);

router.get('/signUp/resendOTP', signUp.resendOTP);

//========================== OTP ===============================
router
      .route('/otp_verification')
      .get(signUp.otpPage)
      .post(signUp.otpVerification);


//=====================PASSWORD HANDLERS =======================
router
      .route('/forgotPassword')
      .get(forgotPassword.forgotPasswordPage)
      .post(forgotPassword.emailVerification);

// OTP Page and verification
router
      .route('/forgotPassword/otpVerification')
      .get(forgotPassword.otpPage)
      .post(forgotPassword.otpVerification)

router
      .route('/changePassword')
      .get(forgotPassword.passwordChangePage)
      .post(forgotPassword.updatePassword);



//==================== User Profile Route =======================
router
      .route('/profile')
      .get(sessionCheck,profile.profilePafge)
      .post(
            sessionCheck,
            imageUpload.single('photo'),
            imageProcessor.profilePic,
            profile.updateProfile
      );

//================ User Addresses Route =========================
router.get('/addresses', sessionCheck, address.viewAll)

//adding new address     
router.post('/addresses/addNew',sessionCheck, address.addNewAddress)

// edit existing address
router.post('/addresses/editAddress', sessionCheck, address.editAddress)

// deleting existing address
router.get('/addresses/delete', sessionCheck, address.deleteAddress);

// default address toggler
router.get('/addresses/changeRole', sessionCheck, address.defaultToggler);



// =================== CART MANAGEMENT =========================
router
      .route('/cart')
      .get(sessionCheck, cart.viewAll)
      .post(sessionCheck, cart.addToCart)


//===================== LOG OUT ================================
router.get('/signOut',sessionCheck,signOut.signOut);



module.exports = router;