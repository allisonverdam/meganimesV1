angular.module('MeganimesApp')
  .controller('AnimesCompletosController', function ($scope, AnimesFactory, $http, $ionicPopup, $ionicLoading, $timeout, $ionicScrollDelegate, $ionicFilterBar, $ionicHistory, $ionicPlatform) {
    $scope.titulo = "Animes Completos";
    $scope.refresh = true;

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
    $scope.showFilter = true;

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

          $http.get('http://meganimes.16mb.com/api/animes/buscar/' + filterText + '/completo').success(function (filteredItems) {
            $scope.animes = filteredItems;
            if (filterText) {
              $scope.more = false;
            }else{
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
      $http.get('http://meganimes.16mb.com/api/animes/status/completo?page=' + $scope.pag).success(function (response) {

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
      $scope.showBtn = {
        'visibility': "hidden"
      };
      $scope.more = true;
      $http.get('http://meganimes.16mb.com/api/animes/status/completo?page=1')
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

  });
