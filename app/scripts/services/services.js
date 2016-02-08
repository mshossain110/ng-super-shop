'use strict';

/**
 * @ngdoc service
 * @name ngSuperShopApp.products
 * @description
 * # products
 * Service in the ngSuperShopApp.
 */
angular.module('angularMart.Service', [])
  .service('PService', [ function () {
  		var $products;


 			this.setAllProducts= function(value){
 				this.$products=value;
 			};
 			this.getAllProducts= function(){
 				return this.$products;
 			};
 			this.isEmpty = function(){
 				if( typeof this.$products === 'object' && this.$products.length > 0 ){
 					return false;
 				}else{
 					return true;
 				}
 			};
      this.getProductByID=function(ids){
          var productByID;
        if(Array.isArray(ids)){

          angular.forEach(this.getAllProducts(), function(product){
            if(ids.indexOf(product.ID) > -1){
              productByID.push(product);
            }
          });
        }else{

          angular.forEach(this.getAllProducts(), function(product){
            if(product.ID === ids){
              productByID=product;

            }
          });
        }

        return productByID;
      };

      this.getProductByCategory=function(category, number){
        var productByCategory=[];
        if(typeof category=== 'undefined') {return false;}
        var num = number ? parseInt(number, 10): null;
        var cat=[];
        if(Array.isArray(category)){
          category.forEach(function(c){
            cat.push(c.toLowerCase());
          });
        }else {
          cat.push(category.toLowerCase());
        }

        angular.forEach(this.getAllProducts(), function(product){
          if(cat.indexOf(product.category.toLowerCase()) > -1 && (num >0 || num===null )){
            productByCategory.push(product);
            if(num!==null){
              num--;
            }

          }
        });
        return productByCategory;
      };

  }])
  .service('amCart', ['$rootScope', 'AmItem', 'store', function($rootScope, AmItem, store){
    this.init= function(){
      this.$cart={
        items: [],
        shipping: null
      };
    };

    this.addItem= function(id, name, image, price, quantity, data){
      var inCart= this.getItemById(id);
      if(typeof inCart === 'object' ){
        inCart.setQuantity(quantity, false);
        $rootScope.$broadcast('amCart:update', inCart);
      }else{
        var newItem= new AmItem(id, name, image, price, quantity, data);
        this.$cart.items.push(newItem);
         $rootScope.$broadcast('amCart:add', newItem);
      }
       $rootScope.$broadcast('amCart:change', {});
    };

    this.getItemById=function(id){
      var items= this.getCart().items;
      var iditem;
      angular.forEach(items, function(item){
        if(item.getId()===id){
          iditem=item;
        }
      });
      return iditem;
    };
    this.getCart=function(){
      return this.$cart;
    };
    this.setCart=function(cart){
      this.$cart=cart;
      return this.getCart();
    };
    this.setShipping=function(shipping){
      this.$cart.shipping=shipping;
      return this.getShipping();
    };
    this.getShipping=function(){
      if(this.$cart.shipping !=='null'){
        return this.$cart.shipping;
      }

    };

    this.getAllItems=function(){
      return this.$cart.items;
    };

    this.getTotalItems=function(){
      var count=0;
      var items=this.$cart.items;
      angular.forEach(items, function(item){
        count +=item.getQuantity();
      });
      return count;
    };
    this.getSubTotal=function(){
      var total=0;
      var items =this.$cart.items;
      angular.forEach(items, function(item){
        total += parseFloat(item.getTotal()) ;
      });
      return total;
    };

    this.removeItemById=function(id){
      var cart=this.getCart();
      var removedItem;
      angular.forEach(cart.items, function(item, index){
        if(item.getId()===id){
          removedItem = cart.items.splice(index, 1)[0] || {};
        }
      });
      this.setCart(cart);
       $rootScope.$broadcast('amCart:change', {});
       $rootScope.$broadcast('amCart:remove', removedItem);
      return removedItem;
    };
    this.isEmpty=function(){
    return this.getCart().items.length >0 ? false: true;
  };
    this.toObject=function(){
      if(this.getCart().items.length <0) {return false;}

      var items=[];
      angular.forEach(this.getAllItems(), function(item){
        items.push(item.toObject());

      });

      return{
        shipping:this.getShipping(),
        subTotal: this.getSubTotal(),
        items: items
      };

    };
    this.restore=function(cart){
        var _self=this;
        _self.init();
        _self.$cart.shipping=cart.shipping;
        _self.subTotal= cart.subTotal;
        angular.forEach(cart.items, function(item){
          _self.$cart.items.push(new AmItem(item.id, item.name, item.image, item.price, item.quantity, item.data));
        });

        this.save();
    };
    this.save=function(){
      $rootScope.$broadcast('amCart:beforeSave', {});
      return store.set('amCart', JSON.stringify(this.toObject()));

    };


  }])

  .factory('AmItem', ['$log', function($log){
    var item = function(id, name, image, price, quantity, data) {
      this.setId(id);
      this.setName(name);
      this.setImage(image);
      this.setPrice(price);
      this.setQuantity(quantity);
      this.setData(data);
    };
    item.prototype.setId=function(id){
      if(id && typeof id === 'number'){
        this.id=id;
      }else{
        $log.error("A numaric Id must be provided");
      }
    };

    item.prototype.getId=function(){
      return this.id;
    };
    item.prototype.setName= function(name){
      if(name && typeof name === 'string') {
        this.name= name;
      } else {
        $log.error("A product name must be provieded");
      }
    };
    item.prototype.getName= function(){
      return this.name;
    };
    item.prototype.setImage=function(image){
      if(image) {this.image=image;}
      else {this.image='defaultimges.jpg';}
    };
    item.prototype.getImage=function(){
      return this.image;
    };
    item.prototype.setPrice=function(price){
      var pricef = parseFloat(price);
      if(pricef >=0 ){
        this.price=(pricef);
      }
      else {$log.error("A price must be provided");}
    };
    item.prototype.getPrice=function(){
      return this.price;
    };
    item.prototype.setQuantity=function(quantity, relative){
      var quantityi=parseInt(quantity, 10);
      if(quantityi && quantityi > 0)
      {
        if(relative === true){
          this.quantity +=quantityi;
        }else {
          this.quantity=quantityi;
        }
      }else {
        this.quantity=1;
        $log.info("Quantity must be an integer gratter then 0");
      }
    };
    item.prototype.getQuantity=function(){
      return this.quantity;
    };
    item.prototype.setData=function(data){
      if(data) {this.data=data;}
    };
    item.prototype.getData=function(){
      if(this.data){
          return this.data;
      }else {
        $log.info("This item has not set any data");
      }
    };
    item.prototype.getTotal=function(){
       this.total= parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);

       return this.total;
    };
    item.prototype.toObject=function(){
      return {
        id : this.getId(),
        name: this.getName(),
        image:this.getImage(),
        price: this.getPrice(),
        quantity: this.getQuantity(),
        total:this.getTotal()
      };
    };

    return item;
  }])
  .service('store', ['$window', function($window){
    return {
      get: function(key){
        if($window.localStorage[key]){
          return JSON.parse($window.localStorage[key]);
        }
        return false;
      },
      set: function(key, value){
        if(typeof value === 'undefined'){
          $window.localStorage.removeItem(key);
        }else {
          $window.localStorage[key]=value;
        }

        return $window.localStorage[key];
      }
    };
  }])

  .service('isMobile', ['$window', function($window){

    return {
      Android: function() {
            return $window.navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return $window.navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return $window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return $window.navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return $window.navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    }
  }])


  ;
