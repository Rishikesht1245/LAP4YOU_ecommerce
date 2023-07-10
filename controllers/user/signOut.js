
exports.signOut = async (req, res) => {
      try{
            req.session.destroy();
            res.redirect('/users/signIn');
      }catch(error){
            console.log('Error in User Sign Out '+ error);
      }
}