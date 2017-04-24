angular.module('MeganimesApp')
  .controller('NoticiasController', function ($scope, $http, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory,$ionicModal, $ionicPlatform, $rootScope) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.animesJulho = [];
    $scope.animesOutubro = [];
    $scope.anime = [];
    $scope.isModalAberto = null;

    $scope.init = function () {

      $http.get('http://meganimes.16mb.com/api/animes/season/2016.3').success(function (response) {
        angular.forEach(response.data, function(data){
          $scope.animesJulho.push(data);
        });
      }).error(function (err) {
        console.log("Erro:",err);
        $scope.noNoticias = {
          'visibility': "visible",
          'position': 'absolute',
          'top': '0',
          'width': '100%'
        };
      })

      $http.get('http://meganimes.16mb.com/api/animes/season/2016.4').success(function (response) {
        angular.forEach(response.data, function(data){
          $scope.animesOutubro.push(data);
        });
        $scope.visibility = {
          'visibility': "visible"
        };
      }).error(function (err) {
        console.log("Erro:",err);
        $scope.noNoticias = {
          'visibility': "visible",
          'position': 'absolute',
          'top': '0',
          'width': '100%'
        };
      })
    };

    //INICIO DO MODAL
    $ionicModal.fromTemplateUrl('templates/sinopse.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function($anime) {
      $scope.isModalAberto = true;
      $scope.anime = $anime;
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.isModalAberto = false;
      $scope.anime = [];
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    //FIM DO MODAL

    // run this function when either hard or soft back button is pressed
    var doCustomBack = function () {
      if ($scope.isModalAberto == true){
        $scope.closeModal();
      }else{
        $ionicHistory.goBack();
      }
    };

    //override soft back
    $rootScope.$ionicGoBack = function (event) {
      doCustomBack();
      event.stopPropagation();
    };

    // override hard back
    $ionicPlatform.registerBackButtonAction(function (event) {
      doCustomBack();
      event.stopPropagation();
    },1000);

})
