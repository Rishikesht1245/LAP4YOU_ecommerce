const sessionCheck = (req, res, next) => {
      if(req.session.admin || req.session.manager){
             req.admin  = (req.session.admin) ?  true : false;
            next();
      } else{
            res.redirect('/admin');
      }
}


module.exports = sessionCheck;