'use strict';

/**
 * @ngdoc function
 * @name ngSuperShopApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngSuperShopApp
 */
angular.module('ngSuperShopApp')
  .controller('MainCtrl',['$scope', '$http', 'PService', '$log', function ($scope, $http, PService, $log) {
    
    	$http.get('data/products.json').success(function(response){
        PService.setAllProducts(response);
        $scope.allproducts=response;
      })
    
   }])
  .controller('ShopSingleClt', ['$scope', '$routeParams', '$http','PService',function($scope, $routeParams, $http, PService){
    var ProductCode=$routeParams.productID;
      


      if(!PService.isEmpty()){
        $scope.product=PService.getProductByCode(ProductCode);
      }else{
          $http.get('data/products.json').success(function(response){
          PService.setAllProducts(response);
          $scope.product=PService.getProductByCode(ProductCode);
        });
      }


  }]);
