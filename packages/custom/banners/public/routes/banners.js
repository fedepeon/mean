'use strict';

angular.module('mean.banners').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('banners example page', {
      url: '/banners/example',
      templateUrl: 'banners/views/index.html'
    });
  }
]);
