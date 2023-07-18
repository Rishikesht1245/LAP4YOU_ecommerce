const express = require('express');
const router = express.Router();
const signIn = require('../controllers/admin/signIn');
const dashboard = require('../controllers/admin/dashboard');
const categories = require('../controllers/admin/categories');
const brands = require('../controllers/admin/brands');
const products = require('../controllers/admin/product');
const accessCheck = require('../middlewares/admin/accessCheck');
const sessionCheck = require('../middlewares/admin/sessioncheck');
const upload = require('../utilities/imageUpload');
const banners = require('../controllers/admin/banner');
const customer = require('../controllers/admin/customer');
const signOut = require('../controllers/admin/signOut');
const coupon = require('../controllers/admin/coupon');
const order = require('../controllers/admin/order');
const manager = require('../controllers/admin/manager');
const exportToExcel = require('../utilities/exportToExcel');

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
      .get(sessionCheck,dashboard.view)
      .put(sessionCheck, dashboard.chartData);
      
router.put('/dashboard/:id', sessionCheck, dashboard.doughNutData);


// ====================== CATEGORIES ===========================//

// admin categories view and add new category routes
router
      .route('/categories')
      .get(accessCheck(["Category"]), categories.view)
      .post(accessCheck(["Category"]), categories.addCategory);


// admin edit page and edit category route
router
      .route('/categories/edit')
      .get(accessCheck(["Category"]), categories.editCategoryPage)
      .post(accessCheck(["Category"]), categories.editCategory);

// admin delete category
router
      .route('/categories/delete_category')
      .get(accessCheck(["Category"]), categories.deleteCategory);



// ====================== BRANDS ===========================//

// view brands page
router
      .route('/brands')
      .get(accessCheck(["Brand"]), brands.view)
      .post(accessCheck(["Brand"]), brands.addBrand);


// edit brand 
router
      .route('/brands/edit')
      .get(accessCheck(["Brand"]), brands.editBrandPage)
      .post(accessCheck(["Brand"]), brands.editBrand);

// delete brand
router
      .route('/brands/delete_brand')
      .get(accessCheck(["Brand"]), brands.deleteBrand);


// ====================== PRODUCTS ===========================//
router
      .route('/product_management')
      .get(accessCheck(["Product"]), products.view);


//Add product 
router
      .route('/product_management/add_product')
      .post(accessCheck(["Product"]), 
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
      .get(accessCheck(["Product"]), products.editPage)
      .post(
            accessCheck(["Product"]), 
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
      .get(accessCheck(["Product"]), products.changeListing);
      

// ====================== BANNERS ===========================//

// view , add , delete, and update route
router 
      .route('/banner_management')
      .get(accessCheck(["Banner"]), banners.bannerPage)
      .post(accessCheck(["Banner"]), upload.single('bannerImage'), banners.addBanner)
      .patch(accessCheck(["Banner"]), banners.changeActivity)
      .delete(accessCheck(["Banner"]), banners.deleteBanner);


//==================== USERS =================================

// view and change access
router
      .route('/customer_management')
      .get(accessCheck(["Customer"]), customer.viewAll)
      .patch(accessCheck(["Customer"]), customer.changeAccess)


// ================ COUPONS ===================================

// view coupon page
router.get('/coupon_management', accessCheck(["Coupon"]), coupon.page);

//adding new coupon 
router.post('/coupon_management/addNew', accessCheck(["Coupon"]), coupon.addNew);

router
      .route('/coupon_management/edit')
      .get(accessCheck(["Coupon"]), coupon.editCouponPage)
      .post(accessCheck(["Coupon"]), coupon.editCoupon);

//change activity 
router.get('/coupon_management/changeActivity', accessCheck(["Coupon"]), coupon.changeActivity);



// ====================== ORDERS ===============================

//view all orders
router
      .route('/orders')
      .get(accessCheck(["Order"]), order.viewAll)
      .patch(accessCheck(["Order"]), order.changeOrderStatus);

router.patch('/orders/cancel/:id',accessCheck(["Order"]), order.cancelOrder);

router.get('/orders/:id', accessCheck(["Order"]), order.details);


// ====================== SALES REPORT =========================
router.get('/salesReport', exportToExcel.download);


//======================= MANAGER ==============================
router
      .route('/manager_management')
      .get(sessionCheck, manager.view)
      .post(sessionCheck, manager.addManager)

// edit Manager
router
      .route('/manager_management/:id')
      .get(sessionCheck, manager.editPage)
      .post(sessionCheck, manager.editManager)
      .patch(sessionCheck, manager.changeAccess);


//======================= LOG OUT ==============================
router.get('/signOut',sessionCheck, signOut.signOut);
module.exports = router;
