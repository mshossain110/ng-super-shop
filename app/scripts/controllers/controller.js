'use strict';

/**
 * @ngdoc function
 * @name ngSuperShopApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngSuperShopApp
 */
angular.module('ngSuperShopApp')
  .controller('MainCtrl',['$scope', '$http', 'PService', 'amCart', '$log', function ($scope, $http, PService, amCart, $log) {


    if(!PService.isEmpty()){
      $scope.p=PService;
      }else{
          $http.get('data/products.json').success(function(response){
          PService.setAllProducts(response);
          $scope.p=PService;
        });
      }
    $scope.amCart=amCart;


   }])
  .controller('ShopSingleClt', ['$scope', '$routeParams', '$http','PService',function($scope, $routeParams, $http, PService){
    var Productid=$routeParams.productID;



      if(!PService.isEmpty()){
        $scope.product=PService.getProductByID(Productid);
      }else{
          $http.get('data/products.json').success(function(response){
          PService.setAllProducts(response);
          $scope.product=PService.getProductByID(Productid);
        });
      }


  }])
  .controller('amAddtocartClr', ['$scope', function($scope){

  }])
  .controller('cardSummeryclrt', ['$scope', 'amCart', function($scope, amCart){
    $scope.amCart=amCart;
  } ]);
