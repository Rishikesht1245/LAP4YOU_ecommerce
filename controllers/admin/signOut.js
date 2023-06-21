exports.signOut = (req, res) => {
      try{
            req.session.destroy();
            res.redirect('/admin')
      } catch(error){
            console.log("Error In Sign Out Admin :" + error);
      }
}