const sessionCheck = (req, res, next) => {
      if(req.session.userId){
            next();
      }else{
            res.redirect('/users/signIn')
      }
};

module.exports = sessionCheck;