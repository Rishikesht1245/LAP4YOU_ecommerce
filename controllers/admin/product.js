const {default : mongoose} = require('mongoose');
const brandCLTN = require('../../models/admin/brandDetails');
const categoryCLTN = require('../../models/admin/categoryDetails');
const productCLTN = require('../../models/admin/productDetails');
const sharp = require('sharp');




// Products view page
exports.view = async(req, res) => {
      try{
            const categoryDetails = await categoryCLTN.find({isDeleted:false});
            const brandDetails = await brandCLTN.find({isDeleted:false});
            const productDetails = await productCLTN.find().populate(['category','brand']);
            res.render('admin/partials/products', {
                  documentTitle:'Product Management | LAP4YOU',
                  session : req.session.admin,
                  categories : categoryDetails,
                  brands : brandDetails,
                  products : productDetails,
                  admin : req.admin,
            });
      }
      catch(error){
        console.log('Product Page rendering Error ' + error);
      }
};


// add products post page
exports.addProduct = async(req, res) => {
      try {
            //name format of front image
            const frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
            //using sharp module to process the image and convert it to png form and save it in the correct path and name
            sharp(req.files.frontImage[0].buffer)
                  .toFormat('png')
                  .png({quality:80})
                  .toFile(`public/img/products/${frontImage}`);
            req.body.frontImage = frontImage;
            
            // thumbnail
            const thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
            sharp(req.files.thumbnail[0].buffer)
                  .toFormat('png')
                  .png({quality:80})
                  .toFile(`public/img/products/${thumbnail}`);
            req.body.thumbnail = thumbnail;
            //other images 
            const newImages = [];
            for(let i = 0; i < 3; i++){
                  const imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
                  sharp(req.files.images[i].buffer)
                  .toFormat('png')
                  .png({quality:80})
                  .toFile(`public/img/products/${imageName}`);
                  newImages.push(imageName);
            }
            req.body.images = newImages;
            req.body.category = new mongoose.Types.ObjectId(req.body.category);
            req.body.brand = new mongoose.Types.ObjectId(req.body.brand);
            // adding the price variants to a single array of object
            const ramCapacity = req.body.ramCapacity;
            const ssdCapacity = req.body.ssdCapacity;
            const combPrice = req.body.combPrice;
            const quantity = req.body.quantity;
            const RAMSSD = [];
            for(let i = 0; i < ramCapacity.length; i++){
                  RAMSSD.push({
                        ramCapacity:ramCapacity[i],
                        ssdCapacity : ssdCapacity[i],
                        price:combPrice[i],
                        quantity :quantity[i],
                  });
            }
            req.body.RAMSSD = RAMSSD;
            req.body.updatedBy = req.session.manager? req.session.manager.name : req.session.admin.name;
            //fields inside req.body and collection fields should match with each other
            const newProduct = new productCLTN(req.body);
            await newProduct.save();

            res.redirect('/admin/product_management');

      } catch (error) {
            console.log('Error in adding new product ' + error);
      }
};


// edit product page
exports.editPage = async (req, res) => {
      try{
            const productId = req.query.id;
            const categories = await categoryCLTN.find({});
            const brands = await brandCLTN.find({});
            const currentProduct = await productCLTN.findById(req.query.id).populate(['category', 'brand']);
            res.render('admin/partials/editProducts', {
                  session : req.session.admin,
                  documentTitle : 'Edit Product | LAP4YOU',
                  product : currentProduct,
                  categories : categories,
                  brands : brands,
                  admin : req.admin,
            })
      }
      catch(error){
            console.log('Product Editing GET error :' + error);
      }
};


//edit product post
exports.editProduct = async (req,res) => {
      try {
            //check if req.files is not empty
            if(Object.keys(req.files).length !== 0){
                  if(req.files.frontImage){
                        const frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
                        // using sharp module for image formatting
                        sharp(req.files.frontImage[0].buffer)
                              .toFormat('png')
                              .png({quality:80})
                              .toFile(`public/img/products/${frontImage}`);
                        req.body.frontImage = frontImage;
                  }
                  if(req.files.thumbnail){
                        const thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
                        sharp(req.files.thumbnail[0].buffer)
                              .toFormat('png')
                              .png({quality:80})
                              .toFile(`public/img/products/${thumbnail}`);
                        req.body.thumbnail = thumbnail;
                  }
                  if(req.files.images){
                        const newImages = [];
                        for(let i = 0; i < 3; i++){
                              imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
                              sharp(req.files.images[i].buffer)
                                    .toFormat('png')
                                    .png({quality:80})
                                    .toFile(`public/img/products/${imageName}`);
                              newImages.push(imageName);
                        }
                        req.body.images = newImages;
                  }
            }
            const ramCapacity = req.body.ramCapacity;
            const ssdCapacity = req.body.ssdCapacity;
            const combPrice = req.body.combPrice;
            const quantity = req.body.quantity;
            const RAMSSD = [];
            for(let i = 0; i < ramCapacity.length; i++){
                RAMSSD.push({
                   ramCapacity:ramCapacity[i],
                   ssdCapacity : ssdCapacity[i],
                   price:combPrice[i],
                   quantity :quantity[i],
                  });
            }
            req.body.RAMSSD = RAMSSD;
            req.body.category = new mongoose.Types.ObjectId(req.body.category);
            req.body.brand = new mongoose.Types.ObjectId(req.body.brand);
            req.body.updatedBy = req.session.manager? req.session.manager.name : req.session.admin.name;
            await productCLTN.findByIdAndUpdate(req.query.id, req.body);
           
            res.redirect('/admin/product_management');
      } catch (error) {
            console.log("Product Editing POST error : " + error);
      }
};


// change listing the product (unlisting and listing)

exports.changeListing = async(req, res) => {
      try {
            const productId = req.query.id;
            const currentProduct = await productCLTN.findById(productId);
            let currentListing = currentProduct.listed
            if(currentListing === true){
                  currentListing = false
            }else{
                  currentListing = true;
            }
            currentListing = Boolean(currentListing);
            await productCLTN.findByIdAndUpdate(productId, {
                  listed : currentListing,
                  updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
            });
            res.redirect('/admin/product_management');
      } catch (error) {
            console.log('Error in Product unlisting '+ error);
      }
}