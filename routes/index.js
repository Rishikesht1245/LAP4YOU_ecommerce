const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const landingPage = require('../controllers/index/landingPage');
const objectIdCheck = require('../middlewares/users/objectIdCheck');
const product = require('../controllers/index/product');
const productListing = require('../controllers/index/productListing');
//====================== LANDING PAGE ========================================
router.get('/', landingPage.viewAll);


//======================SINGLE PRODUCT PAGE ====================================
router
      .route('/products/:id')
      .get(objectIdCheck, product.view)
      .patch(objectIdCheck, product.listedCheck);


//================== COLLECTION , SEARCH, SORT, FILTER ======================
router
      .route('/products')
      .get(productListing.collection)
      .patch(productListing.currentFilter)
      .post(productListing.sortBy)
      .put(productListing.search);

//================= Categories section ==============================//
router
      .route('/categories/:id')
      .get(productListing.category)
      .put(productListing.search);




module.exports = router;