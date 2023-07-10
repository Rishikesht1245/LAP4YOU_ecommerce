const categoryCLTN = require('../../models/admin/categoryDetails');


// view category list
exports.view = async(req, res) =>{
      try{
            const categoryDetails = await categoryCLTN.find({isDeleted:false});
            res.render('admin/partials/categories.ejs',{
                  session: req.session.admin,
                  documentTitle : 'Category Management | LAP4YOU',
                  details : categoryDetails,
                  admin : req.admin,
            });
      }
      catch(error){
            res.render('admin/partials/dashboard',{
                  documentTitle : 'Dash Board | LAP4YOU',
                  session : req.session.admin,
                  errorMessage : error,
                  admin : req.admin,
            });
      }
};

// add new category to category collection
exports.addCategory = async(req, res) => {
      try{
            let inputCategoryName = req.body.category;
            // converted to lowercase for comparison of duplicates
            inputCategoryName = inputCategoryName.toUpperCase();
            const categoryDetails = await categoryCLTN.find({});
            const duplicateCheck = await categoryCLTN.findOne({name:inputCategoryName});

            if(duplicateCheck){
                  // checking if category name deleted, if yes retrieve the soft deleted category
                  if(duplicateCheck.isDeleted == true){
                        await categoryCLTN.updateOne(
                              {_id: duplicateCheck._id},
                              {
                                    isDeleted : false,
                                    updatedBy :  req.session.manager? req.session.manager.name : req.session.admin.name,
                              });
                         res.render('admin/partials/categories',{
                               documentTitle: 'Category Management | LAP4YOU',
                               details : categoryDetails,
                               session : req.session.admin,
                               admin : req.admin,
                         });
                  }else{
                        res.render('admin/partials/categories',{
                              documentTitle: 'Category Management | LAP4YOU',
                              details : categoryDetails,
                              session : req.session.admin,
                              errorMessage : `Category ${inputCategoryName} already exists`,
                              admin : req.admin,
                        });
                  }
            } else{
                  // create instance of category callection and then save.
                  const newCategory = new categoryCLTN({
                        name : inputCategoryName,
                        updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
                  });
                  await newCategory.save();
                  res.redirect('/admin/categories');
            }
      }
      catch(error){
            console.log('Error in adding new category ' + error);
      }
};


// edit category page
exports.editCategoryPage = async(req, res) => {
      const categoryId = req.query.id;
      try{
            const currentCategory = await categoryCLTN.findById(categoryId);
            req.session.currentCategory = currentCategory;

                  res.render('admin/partials/editCategory', {
                        session : req.session.admin,
                        documentTitle : 'Category Management | LAP4YOU',
                        category : currentCategory,
                        admin : req.admin,
                  });
      }
      catch(error){
            console.log('Error in GET Category Page ' + error);
      }
};


//edit category Post 
exports.editCategory = async(req, res) => {
      try{
            const currentCategory = req.session.currentCategory;
            let updatedName = req.body.name;
            updatedName = updatedName.toUpperCase();
            //dupliacte check
            const duplicateCheck = await categoryCLTN.findOne({name : updatedName});
            if(duplicateCheck == null){
                  await categoryCLTN.updateOne(
                        {_id : currentCategory._id },
                        {
                              name : updatedName, 
                              updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
                        });
                  res.redirect('/admin/categories');
            } else{
                  res.render('admin/partials/editCategory',{
                        documentTitle:'Edit Category | LAP4YOU',
                        session : req.session.admin,
                        category : currentCategory,
                        errorMessage : `Category ${updatedName} alredy exists..`,
                        admin : req.admin,
                  })
         }
      }
      catch(error){
            console.log('Error in Post Category ' + error);
      }
}


// delete category page
exports.deleteCategory =  async(req, res) => {
      try{
            const categoryId = req.query.id;
            await categoryCLTN.updateOne(
                  {_id : categoryId},
                  {
                        isDeleted : true, 
                        updatedBy :  req.session.manager? req.session.manager.name : req.session.admin.name,
                  });
            res.redirect('/admin/categories');
      }
      catch(error){
            console.log('Error in deleting Category ' +error);
      }
}