angular.module('mpCrowdApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, mpCrowdAppDB) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})
.controller('newCampaignCtrl', function($scope, $state, mpCrowdAppDB, ModalInfoService) {
  // CREATE CAMPAIGN VIEW
  $scope.campaignItem = {
        docType : 'campaignItem',
        campaignName : '',
        campaignLink : 'http://goo.gl/omkL24',
        totalAmmount : 0,
        actualAmmount : 0,
        isEnded : false,
        isCanceled : false,
        isDeleted : false,
        isPrivate: false
    }

    $scope.createCampaign = function () {
      
      var error = 0;
      var modalSettings = {
          errorTitle : 'Error',
          errorMsg : 'Ups! Algo ha salido mal...'
      };

      if($scope.campaignItem.campaignName == '')
        {
            error++;
            modalSettings.errorTitle = 'Falta Nombre';
            modalSettings.errorMsg = 'Debe introducir un nombre para la Campaña';
        }

      if($scope.campaignItem.totalAmmount == 0)
        {
            error++;
            modalSettings.errorTitle = 'Ingrese un Monto Total';
            modalSettings.errorMsg = 'Necesita definir un monto total de dinero a recaudar';
        }

        if(error > 0){
            ModalInfoService
              .init($scope, modalSettings)
              .then(function(modal) {
                modal.show();
              });
        } else {
          mpCrowdAppDB.postCampaignItem($scope.campaignItem).then(function(){
              $state.go('app.shareCampaign');
          });
        }
    }
})
.controller('listCampaignsCtrl', function($scope, mpCrowdAppDB, ModalInfoService) {

  $scope.getAllCampaignItems = function() {
    mpCrowdAppDB.getAllCampaignItems().then(function(res){
      $scope.allCampaignItems = res;
    });
  };

  $scope.getAllCampaignEndedItems = function() {
    mpCrowdAppDB.getAllCampaignEndedItems().then(function(res){
      $scope.allCampaignEndedItems = res;
    });
  };

  $scope.endCampaignItem = function(docToBeEnded) {
    docToBeEnded.isEnded = true;
    mpCrowdAppDB.editCampaignItemById(docToBeEnded._id, docToBeEnded).then(function(res){
      $scope.updateView();
    });
  };

  $scope.deleteCampaignItem = function(docToBeDeleted) {
    docToBeDeleted.isDeleted = true;
    mpCrowdAppDB.editCampaignItemById(docToBeDeleted._id, docToBeDeleted).then(function(res){
      $scope.updateView();
    });
  };

  $scope.updateView = function(){
    $scope.getAllCampaignItems();
    $scope.getAllCampaignEndedItems();
  };

  $scope.updateView();

})
.controller('shareCampaignCtrl', function($scope, mpCrowdAppDB) {

})
.controller('devOptionsCtrl', function($scope, mpCrowdAppDB) {
  $scope.borrarDB = function(){
    mpCrowdAppDB.dropDatabase();
    console.log('BD Borrada');
  }
  $scope.crearDB = function(){
    mpCrowdAppDB.init();
    console.log('BD Creada');
  }
})
;
