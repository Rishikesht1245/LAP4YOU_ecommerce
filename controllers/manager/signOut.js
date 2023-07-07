//sign Out
exports.signOut = (req, res) => {
      try{
            req.session.destroy();
            res.redirect('/manager')
      } catch(error){
            console.log("Error In Sign Out Admin :" + error);
      }
}