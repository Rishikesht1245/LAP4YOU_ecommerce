const categoryCLTN = require('../../models/admin/categoryDetails');
const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');

// collection page 
exports.collection = async (req, res) => {
      try{
            let listing = req.session.listing;
            let currentUser = null;
            if(req.session.userId){
                  currentUser = await userCLTN.findOne({_id : req.session.userId});
             }
            const listingName = 'Collections'
            if(!listing){
                  listing = await productCLTN.find({listed : true}).populate('brand');
            }
            res.render('index/productListing', {
                  session : req.session.userId,
                  documentTitle : 'LAP4YOU',
                  currentUser,
                  listing,
                  listingName,
            });
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
            switch(req.body.filterBy){
                  case 'gaming':
                        currentFilter = allProducts.filter(
                              (product) => product.category == '64888a004cb3b3a4b1bb8be3');
                        break;
                  case 'student': 
                        currentFilter = allProducts.filter(
                              (product) => product.category == '648d930bca2707bb62f29e01'
                        );
                        break;
                  case 'business':
                        currentFilter = allProducts.filter(
                              (product) => product.category == '648d9311ca2707bb62f29e06'
                        );
                        break;
                  case 'none':
                        currentFilter = null;
                        break;
                  default : 
                        console.log('default case for switch case');
            }
            req.session.listing = currentFilter;
            req.session.filtered = currentFilter;
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
            if(req.body.sortBy === 'ascending'){
                  listing = listing.sort((a, b) => a.RAMSSD[0].price - b.RAMSSD[0].price);  
                  req.session.listing = listing;
                  res.json({
                        message:'sorted',
                  });
            } else if(req.body.sortBy === 'descending'){
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
            
      } else {
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
                  });
            } else{
                  let currentCategory = await categoryCLTN.findById(req.params.id);
                  if(req.session.listing){
                        listing = req.session.listing;
                  } else{
                        listing = await productCLTN.find({
                              category : currentCategory._id,
                              listed: true,
                        }).populate('brand');
                  }
                  res.render('index/productListing', {
                        listing,
                        documentTitle : `${currentCategory.name} | LAP4YOU`,
                        listingName : `${currentCategory.name}`,
                  });
            }
      } catch (error) {
            console.log('Error in Product Category Page : '+error);
      }
}