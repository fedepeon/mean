'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Banner = mongoose.model('Banner'),
  fs = require('fs'),
  _ = require('lodash');

/**
 * Find a banner by id
 */
exports.banner = function(req, res, next, id) {
  Banner.load(id, function(err, banner) {
    if (err) return next(err);
    if (!banner) return next(new Error('Failed to load banner ' + id));
    req.banner = banner;
    next();
  });
};

/**
 * Create a banner
 */
exports.create = function(req, res) {

  console.log(req.body);
  var banner = new Banner(req.body);
  banner.user = req.user;

  banner.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the banner'
      });
    }
    res.json(banner);

  });
};

/**
 * Update a banner
 */
exports.update = function(req, res) {

  console.log(req.body);

  var banner = req.banner;

  banner = _.extend(banner, req.body);

  banner.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the banner'
      });
    }
    res.json(banner);

  });
};

/**
 * Destroy a banner
 */
exports.destroy = function(req, res) {
  var banner = req.banner;
  var image = './packages/custom/banners/public/assets/img/'+banner.image;

  if (banner.image !== 'img.png') {

    fs.exists(image, function (exists) {
        if (exists) {
          fs.unlink(image, function (err) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot delete:'+image
              });
            }
            console.log('successfully deleted:'+image);
          });
        }
    });
  }

  banner.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the banner'
      });
    }
    res.json(banner);
  });

};

/**
 * Show a banner
 */
exports.show = function(req, res) {
  res.json(req.banner);
};

/**
 * List of Banners
 */
exports.all = function(req, res) {
  var qry = req.query.query;
  var qryObj = {};

  if (qry === 'not_deleted') {
    qryObj = {deleted_at:null};
  } else {
    qryObj = {deleted_at:{'$ne':null}};
  }

  Banner.find(qryObj).sort('-created_at').populate('user', 'name username').exec(function(err, banners) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the banners'
      });
    }
    res.json(banners);

  });
  console.log(qry);


};

exports.upload = function(req, res) {
  console.log(req.files);
  var data = {
      success: true,
      file: req.files.file
      };
  res.jsonp(data);
};
