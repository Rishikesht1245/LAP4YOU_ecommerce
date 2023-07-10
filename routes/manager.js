const express = require('express');
const router = express.Router();
const sessionCheck = require('../middlewares/manager/sessioncheck');
const signIn = require('../controllers/manager/signIn');
const signOut = require('../controllers/manager/signOut');
const changePassword = require('../controllers/manager/changePassword');
const profile = require('../controllers/manager/profile');

//================= sign In =============================
router
      .route('/')
      .get(signIn.signInPage)
      .post(signIn.signInVerification);

//================= Change Password ====================
router
      .route('/changePassword')
      .get(sessionCheck, changePassword.Page)
      .post(sessionCheck, changePassword.changePassword);


// ================ Profile ============================
router.get('/profile', sessionCheck, profile.view);

// ================ Sign Out ===========================
router.get('/signOut', sessionCheck, signOut.signOut);



module.exports = router;