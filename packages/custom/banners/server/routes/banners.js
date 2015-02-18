'use strict';

var multer  = require('multer');
var banners = require('../controllers/banners');

// Banner authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.banner.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};


module.exports = function(Banners, app, auth) {

  //Define multer behavior


  app.use(multer({
    dest: './packages/custom/banners/public/assets/img',
   rename: function (fieldname, filename) {
     return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
  }));


  // Routes
  app.route('/banners/upload')
  .post(auth.requiresLogin, banners.upload);
  app.route('/banners')
  .get(banners.all)
  .post(auth.requiresLogin, banners.create);
  app.route('/banners/:bannerId')
  .get(auth.isMongoId, banners.show)
  .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, banners.update)
  .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, banners.destroy);

  // Finish with setting up the bannerId param
  app.param('bannerId', banners.banner);
};
