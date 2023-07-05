const brandCLTN = require('../../models/admin/brandDetails');
const categoryCLTN = require('../../models/admin/categoryDetails');
const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');

// collection page 
exports.collection = async (req, res) => {
  try{
        let listing;
        if(req.session.category || req.session.viewMore){
          listing = req.session.listing;
        }
        let currentUser = null;
        if(req.session.userId){
              currentUser = await userCLTN.findOne({_id : req.session.userId});
         }
        const listingName = 'Collections'
        if(!listing){
              listing = await productCLTN.find({listed : true}).populate('brand').limit(3);
        }
        if(req.query.query == 'viewMore'){
          listing = await productCLTN.find({listed : true}).populate('brand');
          req.session.listing = listing;
          req.session.viewMore = true;
          req.session.category = false;
          res.redirect('/products')
        }else{
            const brands = await brandCLTN.find({isDeleted : false});
              res.render('index/productListing', {
              session : req.session.userId,
              documentTitle : 'LAP4YOU',
              currentUser,
              listing,
              listingName,
              brands,
        });
        }
        
  } catch(error){
        console.log('Error in Collection Page :' +error );
  }
};


// product filtering 

exports.currentFilter = async(req, res) => {
  try {
        let listing = req.session.listing;
        let currentFilter;
        let allProducts;
        if(!listing){
              allProducts = await productCLTN.find({listed: true}).populate('brand');
        }else{
              allProducts = listing;
        }
        if(req.session.filtered){
              allProducts = await productCLTN.find({listed : true}).populate('brand'); 
        }

        if(req.session.listingName){
              allProducts = await productCLTN.find({listed : true}).populate('brand category');
        }
        switch(req.body.filterBy){
              case 'HP': 
                    if(req.session.listing){
                                currentFilter = allProducts.filter(
                                (product) => ((product.brand._id == req.body.brandId) && product.category.name == req.session.listingName));
                          break;
                    } else{
                          currentFilter = allProducts.filter(
                          (product) => product.brand._id == req.body.brandId);
                          break
                    }
                   
               case 'LENOVO':
                    if(req.session.listing){
                          currentFilter = allProducts.filter(
                          (product) => ((product.brand._id == req.body.brandId) && product.category.name == req.session.listingName));
                          break;
                    } else{
                          currentFilter = allProducts.filter(
                          (product) => product.brand._id == req.body.brandId);
                          break;
              }
               case 'APPLE':
                    currentFilter = allProducts.filter(
                          (product) => product.brand._id == req.body.brandId);
                    break;
              case 'ASUS':
                    if(req.session.listing){
                          currentFilter = allProducts.filter(
                          (product) => ((product.brand._id == req.body.brandId) && product.category.name == req.session.listingName));
                    break;
                    } else{
                           currentFilter = allProducts.filter(
                           (product) => product.brand._id == req.body.brandId);
                    }
              case 'DELL':
                    currentFilter = allProducts.filter(
                          (product) => product.brand._id == req.body.brandId);
                    break;
              case 'none':
                    currentFilter = null;
                    break;
              default : 
                    console.log('default case for switch case');
        }
        req.session.listing = currentFilter;
        req.session.filtered = currentFilter;
        req.session.category = false;
        if(!currentFilter){
              res.json({
                    success : 0
              })
        }else{
              res.json({
                    success :1
              })
        }
  } catch (error) {
        console.log('Error in Products Filter Page');
  }
};


// Product Sorting 

exports.sortBy = async (req, res) => {
  try {
        if(!req.session.listing){
              req.session.listing = await productCLTN.find({listed : true}).populate('brand');
        }
        let listing = req.session.listing;
        if (req.body.sortBy === 'ascending') {
          listing = listing.sort((a, b) => a.RAMSSD[0].price - b.RAMSSD[0].price);
          req.session.listing = listing;
          res.json({
            message: 'sorted',
          });
        }
        else if(req.body.sortBy === 'descending'){
              listing = listing.sort((a, b) => b.RAMSSD[0].price - a.RAMSSD[0].price);
              req.session.listing = listing;

              res.json({
                    message : 'sorted',
              });
        } else if(req.body.sortBy === 'newReleases'){
              listing = listing.sort((a, b) => {
                    const idA = a._id.toString();
                    const idB = b._id.toString();
                    if(idA < idB){
                          return 1;
                    } else if(idA > idB){
                          return -1;
                    } 
                    return 0;
              });
              req.session.listing = listing;
              res.json({
                    message : 'sorted',
              });
        }   
  } catch (error) {
        console.log('Error occured in Sorting : ' + error);
  }
}


// Product Searching
exports.search = async (req, res) => {
  let searchResult = [];
  if(req.session.filtered){
        const regex = new RegExp(req.body.searchInput, 'i');
        req.session.filtered.forEach((product) => {
              if(regex.exec(product.name)){
                    searchResult.push(product);
              }
        });
        
    }
  else if(req.session.listing){
    const regex = new RegExp(req.body.searchInput, 'i');
    req.session.listing.forEach((product) => {
          if(regex.exec(product.name)){
                searchResult.push(product);
                console.log(searchResult);
          }
    });
  }
  else {
        searchResult = await productCLTN.find({
              name : {
                    $regex : req.body.searchInput,
                    $options : 'i',
              },
              listed : true,
        });
  }
  req.session.listing = searchResult;
  res.json({
        message:'Searched',
  });
}


// categories Section 
exports.category = async(req, res) => {
  try {
        let listing;
        let currentUser;
        const brands = await brandCLTN.find({isDeleted : false});
        if(req.session.userId){
              currentUser = await userCLTN.findOne({_id : req.session.userId});
         }
        if(req.params.id == 'newReleases'){
          
              if(req.session.listing){
                    listing = req.session.listing;
              } else{
                    listing = await productCLTN.find({listed:true}).populate('brand').sort({_id : -1});
              }
              res.render('index/productListing', {
                    listing,
                    documentTitle : 'New Releases | LAP4YOU',
                    listingName : 'New Releases',
                    session : req.session.userId,
                    currentUser,
                    brands,
              });
        } else{
              let currentCategory = await categoryCLTN.findById(req.params.id);
              if(req.session.listing && !req.session.category){
                    listing = req.session.listing;
                    listing = listing.filter((product) => product.category.toString() == currentCategory._id);
              } else{
                    listing = await productCLTN.find({
                          category : currentCategory._id,
                          listed: true,
                    }).populate('brand');
              }

              req.session.listing = listing;
              req.session.category = true
              req.session.categories = listing;
              console.log(brands);
              res.render('index/productListing', {
                    listing,
                    documentTitle : `${currentCategory.name} | LAP4YOU`,
                    listingName : `${currentCategory.name}`,
                    session : req.session.userId,
                    currentUser,
                    brands,
              });
        }
  } catch (error) {
        console.log('Error in Product Category Page : '+error);
  }
}