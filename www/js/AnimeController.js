angular.module('MeganimesApp')
  .controller('AnimeController', function ($scope, $rootScope, $sce, $ionicPopover, $ionicPlatform, $ionicHistory, $filter, $ionicModal, $cordovaToast, $ionicPopup, $localStorage, $stateParams, $http, $ionicLoading, $timeout, $ionicScrollDelegate, $ionicFilterBar) {
    $ionicScrollDelegate.resize();
    $scope.more = null;
    $scope.anime = [];
    $scope.animeTemp = [];
    $scope.animeOld = [];
    $scope.temp = null;
    $scope.episodiosAssistidos = [];
    $scope.coracao = "img/heart_2.png";
    $scope.votou = false;
    $scope.btnVotar = false;
    $scope.isModalAberto = null;

    // set the rate and max variables
    $scope.rating = {};
    $scope.rating.rate = 3;
    $scope.rating.max = 5;


    $scope.init = function () {
      $scope.temp = 1;
      $http.get('http://meganimes.16mb.com/api/anime/' + $stateParams.id).success(function (data) {
        $scope.titulo = data.nome;
        angular.forEach($localStorage.favoritos, function (favorito) {
          if (data.id == favorito.id) {
            $scope.coracao = "img/heart_1.png";
          }
        });

        $scope.anime = data;
        $scope.visibility = {
          'visibility': "visible"
        };
        $scope.more = true;
      });
    };

    $scope.scrollTop = function () {
      $ionicScrollDelegate.scrollTop();
    };

    $scope.showAlert = function (titulo, texto) {
      var alertPopup = $ionicPopup.alert({
        title: titulo,
        template: texto
      });
      alertPopup.then(function (res) {
        console.log('alerta efetuado');
      });
    };

    $scope.favoritar = function (anime_id) {
      if ($localStorage.accessToken != null) {

        if ($scope.coracao == "img/heart_1.png") {
          $scope.$evalAsync(function () {
            $scope.coracao = "img/heart_2.png";
          });

          console.log("antes de remover", $localStorage.favoritos);
          for(var i = 0; i < $localStorage.favoritos.length; i++){
            if($localStorage.favoritos[i].id == anime_id)
              $localStorage.favoritos.splice(i, 1);
          }

          $scope.database.ref('favoritos/' + $localStorage.usuario.id + '/' + $scope.anime.id).remove();
          console.log("depois de remover", $localStorage.favoritos);


          $cordovaToast.showLongBottom('Anime removido dos favoritos.').then(function (success) {
            // success
          }, function (error) {
            // error
          });
        } else {
          $scope.$evalAsync(function () {
            $scope.coracao = "img/heart_1.png";
          });

          $localStorage.favoritos.push($scope.anime);

          console.log("Localstorage", $localStorage.favoritos);
          $scope.database.ref('favoritos/' + $localStorage.usuario.id + '/' + $scope.anime.id).set({
            id: $scope.anime.id,
            nome: $scope.anime.nome,
            imagem: $scope.anime.imagem
          });

          $cordovaToast.showLongBottom('Anime adicionado aos favoritos.').then(function (success) {
            // success
          }, function (error) {
            // error
          });
        }
      } else {
        $scope.showAlert("Atenção", "Você precisa estar logado!");
      }
    };

    $scope.getNumber = function (num) {
      var x = [];
      for (var i = 0; i < num; i++) {
        x.push(i + 1);
      }
      $scope.selected = x[0];
      return x;
    };

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.animes,
        update: function (filteredItems, filterText) {
          if (filterText == "" || filterText == null) {
            $scope.more = true;
            $scope.pag = 1;
            $scope.$evalAsync(function () {
              $scope.animeTemp = [];
            });
            return;
          }

          $http.get('http://meganimes.16mb.com/api/episodios/' + $scope.anime.id + '/' + filterText).success(function (filteredItems) {
            if (filteredItems.episodio == null) {
              $scope.$evalAsync(function () {
                $scope.animeTemp = [];
                $scope.ep404 = true;
              });
              $scope.showBtn = {
                'visibility': "hidden"
              };
            } else {
              $scope.$evalAsync(function () {
                $scope.ep404 = false;
                $scope.animeTemp = [];
                $scope.animeTemp.push(filteredItems.episodio);
              });

              $scope.showBtn = {
                'visibility': "hidden"
              };

            }
            if (filterText) {
              $scope.more = false;
              //console.log(filterText);
            } else {
              $scope.more = true;
              $scope.pag = 1;
              $scope.$evalAsync(function () {
                $scope.ep404 = false;
              });
            }
          });
        },
        config: {
          placeholder: 'Digite o número do episodio.'
        },
        cancelText: 'Cancelar'
      });
    };

    //Adicona o episódio no localstorage de episódios assistidos//////////
    $scope.assitido = function (anime_id, ep_id) {
      var achou = false;
      var json = JSON.parse('{ "anime_id": ' + anime_id + ',' + ' "ep_id": ' + ep_id + ' }');
      if ($localStorage.episodiosAssistidos == null)
        $localStorage.episodiosAssistidos = [];

      angular.forEach($localStorage.episodiosAssistidos, function (episodio) {
        if (ep_id == episodio.ep_id) {
          achou = true;
        } else {
          achou = false;
        }
      });

      if (!achou)
        $localStorage.episodiosAssistidos.push(json);

    }

    $timeout(function () {
      $scope.showMe = true;
    })

    ////pintaNum(ep.id)
    $scope.loadMore = function (temp) {
      if (temp == null) {
        if ($scope.selected == null) {
          $scope.selected = 1;
          $scope.temp = 1;
        }
      }

      $http.get('http://meganimes.16mb.com/api/v2/anime/' + $stateParams.id + '/' + $scope.temp).success(function (response) {

        $scope.more = false;
        $scope.showBtn = {
          'visibility': "visible"
        };

        for (var y = 0; y < response.length; y++) {
          $scope.animeTemp.push(response[y]);
        }
        ;

      }).finally(function () {
        $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    //Função para pintar os episódios assistidos
    $scope.pintarAssistidos = function (ep) {
      var assistido = false;
      for (var i = 0; i < $localStorage.episodiosAssistidos.length; i++) {
        if (ep.id == $localStorage.episodiosAssistidos[i].ep_id) {
          assistido = true;
          break;
        } else {
          assistido = false;
        }
      }
      if (assistido) {
        return {
          num_ep2: true
        }
      } else {
        return {
          num_ep: true
        }
      }
    };

    $scope.outraTemp = function (id, temp) {
      $scope.showBtn = {
        'visibility': "hidden"
      };

      $scope.more = true;
      $scope.pag = 1;
      $scope.pagTemp = 1;
      $scope.tempAtual = temp;
      $scope.temp = $scope.tempAtual;
      $scope.animeTemp = [];
      $scope.loadMore($scope.temp);
    };

    //INICIO DO MODAL
    $ionicModal.fromTemplateUrl('templates/sinopse.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.isModalAberto = true;
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.isModalAberto = false;
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
    //FIM DO MODAL

    $scope.showVotar = function () {
      if ($localStorage.accessToken != null) {
        $scope.btnVotar = true;
      } else {
        $scope.btnVotar = false;
        $scope.showAlert("Atenção", "Você precisa estar logado!");
      }
    }

    $scope.votar = function () {
      $scope.votou = true;
      $scope.btnVotar = false;
      $http.get('http://meganimes.16mb.com/api/favoritar/' + $scope.anime.id + '/' + $localStorage.usuario.id + '/' + $scope.anime.classificacao)
        .success(function (response) {
          $scope.anime.classificacao = response.classificacao;
          $scope.anime.quantidade_votos = response.quantidade_votos;
          $scope.votou = false;
        }).error(function (err) {
        console.log("não foi", err);
        $scope.votou = false;
      })
    }

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

    $ionicPopover.fromTemplateUrl('templates/popoverEpisodio.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
      //$scope.popover.data = $scope.notificacao;
    });

    $scope.openPopover = function(animeId, animeTemp, epId) {
      $scope.anime_id = animeId;
      $scope.ep_id = epId;
      $scope.episodios = animeTemp;

      $scope.popover.data = $localStorage.lastAtualizacao;
      $scope.popover.show();

      $timeout(function () {
        $scope.assitido(animeId, epId);
      }, 10000)
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    $scope.openEpisodio = function (link) {
      window.plugins.videoPlayer.play(link);
      //window.open(link, '_system');
      $scope.closePopover();
    }

    $scope.carregarEp = function (animeId, animeTemp, epId) {
      $scope.openPopover(animeId, animeTemp, epId);
      $http.get('http://meganimes.16mb.com/api/episodio/' + epId).
      success(function(data) {
        $scope.link = data.video;
      })
    }

  })
