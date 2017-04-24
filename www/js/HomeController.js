angular.module('MeganimesApp')
  .controller('HomeController', function($cordovaInAppBrowser, $scope, $state, $timeout, $ionicScrollDelegate, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicLoading, $localStorage, $ionicModal, $ionicSideMenuDelegate, $firebaseAuth, $cordovaOauth, $http){
    $scope.auth = firebase.auth();
    $scope.database = firebase.database();
    if ($localStorage.usuario != null)
      $scope.usuario = $localStorage.usuario;

    if ($localStorage.episodiosAssistidos == null)
      $localStorage.episodiosAssistidos = [];

    //Iniciando os escopos essenciais.
    $scope.pag = 1;
    $scope.animes = [];
    $scope.more = true;
    $scope.showFilter = false;

    $scope.login = function() {
      // Check for network connection
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: 'Sem conexão com a internet.',
            content: 'Nenhuma conexão com a internet detectada. Reconecte e tente novamente.'
          })
            .then(function(result) {
              if(!result) {
                ionic.Platform.exitApp();
              }
            });
        }
      }
      $localStorage.favoritos = [];

      if($localStorage.vip != null) {
        $scope.vip = $localStorage.vip;
        if ($scope.vip.isVip == true)
          window.AdMob.removeBanner();
      }else{
        $localStorage.vip = [];
      }


      /* inicio facebook login */
      $ionicPlatform.ready(function() {
        var fbLoginSuccess = function (userData) {
          console.log("UserInfo: ", userData);
          facebookConnectPlugin.getAccessToken(function(token) {
            $localStorage.accessToken = token;

            var credential = firebase.auth.FacebookAuthProvider.credential(token);
            $scope.auth.signInWithCredential(credential).then(function(user) {

              $scope.init();
            }, function(error) {
              console.log(error);
            });
          });
        }

        facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
          function (error) {
            console.error(error)
          }
        );
      })
      /* fim facebook login */

      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.home');
    };

    $scope.logout = function(){
      $localStorage.accessToken = null;
      $localStorage.usuario = null;
      $scope.usuario = null;
      $localStorage.toggleFav = null;
      $localStorage.vip = [];
      $scope.vip = [];
      $localStorage.favoritos = [];
      $scope.fav = [];
      $scope.$evalAsync(function() { $scope.estrela = "img/star_2.png"; });
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.home');
    };

    $scope.init = function() {
      $scope.titulo = "Meganimes";

      if($localStorage.vip == null)
        $localStorage.vip = [];

      if($localStorage.versao == null)
        $localStorage.versao = [];

      if($localStorage.toggleFav == null || $localStorage.toggleFav.length == 0){
        $localStorage.toggleFav = [];
        $localStorage.toggleFav.checked = true;
        $scope.toggleFav = $localStorage.toggleFav;
      }else{
        $scope.toggleFav = $localStorage.toggleFav;
      }

      if($localStorage.lastAtualizacao != null)
        $scope.notificacao = $localStorage.lastAtualizacao;

      if($localStorage.notificacoes == null || $localStorage.notificacoes.length == 0) {
        $localStorage.notificacoes = [];
        $timeout(function () {
          $scope.$apply(function(){
            $scope.badgeCount = 0;
          });
        }, 1000);
      }else{
        $timeout(function () {
          $scope.$apply(function(){
            $scope.badgeCount = $localStorage.notificacoes.length;
          });
        }, 1000);
      }

      //ADMOB
      var admobid = {};

      // TODO: replace the following ad units with your own
      if (/(android)/i.test(navigator.userAgent)) {
        admobid = { // for Android
          banner: 'ca-app-pub-9263273387626941/2882156518',
          interstitial: 'ca-app-pub-9263273387626941/4712143312',
          videoReward: 'ca-app-pub-9263273387626941/4469967715'
        };
      } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        admobid = { // for iOS
          banner: 'ca-app-pub-9263273387626941/2882156518',
          interstitial: 'ca-app-pub-9263273387626941/4712143312',
          videoReward: 'ca-app-pub-9263273387626941/4469967715'
        };
      } else {
        admobid = { // for Windows Phone
          banner: 'ca-app-pub-9263273387626941/2882156518',
          interstitial: 'ca-app-pub-9263273387626941/4712143312',
          videoReward: 'ca-app-pub-9263273387626941/4469967715'
        };
      }


      if($localStorage.accessToken != null) {
        $http.get("https://graph.facebook.com/v2.7/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,picture,email,friends", format: "json" }})
          .success(function(result) {
            if (result != null) {
              if($localStorage.usuario == null)
                $ionicSideMenuDelegate.toggleLeft();

              $localStorage.amigos = result.friends.data;

              delete result.friends;
              $localStorage.usuario = result;

              $scope.usuario = result;
            }else{
              $scope.usuario = $localStorage.amigos;
            }

            $scope.database.ref('users/' + result.id).once('value', function(snapshot) {
              if(snapshot.val().vip != null) {
                $localStorage.vip.isVip = snapshot.val().vip;
                $scope.vip = $localStorage.vip;

                if($scope.vip.isVip == true) {
                  console.log('É vip');
                  window.AdMob.removeBanner();
                }else{
                  console.log('Não é vip');
                  if (window.AdMob) {
                    console.log("admob ready!");
                    // it will display smart banner at top center, using the default options
                    window.AdMob.createBanner({
                      adId: admobid.banner,
                      isTesting: false,
                      position: AdMob.AD_POSITION.BOTTOM_CENTER,
                      autoShow: true
                    });

                    // this will load a full screen ad on startup
                    window.AdMob.prepareInterstitial({
                      adId: admobid.interstitial,
                      isTesting: false, // TODO: remove this line when release
                      autoShow: false
                    });
                  } else {
                    console.log('admob plugin not ready');
                    return;
                  }
                }
              }else{
                $localStorage.vip.isVip = false;
                $scope.vip.isVip = false;
              }

              if(snapshot.val().showFav != null) {
                $localStorage.toggleFav.checked = snapshot.val().showFav;
                $scope.toggleFav = $localStorage.toggleFav;
              }
            })

            //pega os favoritos do bd do firebase e coloca no bd do app
            $scope.database.ref('favoritos/' + result.id).once('value', function(snapshot) {
              $localStorage.favoritos = [];
              snapshot.forEach(function(childSnapshot) {
                $localStorage.favoritos.push(childSnapshot.val());
              });
              $scope.fav = $localStorage.favoritos;
            });

            $scope.pegarToken = function () {
              FCMPlugin.getToken(
                function(token){
                  //console.log('tokenFCM',token);
                  $scope.database.ref('users/' + result.id).set({
                    id: result.id,
                    nome: result.name,
                    picture: result.picture.data.url,
                    email: result.email,
                    showFav: $scope.toggleFav.checked,
                    vip: $scope.vip.isVip,
                    fcmToken: token
                  });
                },
                function(err){
                  $scope.database.ref('users/' + result.id).set({
                    id: result.id,
                    nome: result.name,
                    picture: result.picture.data.url,
                    email: result.email,
                    showFav: $scope.toggleFav.checked,
                    vip: $scope.vip.isVip,
                    fcmToken: ""
                  });
                  console.log('error retrieving token: ' + err);
                }
              );
            };

            $timeout($scope.pegarToken, 10000);


            //console.log($scope.usuario);

          }, function(error) {
            $scope.usuario = $localStorage.usuario;
            $scope.amigos = $localStorage.amigos;
            console.log("There was a problem getting your profile.  Check the logs for details.");
            console.log(error);
          });

      } else {
        console.log("Not signed in");
        $state.go('app.home');
      }

      $ionicPlatform.ready(function() {
        if(window.cordova) {

          //função pra mostrar o botão de atua$localStorage.amigoslizar o app
          cordova.getAppVersion.getVersionNumber().then(function (version) {
            $localStorage.versao.nome = "Versão: " + version;
            $scope.versao = $localStorage.versao;
            $http.get("http://meganimes.16mb.com/api/version/atual").success(function (data) {
              if (version != data.nome) {
                $scope.versao = data;
                $scope.atualizar = true;
                $timeout(function () {
                  $scope.versao.nome = "Atualizar";
                }, 10)
              } else {
                $scope.versao.nome = "Versão: " + version;
              }
            })
          });

          FCMPlugin.onNotification(
            function (data) {
              //definindo a funcao de atualizacoes
              $scope.funcAtualizacao = function(dados) {
                $scope.notificacao = JSON.parse(dados);
                $localStorage.lastAtualizacao = $scope.notificacao;

                //contador de notificações
                $localStorage.notificacoes.push($scope.notificacao);
                $timeout(function () {
                  $scope.$apply(function () {
                    $scope.badgeCount = $localStorage.notificacoes.length;
                  });
                }, 1000);
              }

              if (data.wasTapped) {
                //alert( JSON.stringify(data));
                //Notification was received on device tray and tapped by the user.
                if(data.atualizacao = true) {
                  $localStorage.lastAtualizacao = JSON.parse(data.conteudo);
                  $scope.openPopover();
                  //$scope.funcAtualizacao(data.conteudo);
                }
                //$location.path("/anime/"+data.anime);
              } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                if(data.atualizacao = true) {
                  $scope.funcAtualizacao(data.conteudo);
                }
              }
            },
            function (msg) {
              // console.log('onNotification callback successfully registered: ' + msg);
            },
            function (err) {
              // console.log('Error registering onNotification callback: ' + err);
            })
        }
      })

    };

    $scope.check = function () {
      window.open($scope.versao.link, '_system');
    }

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/favoritos.html', {
      scope: $scope
    }).then(function(modalFav) {
      $scope.modalFav = modalFav;
    });

    // Triggered in the login modal to close it
    $scope.closeModalFav = function() {
      $scope.modalFav.hide();
    };

    // Open the login modal
    $scope.openModalFav = function() {
      $scope.$evalAsync(function() { $scope.fav = $localStorage.favoritos; });
      $scope.modalFav.show();
    };

    $scope.openNotificacoes = function () {
      $scope.openPopover();
      $localStorage.notificacoes = [];
      $localStorage.lastAtualizacao = [];
      $scope.badgeCount = 0;
    }

    $ionicPopover.fromTemplateUrl('templates/popoverSobre.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
      $scope.popover.data = $scope.notificacao;
    });

    $scope.openPopover = function($event) {
      $scope.popover.data = $localStorage.lastAtualizacao;
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Função para fazer a busca de anime pela letra passada
    $scope.buscarPorLetra = function (letra) {
      $scope.refresh = false;
      $localStorage.letra = letra;
      $state.go('app.letraAnimes');
      $scope.letra = $localStorage.letra;
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
      $scope.letra = $localStorage.letra;
      $http.get('http://meganimes.16mb.com/api/animes/letra/'+$scope.letra+'?page='+$scope.pag).success(function (response) {
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
      $scope.letra = $localStorage.letra;
      $scope.showBtn = {
        'visibility': "hidden"
      };
      $scope.more = true;
      $http.get('http://meganimes.16mb.com/api/animes/letra/'+$scope.letra+'?page=1')
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

    //Função para colocar os animes favoritos do amigo no scope
    $scope.carregarAmigos = function () {
      $scope.amigos = $localStorage.amigos;
    }

    //Função para salvar os favoritos do bd no scope.
    $scope.loadFavoritos = function () {
      $scope.amigoFav = $localStorage.amigoFavoritos;
      if($localStorage.amigoFavoritos.favoritos == null || $localStorage.amigoFavoritos.favoritos.length == 0)
        $scope.noFavoritos = {
          'visibility': "visible",
          'position': 'absolute',
          'top': '0',
          'width': '100%'
        }
    }

    $scope.amigoFavoritos = function (amigo) {
      $scope.database.ref('users/' + amigo.id).once('value', function(snapshot) {
        if(snapshot.val() == null) {
          $ionicPopup.alert({
            title: 'Esse amigo não está registrado!'
          })
        }else if (snapshot.val().showFav == true) {
          $scope.database.ref('favoritos/' + amigo.id).once('value', function (snapshot) {
            $localStorage.amigoFavoritos = [];
            $localStorage.amigoFavoritos.favoritos = [];
            $localStorage.amigoFavoritos.nome = amigo.name;
            snapshot.forEach(function (childSnapshot) {
              $localStorage.amigoFavoritos.favoritos.push(childSnapshot.val());
            })
            $state.go('app.amigosFav');
          })
        }else{
          $ionicPopup.alert({
            title: 'Esse amigo não quer mostrar os seus favoritos!'
          })
        }
      })
    }

    $scope.toggleFavChange = function() {
      $localStorage.toggleFav.checked = $scope.toggleFav.checked;
      $scope.toggleFav.checked = $localStorage.toggleFav.checked;
      console.log('Push Notification Change', $scope.toggleFav.checked);
      $scope.database.ref('users/' + $localStorage.usuario.id).update({
        showFav: $scope.toggleFav.checked
      })
    }

  })
