angular.module('MeganimesApp')
  .controller('EpisodioController', function ($sce,$stateParams, $state, $ionicHistory, $http, $ionicPlatform, $ionicLoading, $scope, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.controller = this;
    $scope.episodios = $stateParams.episodios;
    $scope.anime = $stateParams.idAnime;

    if (window.AdMob) {window.AdMob.hideBanner()}


    //////////////clearMedia() API.clearMedia() implementar isso para fechar o video quando
    /////////////abrir outro

    $ionicPlatform.ready(function() {
      //Esse powermanagement é pra controlar o wakelock, se tiver ligado
      //não da pra usar pelo computador.
      if(window.powerManagement){
        window.powerManagement.dim(function () {
          console.log('Wakelock acquired');
        }, function () {
          console.log('Failed to acquire wakelock');
        });

        window.powerManagement.setReleaseOnPause(true, function() {
          console.log('setReleaseOnPause successfully');
        }, function() {
          console.log('Failed to set');
        });
      }
      if(window.cordova){
        // set to either landscape
        screen.lockOrientation('landscape');
      }
      if (window.StatusBar) {
        StatusBar.hide();
      }
      $ionicPlatform.onHardwareBackButton(function(event) {
        if (window.StatusBar) {
          StatusBar.show();
        }
        //coloca a orientação em portrait
        screen.lockOrientation('portrait');
        screen.unlockOrientation();
        //volta para a tela de anime
        $ionicHistory.goBack();
        event.stopPropagation();

        //mostra propaganda se não for vip
        if($localStorage.vip.isVip == null || $localStorage.vip.isVip == false) {
          window.AdMob.showInterstitial(sucesso, falha);
          window.AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      });

      function sucesso() {
        console.log('sucesso!');
      }

      function falha() {
        console.log('falhou!');
      }

    });

    //video pelo adsense
    //https://googleads.g.doubleclick.net/pagead/ads?ad_type=video&client=ca-video-pub-4968145218643279&videoad_start_delay=0&description_url=http%3A%2F%2Fwww.google.com&max_ad_duration=40000&adtest=on
    //https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=
    var controller = this;
    controller.API = null;

    $scope.showPoster = {
      'display': 'block !important',
      'visibility': 'visible !important',
      'z-index': '0 !important'
    };


    $scope.mudarStyle = function (state) {
      if(state == 'play' || state == 'pause') {
        $scope.showPoster = {
          'display': 'none',
          'visibility': 'hidden',
          'z-index': '-10'
        }
      }else{
        $scope.showPoster = {
          'display': 'block',
          'visibility': 'visible',
          'z-index': '0'
        };
      }
    }

    controller.onPlayerReady = function(API) {
      controller.API = API;
      console.log(controller.API.currentState);

      $scope.showPoster = {
        'display': 'block !important',
        'visibility': 'visible !important',
        'z-index': '0 !important'
      };
    };

    $scope.proximoEp = function () {
      if($scope.prox != null) {
        API.clearMedia();
        $state.go('app.episodio', {idAnime: $scope.anime, idEp: $scope.prox.id, episodios: $scope.episodios});
      }
    }


    var video = [];
    $http.get('http://meganimes.16mb.com/api/episodio/' + $stateParams.idEp).
    success(function(data) {

      $scope.episodio = data;

      if($scope.episodios != null)
      for (var i = 0; i < $scope.episodios.length; i++){
        if($scope.episodio.id == $scope.episodios[i].id) {
          if(i+1 >= $scope.episodios.length) {
            $scope.prox = null;
            $scope.textoNext = "Esse foi o último episódio";
          }
          else{
            $scope.prox = $scope.episodios[i + 1];
            $scope.textoNext = "Próximo Episódio";
          }
          break;
        }
      }

      this.config = {
        autoPlay: true,
        sources: [
          {
            src: $sce.trustAsResourceUrl(data.video), type: "video/mp4"
          }
        ],
        tracks: [],
        theme: 'lib/videogular-themes-default/videogular.css',
        plugins: {
          ads: {
            companion: "companionAd",
            companionSize: [728, 90],
            network: "6062",
            unitPath: "iab_vast_samples",
            adTagUrl: "https://",
            skipButton: "<div class='skipButton'>skip ad</div>"
          },
          controls: {
            autoPlay: true,
            autoHide: true,
            autoHideTime: 500
          },
          poster: data.imagem
        }
      };
    }.bind(this))
      .finally(function(){
        if (controller.API.isReady) {
          $scope.hideOnLoad = {
            'visibility': "hidden"
          };
          $scope.visibility = {
            'visibility': "visible"
          };
        }
      });
  })

  .run(["$templateCache",
    function ($templateCache) {
      $templateCache.put("vg-templates/vg-next-video",
        '<div class="loader-container" ng-if="controller.API.isCompleted">' +
        '<vg-poster vg-url=\'episodio.imagem\'></vg-poster>' +
        '<div class="proximo" ng-click="proximoEp()">{{textoNext}}</div>' +
        '</div>'
      );
    }
  ])

  .directive("myReplayPlugin",
    [function() {
      return {
        restrict: "E",
        require: "^videogular",
        template: "<div ng-show=\"API.isCompleted && API.currentState == 'stop'\"><span ng-click=\"onClickReplay()\">REPLAY!</span></div>",
        link: function(scope, elem, attrs, API) {
          scope.API = API;

          scope.onClickReplay = function() {
            API.play();
          };
        }
      }
    }
    ])

  .directive("vgNextVideo",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function (elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-next-video';
        }
      }
    }
    ])

  .directive("epNumero",
    [function() {
      return {
        restrict: "E",
        require: "^videogular",
        template: "<div class=\"numeroEpisodio customBtn\">Ep: {{episodio.nome.substring((episodio.nome.lastIndexOf(\" \")+1), frase.length())}}</div>",
        link: function(scope, elem, attrs, API) {
          scope.API = API;

          if(window.cordova)
            API.toggleFullScreen();
        }
      }
    }
    ])

  .directive("pularIntro",
    [function() {
      return {
        restrict: "E",
        require: "^videogular",
        template: "<div style='z-index: 50' class=\"pularIntro customBtn\" ng-click='pularintro()'>Pular intro</div>",
        link: function(scope, elem, attrs, API) {
          scope.API = API;

          scope.pularintro = function(){
            API.seekTime((API.currentTime + 88000) / 1000, false);
            API.play();
          }
        }
      }
    }
    ])
