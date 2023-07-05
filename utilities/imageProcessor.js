const sharp = require('sharp');

// saving image after compressing
exports.profilePic = async (req, res, next) => {
      if(!req.file){
            next();
      }
      req.file.filename = `${req.body.name}_${Date.now()}.jpeg`;
      sharp(req.file.buffer)
            .resize(320, 320)
            .toFormat('jpeg')
            .jpeg({quality:80})
            .toFile(`public/img/users/${req.file.filename}`);
      next();
}



