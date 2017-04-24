// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('MeganimesApp',
  ['ionic',
    'angular-svg-round-progressbar',
    'ionic.rating',
    //'ionic-native-transitions',
    'MeganimesApp.services',
    'firebase',
    'ngCordova',
    'ngCordovaOauth',
    'ngStorage',
    'angular.filter',
    'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.imaads',
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.poster',
    'jett.ionic.filter.bar'])

  .run(function($ionicPlatform, $localStorage) {
    $ionicPlatform.ready(function() {
      screen.lockOrientation('portrait');
      screen.unlockOrientation();


      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
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

      //carregar os ads se o cara nao for vip
      if($localStorage.vip.isVip == null || $localStorage.vip.isVip == false) {
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
        }
      }
    })

  })


  .config(function ($urlRouterProvider, $stateProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.transition('android');
    $ionicConfigProvider.scrolling.jsScrolling(false);

    $stateProvider
    // setup an abstract state for the tabs directive
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/index.html',
        controller: 'HomeController'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'tab-animes': {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
          }
        }
      })

      // Each tab has its own nav history stack:
      .state('app.generos', {
        url: '/generos',
        views: {
          'tab-animes': {
            templateUrl: 'templates/generos.html',
            controller: 'GenerosController'
          }
        }
      })
      .state('app.letraAnimes', {
        url: '/letraAnimes',
        views: {
          'tab-animes': {
            templateUrl: 'templates/animes.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.generosAnimes', {
        url: '/generos/animes',
        views: {
          'tab-animes': {
            templateUrl: 'templates/animes.html',
            controller: 'GenerosController'
          }
        }
      })
      .state('app.animes', {
        url: '/animes',
        views: {
          'tab-animes': {
            templateUrl: 'templates/animes.html',
            controller: 'AnimesController'
          }
        }
      })
      .state('app.amigos', {
        url: '/amigos',
        views: {
          'tab-animes': {
            templateUrl: 'templates/amigos.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.amigosFav', {
        url: '/amigo/favoritos',
        views: {
          'tab-animes': {
            templateUrl: 'templates/amigo-favoritos.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.noticias', {
        url: '/noticias',
        views: {
          'tab-animes': {
            templateUrl: 'templates/noticias.html',
            controller: 'NoticiasController'
          }
        }
      })
      .state('app.guiadasemana', {
        url: '/guiadasemana',
        views: {
          'tab-animes': {
            templateUrl: 'templates/guiadasemana.html',
            controller: 'GuiaDaSemanaController'
          }
        }
      })
      .state('app.completos', {
        url: '/completos',
        views: {
          'tab-animes': {
            templateUrl: 'templates/animes.html',
            controller: 'AnimesCompletosController'
          }
        }
      })
      .state('app.anime', {
        url: '/anime/:id',
        views: {
          'tab-animes': {
            templateUrl: 'templates/anime.html',
            controller: 'AnimeController'
          }
        }
      })
      .state('app.episodio', {
        url: '/anime/:idAnime/episodio/:idEp',
        params: {
          episodios: null
        },
        views: {
          'tab-animes': {
            templateUrl: 'templates/episodio.html',
            controller: 'EpisodioController'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

  })











