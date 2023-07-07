// middleware function to check if admin or manager session is present or not
const accessCheck = (requiredRoles) => {
      return (req, res, next) => {
            if (req.session.admin) {
              // admin logged in
                  req.admin = true;
                  next();
            } else if (req.session.manager) {
                  const managerRoles = req.session.manager.roles;
                  const hasAccess = requiredRoles.some((role) => managerRoles.includes(role));
                  console.log(hasAccess)
                  if (hasAccess) {
                      //manager logged in
                      req.admin = false;
                      next();
                  } else {
                      req.admin = false;
                      req.flash('error', `You are not authorized to access ${requiredRoles[0]}s`);
                      res.redirect('/admin/dashboard');
                  }
            } else {
              res.redirect('/admin'); // Redirect to a suitable route or page
            }
      };
};
    
    module.exports = accessCheck;
    


module.exports = accessCheck;