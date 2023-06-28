const express = require('express');
const router = express.Router();
const signIn = require('../controllers/admin/signIn');
const dashboard = require('../controllers/admin/dashboard');
const categories = require('../controllers/admin/categories');
const brands = require('../controllers/admin/brands');
const products = require('../controllers/admin/product');
const sessionCheck = require('../middlewares/admin/sessioncheck');
const upload = require('../utilities/imageUpload');
const banners = require('../controllers/admin/banner');
const customer = require('../controllers/admin/customer');
const signOut = require('../controllers/admin/signOut');
const session = require('express-session');
const coupon = require('../controllers/admin/coupon');
const order = require('../controllers/admin/order');

// ====================== SIGN IN ===========================//

//admin sign in routes (page and verification)
router
      .route('/')
      .get(signIn.page)
      .post(signIn.adminVerification);

// ======================  DASH BOARD ===========================//

// admin dashboard routes
router
      .route('/dashboard')
      .get(sessionCheck,dashboard.view);


// ====================== CATEGORIES ===========================//

// admin categories view and add new category routes
router
      .route('/categories')
      .get(sessionCheck, categories.view)
      .post(sessionCheck, categories.addCategory);


// admin edit page and edit category route
router
      .route('/categories/edit')
      .get(sessionCheck, categories.editCategoryPage)
      .post(sessionCheck, categories.editCategory);

// admin delete category
router
      .route('/categories/delete_category')
      .get(sessionCheck, categories.deleteCategory);



// ====================== BRANDS ===========================//

// view brands page
router
      .route('/brands')
      .get(sessionCheck, brands.view)
      .post(sessionCheck, brands.addBrand);


// edit brand 
router
      .route('/brands/edit')
      .get(sessionCheck, brands.editBrandPage)
      .post(sessionCheck, brands.editBrand);

// delete brand
router
      .route('/brands/delete_brand')
      .get(sessionCheck, brands.deleteBrand);


// ====================== PRODUCTS ===========================//
router
      .route('/product_management')
      .get(sessionCheck, products.view);

//Add product 
router
      .route('/product_management/add_product')
      .post(sessionCheck, 
            // setting the fields to b uploaded and maximum count
            upload.fields([
                  {name:"frontImage", maxCount:1},
                  {name:"thumbnail", maxCount:1},
                  {name:"images", maxCount:3}
            ]),
             products.addProduct);


//Edit products page and post
router
      .route('/product_management/edit')
      .get(sessionCheck, products.editPage)
      .post(
            sessionCheck, 
            upload.fields([
                  { name: "frontImage", maxCount: 1 },
                  { name: "thumbnail", maxCount: 1 },
                  { name: "images", maxCount: 3 },
                ]),
            products.editProduct
      );


//unlist product 
router
      .route('/product_management/changeListing')
      .get(sessionCheck, products.changeListing);
      

// ====================== BANNERS ===========================//

// view , add , delete, and update route
router 
      .route('/banner_management')
      .get(sessionCheck, banners.bannerPage)
      .post(sessionCheck, upload.single('bannerImage'), banners.addBanner)
      .patch(sessionCheck, banners.changeActivity)
      .delete(sessionCheck, banners.deleteBanner);


//==================== USERS =================================

// view and change access
router
      .route('/customer_management')
      .get(sessionCheck, customer.viewAll)
      .patch(sessionCheck, customer.changeAccess)



// ================ COUPONS ===================================

// view coupon page
router.get('/coupon_management', sessionCheck, coupon.page);

//adding new coupon 
router.post('/coupon_management/addNew', sessionCheck, coupon.addNew);

//change activity 
router.get('/coupon_management/changeActivity', sessionCheck, coupon.changeActivity);



// ====================== ORDERS ===============================

//view all orders
router
      .route('/orders')
      .get(sessionCheck, order.viewAll)
      .patch(sessionCheck, order.deliver);

router.patch('/orders/cancel/:id',sessionCheck, order.cancelOrder);

router.get('/orders/:id', sessionCheck, order.details);

//======================= LOG OUT ==============================
router.get('/signOut',sessionCheck, signOut.signOut);
module.exports = router;