// middleware function to check if admin session is present or not
const sessionCheck = (req, res, next) => {
      if(req.session.manager){
            next();
      } else{
            res.redirect('/manager');
      }
}


module.exports = sessionCheck;