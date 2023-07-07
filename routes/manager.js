const express = require('express');
const router = express.Router();
const sessionCheck = require('../middlewares/manager/sessioncheck');
const signIn = require('../controllers/manager/signIn');
const signOut = require('../controllers/manager/signOut');

//================= sign In =============================
router
      .route('/')
      .get(signIn.signInPage)
      .post(signIn.signInVerification);


// ================ Sign Out ===========================
router.get('/signOut', sessionCheck, signOut.signOut);


module.exports = router;