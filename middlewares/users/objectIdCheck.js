const ObjectId = require('mongoose').Types.ObjectId;

// checj 
const objectIdCheck = (req, res, next) => {
      if (ObjectId.isValid(req.params.id)){
            if(String(new ObjectId(req.params.id)) === req.params.id){
                  next();
            } else{
                  res.redirect('/pageNotFound');
            }
      }else{
            res.redirect('pageNotFound');
      }
}

module.exports = objectIdCheck;