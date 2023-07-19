const bcrypt = require('bcrypt');
const userCLTN = require('../../models/users/userDetails');


exports.signInPage = async (req, res) => {
      try{
            // if users session is present, don't render sign In
            if(req.session.userId){
                  res.redirect('/');
            } else{
                  res.render('user/partials/signIn',{
                        documentTitle : 'User Sign In | LAP4YOU',
                        session : null,
                  });
            }
      } catch(error){
            console.log('Error rendering user sign In page :' + error);
      }
};


exports.signInVerification = async(req, res)=> {
      try {
            const inputEmail = req.body.email.toLowerCase();
            const inputPassword = req.body.password;
            const userFind = await userCLTN.findOne({email : inputEmail}).populate('cart wishlist');
            
            if(userFind){
                  const hashedCheck = await bcrypt.compare(
                        inputPassword,
                        userFind.password
                  );
                  if(userFind.access == true){
                        if(hashedCheck){
                              req.session.userId = userFind._id;
                              req.session.email = inputEmail;
                              req.session.cartCount = userFind.cart.totalQuantity;
                              req.session.wishlistCount = userFind.wishlist.products.length;
                              if(req.session.currentUrl){
                                    res.redirect(req.session.currentUrl);
                              }
                              res.redirect('/');
                        }
                        else{
                              res.render('user/partials/signIn',{
                                    documentTitle : "User Sign In | LAP4YOU",
                                    errorMessage : "Incorrect Password",
                              });
                        }
                  } else{
                        res.render('user/partials/signIn',{
                              documentTitle : "User Sign In | LAP4YOU",
                              errorMessage : "Unauthorized User",
                        }); 
                  }
            } else{
                  res.render('user/partials/signIn',{
                        documentTitle : "User Sign In | LAP4YOU",
                        errorMessage : "User Not Found",
                  });
            }
      } catch (error) {
            console.log('Error signing in user : '+error);
      }
};