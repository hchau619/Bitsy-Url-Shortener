angular.module('services', [])
.factory('LinkService', ['$http', function($http) {
    return {
        shrink : function(url) {
          var config = {
            method : "POST",
            url : "/",
            data : {
              url: url
            }
          };
          return $http(config);
        },

        unShrink : function(url){

        },

        getTopten: function(){
          return $http.get('/topten');
        }
    }       

}]);