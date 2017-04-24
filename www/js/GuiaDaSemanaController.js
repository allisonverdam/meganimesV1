angular.module('MeganimesApp')
  .controller('GuiaDaSemanaController', function($scope, $ionicPlatform, $ionicHistory){
    $scope.semana = [];

    var diasSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'];
    var segunda = ['Kaitou Joker 4th Season',
      '12-Sai. Chiccha na Mune no Tokimeki 2',
      '3-Nen D-Gumi Glass no Kamen',
      'Stella no Mahou',
      'Gakuen Handsome',
      'Trickster: Edogawa Ranpo',
      'Shakunetsu no Takkyuu Musume']
    var terca = ['Soul Buster',
      'Nobunaga no Shinobi',
      'Soushin Shoujo Matoi',
      'Natsume Yuujinchou Go',
      'Nanbaka'];
    var quarta = ['Cheating Craft',
      'To Be Hero',
      'Bishoujo Yuugi Unit Crane Game Galaxy',
      'Nazotokine',
      'Teekyuu 8',
      'Kiitarou Shounen no Youkai Enikki',
      'Mahou Shoujo Nante  2',
      'Anitore! XX',
      'Hibike! Euphonium 2',
      'Bungou Stray Dogs 2nd Season',
      'Brave Witches',
      'Yuri!!! on Ice'];
    var quinta = ['Flip Flappers',
      'Keijo!!!!!!!!',
      'All Out!!',
      'Bernard-jou Iwaku.',
      'Watashi ga Motete Dousunda',
      'Girlish Number',
      'Fune wo Amu',];
    var sexta = ['Drifters',
      'Lostorage incited WIXOSS',
      'Haikyuu!!: 3',
      'Ajin 2nd Season'];
    var sabado = ['Time Bokan 24',
      'Bloodivores',
      'Bubuki Buranki: Hoshi no Kyojin',
      'Shuumatsu no Izetta',
      'WWW.Working!!',
      'Mahou Shoujo Ikusei Keikaku',
      'ViVid Strike!',
      'Uta no☆Prince-sama♪ Maji Love Legend Star',
      'Tiger Mask W',
      'Koneko no Chi: Ponponra Daibouken',
      'Monster Hunter Stories: Ride On',
      'Cardfight!! Vanguard G Next',
      'Classicaloid',
      'Long Riders!',
      '3-gatsu no Lion',
      'Occultic;Nine',
      'Sengoku Choujuu Giga',
      'Udon no Kuni no Kiniro Kemari',
      'Luger Code 1951'];
    var domingo = ['Kidou Senshi Gundam: IBOs 2',
      'Show By Rock! 2',
      'Magic-Kyun! Renaissance',
      'Okusama ga Seito Kaichou! 2',
      'Touken Ranbu: Hanamaru',
      'Idol Memories',
      'Ao Oni: The AnimationHagane Orchestra'];

    for (var i=0; i<7; i++) {
      $scope.semana[i] = {
        name: diasSemana[i],
        items: []
      };
      if(i == 0)
        $scope.semana[i].items = segunda;
      else if(i == 1)
        $scope.semana[i].items = terca;
      else if(i == 2)
        $scope.semana[i].items = quarta;
      else if(i == 3)
        $scope.semana[i].items = quinta;
      else if(i == 4)
        $scope.semana[i].items = sexta;
      else if(i == 5)
        $scope.semana[i].items = sabado;
      else
        $scope.semana[i].items = domingo;
    }

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

  })
