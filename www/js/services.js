angular.module('MeganimesApp.services', [])

.factory('AnimesFactory', function($http) {

  var AnimesCollection = function(){
    this.animes = [];
    this.more = true;
    this.pag = 1;
    this.url = "";
    this.scrollcomplete = false;
    this.showBtn = null;
  };

  AnimesCollection.prototype.loadMore = function() {
      var url = 'http://localhost:8000/api/animes?page='+this.pag;
      this.url = url;

      $http.get(url)
        .success(function(response) {
        if(response.length == 0){
          this.more = false;
          this.showBtn = {
            'visibility': "visible"
          };
        }else{
          this.more = true;
        }

        var animes = [];
        angular.forEach(response, function(data){
          animes.push(data);
          //$ionicScrollDelegate.resize();
        });

        this.animes = animes;

        //$scope.$broadcast('scroll.infiniteScrollComplete');
        this.scrollcomplete = true;
        //$ionicScrollDelegate.resize();
        this.pag++;
      }.bind(this));
  };
  return AnimesCollection;
})
