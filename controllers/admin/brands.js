const brandCLTN = require('../../models/admin/brandDetails');


// rendering the brands list page
exports.view = async(req, res) => {
   
      try{
            const brandDetails = await brandCLTN.find({isDeleted:false});
            res.render('admin/partials/brands', {
                  session : req.session.admin,
                  documentTitle : 'Brand Management | LAP4YOU',
                  details : brandDetails,
                  admin : req.admin,
            });
      }
      catch(error){
            res.render('admin/partials/dashboard', {
                  session : req.session.admin,
                  documentTitle : 'Dash Board | LAP4YOU',
                  errorMessage : error,
                  admin : req.admin,
            });
      }
};


// adding new brand
exports.addBrand = async (req, res) => {
      
      try {
            let inputBrandName = req.body.brand;
            inputBrandName = inputBrandName.toUpperCase();
            const brandDetails = await brandCLTN.find({});

            // duplication check
            const duplicateCheck = await brandCLTN.findOne({name:inputBrandName});
            if(duplicateCheck){
                  // making the brand true if it is soft deleted in DB
                  if(duplicateCheck.isDeleted == true){
                        await brandCLTN.updateOne(
                              {_id: duplicateCheck._id},
                              {isDeleted : false});
                         res.render('admin/partials/brands',{
                               documentTitle: 'Brand Management | LAP4YOU',
                               details : brandDetails,
                               session : req.session.admin,
                               admin : req.admin,
                         });
                  }else{
                        res.render('admin/partials/brands', {
                              session : req.session.admin,
                              documentTitle : 'Brand Management | LAP4YOU',
                              details : brandDetails,
                              errorMessage : `Brand ${inputBrandName} already exists`,
                              admin : req.admin,
                        });
                  }
            } else{
                  const newBrand = new brandCLTN({
                        name : inputBrandName,
                        updatedBy :  req.session.manager? req.session.manager.name : req.session.admin.name,
                  });
                  await newBrand.save();
                  res.redirect('/admin/brands');
            }
      } catch (error) {
            console.log('Error in adding new Category ' + error);
      }
};

// rendering edit brand page
exports.editBrandPage = async(req, res)=>{
      try {
            const brandId = req.query.id;
            const currentBrand = await brandCLTN.findById(brandId);
            req.session.currentBrand = currentBrand;
            
            res.render('admin/partials/editBrands', {
                  session : req.session.admin,
                  documentTitle:'Brand Management | LAP4YOU',
                  brand : currentBrand,
                  admin : req.admin,
            })
      } catch (error) {
            console.log('Error in GET category Page ' + error);
      }
};

// edit brand post
exports.editBrand = async (req, res) => {
      try {
            const currentBrand = req.session.currentBrand;
            let updatedName = req.body.name;
            updatedName = updatedName.toUpperCase();
            const duplicateCheck = await brandCLTN.findOne({name:updatedName});
            if(duplicateCheck == null){
                  await brandCLTN.updateOne(
                        {_id : currentBrand._id },
                        {
                          name : updatedName, 
                          updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
                        }
                  );
                  res.redirect('/admin/brands');
            } else{
                 
                  res.render('admin/partials/editBrands',{
                        documentTitle:'Edit Brand | LAP4YOU',
                        session : req.session.admin,
                        brand : currentBrand,
                        errorMessage : `Brand ${updatedName} alredy exists..`,
                        admin : req.admin,
                  })
            }
      } catch (error) {
            console.log('Error in POST brand ' + error);
      }
};

exports.deleteBrand = async (req, res) => {
      try{
            const brandId = req.query.id;
            await brandCLTN.updateOne(
                  {_id : brandId},
                  {
                        isDeleted : true ,
                        updatedBy :  req.session.manager? req.session.manager.name : req.session.admin.name,
                  });
            res.redirect('/admin/brands');
      }
      catch(error){
            console.log('Error in DELETE Brand ' + error);
      }
};

