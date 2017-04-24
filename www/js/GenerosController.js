angular.module('MeganimesApp')
  .controller('GenerosController', function ($scope, $http, $state, $timeout, $ionicScrollDelegate, $ionicFilterBar, $localStorage){
    $scope.titulo = "Animes"

    // Check for network connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'Sem conexão com a internet.',
          content: 'Nenhuma conexão com a internet detectada. Reconecte e tente novamente.'
        })
          .then(function (result) {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });
      }
    }

    //Iniciando os escopos essenciais.
    $scope.pag = 1;
    $scope.animes = [];
    $scope.more = true;
    $scope.showFilter = false;

    $scope.init = function () {

      $http.get('http://meganimes.16mb.com/api/generos').success(function (data) {
        $scope.generos = data;
      }).error(function (error) {
        $scope.noGeneros = {
          'visibility': "visible",
          'position': 'absolute',
          'top': '0',
          'width': '100%'
        };
      })
    }

    $scope.buscarPorGenero = function (id) {
      $scope.refresh = false;
      $localStorage.id = id;
      $state.go('app.generosAnimes');
      $scope.id = $localStorage.id;
      $scope.pag = 1;
    }

    //Função para abrir a barra de busca de animes.
    $scope.showFilterBar = function () {
      $scope.animesOld = $scope.animes;
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.animes,
        update: function (filteredItems, filterText) {
          if(filterText == "" || filterText == null){
            $scope.animes = $scope.animesOld;
            $scope.more = true;
            return;
          }
          $http.get('http://meganimes.16mb.com/api/animes/buscar/' + filterText).success(function (filteredItems) {
            $scope.animes = filteredItems;
            if (filterText) {
              $scope.more = false;
            } else {
              $scope.animes = $scope.animesOld;
              $scope.more = true;
            }
          });
        },
        config: {
          placeholder: 'Digite o nome do anime.'
        },
        cancelText: 'Cancelar'
      });
    };

    //Função usada no infinite-scroll, para pegar novos animes.
    $scope.loadMore = function () {
      $scope.id = $localStorage.id;
      $http.get('http://meganimes.16mb.com/api/animes/genero/'+$scope.id+'?page='+$scope.pag).success(function (response) {
        if (response.length == 0) {
          $scope.more = false;
          $scope.showBtn = {
            'visibility': "visible"
          };
        } else {
          $scope.more = true;
        }

        angular.forEach(response, function (data) {
          $scope.animes.push(data);
          $ionicScrollDelegate.resize();
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicScrollDelegate.resize();
        $scope.pag++;
      });
    };

    //Função para fazer o 'puxe para atualizar', ele pega a primeira página de animes.
    $scope.doRefresh = function () {
      $scope.id = $localStorage.id;
      console.log('$scope.id',$scope.id)
      $scope.showBtn = {
        'visibility': "hidden"
      };
      $scope.more = true;
      $http.get('http://meganimes.16mb.com/api/animes/genero/2?page=1')
        .success(function (newItems) {
          $scope.animes = newItems;
          $scope.pag = 2;

          $scope.$broadcast('scroll.refreshComplete');
        });

    };

    //Função para voltar para o topo.
    $scope.scrollTop = function () {
      $ionicScrollDelegate.scrollTop();
    };
})
