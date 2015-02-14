'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Banner Schema
 */
var BannerSchema = new Schema({
  banner_name: {
    type: String,
    required: true,
    trim: true
  },
  banner_position: {
    type: String,
    required: true,
    trim: true
  },
  banner_url: {
    type: String,
    required: true,
    trim: true
  },
  banner_image: {
    type: String,
    trim: true,
    required: true,
    default: 'img.jpg'
  },
  banner_active: {
    type: Boolean,
    default:false
  },
  banner_expires: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  }
});


/**
 * Validations
 */
BannerSchema.path('banner_name').validate(function(banner_name) {
  return !!banner_name;
}, 'Banner name cannot be blank');


/**
 * Statics
 */
BannerSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Banner', BannerSchema);
