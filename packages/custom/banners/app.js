'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Banners = new Module('banners');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Banners.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Banners.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Banners.menus.add({
    title: 'banners example page',
    link: 'banners example page',
    roles: ['authenticated'],
    menu: 'main'
  });

  Banners.aggregateAsset('css', 'banners.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Banners.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Banners.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Banners.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Banners;
});
