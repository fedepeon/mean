'use strict';

/* jshint -W098 */
angular.module('mean.banners').controller('BannersController', ['$scope', 'Global', 'Banners',
function($scope, Global, Banners) {

  $scope.global = Global;
  $scope.package = {
    name: 'banners'
  };

  $scope.find = function() {
    Banners.query({query: 'not_deleted'}, function(banners) {
      $scope.rowCollection = banners;
      $scope.displayedCollection = [].concat($scope.rowCollection);
      console.log('find()');
    });
  };

  //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)

  //add to the real data holder
  $scope.addItem = function addItem() {

    var expires = formatDate(new Date());

    var newBanner = new Banners({
      banner_name: 'New Banner',
      banner_position: 'Top',
      banner_url: 'http://',
      banner_image: 'img.jpg',
      banner_active: true,
      banner_expires: expires,
      banner_deleted_at: null
    });

    newBanner.$save();

    $scope.rowCollection.push(newBanner);
    $scope.displayedCollection = [].concat($scope.rowCollection);
    
  };

  //remove to the real data holder
  $scope.removeItem = function removeItem(row) {
    var index = $scope.rowCollection.indexOf(row);
    if (index !== -1) {
      row.deleted_at = new Date();
      row.$update();
      $scope.rowCollection.splice(index, 1);
      $scope.displayedCollection = [].concat($scope.rowCollection);
    }
  };

  function formatDate(date) {
    var month = date.getMonth();
    var day = date.getDate();
    month = month + 1;
    month = month + '';
    if (month.length === 1)
    {
      month = '0' + month;
    }
    day = day + 1;
    day = day + '';
    if (day.length === 1)
    {
      day = '0' + day;
    }
    return date.getFullYear()  + '-' + month + '-' + day;
  }

}
]);
