'use strict';

//Banners service used for banners REST endpoint
angular.module('mean.banners').factory('Banners', ['$resource',
function($resource) {
  return $resource('banners/:bannerId', {
    bannerId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
]);
