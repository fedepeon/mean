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
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    required: true,
    default: 'img.jpg'
  },
  active: {
    type: Boolean,
    default:false
  },
  expires: {
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
BannerSchema.path('name').validate(function(name) {
  return !!name;
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
