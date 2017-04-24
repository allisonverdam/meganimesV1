angular.module('MeganimesApp')
  .controller('FavoritosController', function($scope, $localStorage){
    $scope.initFavoritos = function(){
      $scope.fav = $localStorage.favoritos;
      console.log("favoritos", $scope.fav);
    }
  })
