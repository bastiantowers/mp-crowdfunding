angular.module('mpCrowdApp')
.factory('mpCrowdAppDB', function($q){
      

    // DB
    var pdb;

    // Campaign Item Model
    var campaignItem_Model = {
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

    var initDB = function() {
        // Creates the database or opens if it already exists
        pdb = new PouchDB('mpCrowdAppDB');

        /* THIS IS A PERMANENT QUERY */
        /* ========================= */
        // document that tells PouchDB/CouchDB
        // to build up an index on doc.name
        var designCampaignItem = {
            _id: '_design/campaignItem',
            views: {
                by_campaignItem: {
                  map: function (doc) {
                        if(doc.docType == 'campaignItem' && doc.isDeleted == false && doc.isEnded == false){
                            emit(doc);
                        }
                    }.toString()
                },
                by_campaignEndedItem: {
                  map: function (doc) {
                        if(doc.docType == 'campaignItem' && doc.isDeleted == false && doc.isEnded == true){
                            emit(doc);
                        }
                    }.toString()
                }
            }
        };
        // save it
        pdb.put(designCampaignItem).catch(function (err) {
          // some error (maybe a 409, because it already exists?)
            if(err.status !== 409){console.log(err);}
        });

    };

    var dropDatabase = function() {
          pdb.destroy();
    };

    var postCampaignItem = function(campaignItem){
      var deferred = $q.defer();
        if(campaignItem){
            if(campaignItem.campaignName && campaignItem.campaignName !== ''){

                campaignItem_Model = campaignItem;

                // Seteamos el id del item
                campaignItem_Model._id = new Date().getDate() + '_' 
                + new Date().getMonth() + '_' 
                + new Date().getFullYear() + '___'
                + new Date().getTime() + '';

                // Lo metemos en la base
              pdb.put(campaignItem_Model, function() {
                console.log('pdb.put in postCampaignItem Successed');
                deferred.resolve();
              }).catch(function(error){
                console.error(error);
                deferred.reject(err);
              });
            }

        }else{
            console.log('campaignItem not set');
        }

        return deferred.promise;
    };

    var getAllCampaignItems = function(){
      var deferred = $q.defer();
        pdb.query('campaignItem/by_campaignItem',{
           include_docs : true
         }).then(function (res) {
          // got the query results
          deferred.resolve(res.rows);
        }).catch(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
    };

    var getAllCampaignEndedItems = function(){
      var deferred = $q.defer();
        pdb.query('campaignItem/by_campaignEndedItem',{
           include_docs : true
         }).then(function (res) {
          // got the query results
          deferred.resolve(res.rows);
        }).catch(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
    };

    var editCampaignItemById = function(item_id, new_doc) {
        
        var deferred = $q.defer();
        pdb.get(item_id).then(function (doc) {
          pdb.put(new_doc, item_id, doc._rev);
          deferred.resolve(doc);
        }).catch(function (err) {
            deferred.reject(err);
            console.error(err);
        });
        return deferred.promise;
    }

    // Inicia la BD
    initDB();
    return {
        initDB: initDB,
        dropDatabase: dropDatabase,
        postCampaignItem: postCampaignItem,
        getAllCampaignItems: getAllCampaignItems,
        getAllCampaignEndedItems: getAllCampaignEndedItems,
        editCampaignItemById: editCampaignItemById
    };
})
.service('ModalInfoService', function($ionicModal, $rootScope) {
  
  
  var init = function($scope, $settings) {

    var promise;
    $scope = $scope || $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl('templates/modals/infoService.html', {
      scope: $scope,
      errorTitle : $settings.errorTitle || 'Información',
      errorMsg : $settings.errorMsg || 'Algo ha salido mal...',
      booleanModal : $settings.booleanModal || false,
      confirmFunction : $settings.confirmFunction || '',
      abortFunction : $settings.abortFunction || '',
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.errorTitle = modal.errorTitle;
      $scope.modal.errorMsg = modal.errorMsg;

      $scope.modal.booleanModal = modal.booleanModal;
      // Funciones para BoolenModal == true
      $scope.modal.confirmFunction = modal.confirmFunction;
      $scope.modal.abortFunction = modal.abortFunction;

      return modal;
    });

    $scope.openModal = function() {
       $scope.modal.show();
     };
     $scope.closeModal = function() {
       $scope.modal.hide();
     };
     $scope.$on('$destroy', function() {
       $scope.modal.remove();
     });
    
    return promise;
  }
  
  var modalSettings = {
            errorTitle : 'Error',
            errorMsg : 'Ha ocurrido un error al iniciar este modal',
            booleanModal : false
        }
  
  init($rootScope, modalSettings);
  
  return {
    init: init
  }
  
})
;

;
