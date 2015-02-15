'use strict';

/* jshint -W098 */
angular.module('mean.banners').controller('BannersController', ['$scope', 'Global', 'Banners',
function($scope, Global, Banners) {

  $scope.alerts = [
  { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.global = Global;
  $scope.package = {
    name: 'banners'
  };

  $scope.showModal = false;
  $scope.toggleModal = function(){
      $scope.showModal = !$scope.showModal;
  };

  $scope.activeTab = {
    all: 'active'
  };

  $scope.activateTab = function(tab) {
    $scope.activeTab = {}; //reset
    $scope.activeTab[tab] = 'active';
  };

  $scope.predicates = ['banner_name', 'banner_position'];
  $scope.selectedPredicate = $scope.predicates[0];

  $scope.all = function() {

    Banners.query({query: 'not_deleted'}, function(banners) {
      $scope.rowCollection = banners;
      //$scope.displayedCollection = [].concat($scope.rowCollection);
      $scope.activateTab('all');
    });
  };

  $scope.recycleBin = function() {

    Banners.query({query: 'deleted'}, function(banners) {
      $scope.rowCollection = banners;
      //$scope.displayedCollection = [].concat($scope.rowCollection);
      $scope.activateTab('recycleBin');

    });
  };



  //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)

  //add to the real data holder
  $scope.addItem = function addItem() {

    var expires = formatDate(new Date());

    var newBanner = new Banners({
      banner_name: 'WX',
      banner_position: 'Top',
      banner_url: 'http://',
      banner_image: 'img.jpg',
      banner_active: true,
      banner_expires: expires,
      banner_deleted_at: null
    });

    newBanner.$save();

    $scope.rowCollection.unshift(newBanner);
    //$scope.displayedCollection = [].concat($scope.rowCollection);

  };

  //Delete an item (Send to recycle bin)
  $scope.deleteItem = function deleteItem(row) {
    var index = $scope.rowCollection.indexOf(row);
    if (index !== -1) {
      row.deleted_at = new Date();
      row.$update();
      $scope.rowCollection.splice(index, 1);
      //$scope.displayedCollection = [].concat($scope.rowCollection);
    }
  };

  //remove to the real data holder
  $scope.removeItem = function removeItem(row) {
    var index = $scope.rowCollection.indexOf(row);
    if (index !== -1) {
      row.$remove();
      $scope.rowCollection.splice(index, 1);
      //$scope.displayedCollection = [].concat($scope.rowCollection);
    }
  };

  //remove to the real data holder
  $scope.restoreItem = function restoreItem(row) {
    var index = $scope.rowCollection.indexOf(row);
    if (index !== -1) {
      row.deleted_at = null;
      row.$update();
      $scope.rowCollection.splice(index, 1);
      //$scope.displayedCollection = [].concat($scope.rowCollection);
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


angular.module('mean.banners').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('mean.banners').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
