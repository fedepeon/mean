'use strict';

/* jshint -W098 */
angular.module('mean.banners').controller('BannersCtrl', ['$scope', '$modal', '$log', 'Global', 'Banners',
function($scope, $modal, $log, Global, Banners) {

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

  $scope.activeTab = {
    all: 'active'
  };

  $scope.activateTab = function(tab) {
    $scope.activeTab = {}; //reset
    $scope.activeTab[tab] = 'active';
  };

  $scope.predicates = ['name', 'position'];
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

    var expires = new Date();

    var newBanner = new Banners({
      name: 'WX',
      position: 'Top',
      url: 'http://',
      image: 'img.jpg',
      active: true,
      expires: expires,
      deleted_at: null
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


  $scope.editItem = function (item) {

    //$scope.row = row;

    var modalInstance = $modal.open({
      templateUrl: 'edit.html',
      controller: 'EditModalCtrl',
      size: 'lg',
      resolve: {
        item: function () {
          return item;
        }
      }
    });

    modalInstance.result.then(function (item) {
      console.log(item);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };


}
]);


angular.module('mean.banners').controller('EditModalCtrl', ['$scope',  '$modalInstance', 'item', function ($scope,  $modalInstance, item) {

    $scope.item = item;

    $scope.dt = new Date();
    console.log($scope.item);

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };


    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.format = 'yyyy/MM/dd';

/*---------------------------------------*/
  $scope.submitted = false;
  $scope.item = item;
  $scope.positionOptions = ['Top', 'Bottom', 'Left'];


  $scope.ok = function (isValid) {
    $scope.submitted = true;
    if (isValid) {

      $scope.item.updated_at = new Date().getTime();

      $scope.item.$update();
      $modalInstance.close($scope.item);

    } else {
      $scope.submitted = true;
    }
  };

  $scope.cancel = function () {
    $scope.submitted = false;
    $modalInstance.dismiss('cancel');
  };
}]);
