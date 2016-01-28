angular.module('controllers', [])

.controller('MainCtrl',['$scope', '$location','LinkService',
  function($scope, $location, LinkService) {
  	$scope.url = "";
    $scope.topTen = [];
    var host = $location.host();
      

    $scope.urlSubmit = function(){
      var url = $scope.url.toLowerCase();
      if(url.includes(host)){
        unShrink();
      }else{
        shrink();
      }
    }

    function shrink(){
    	var shortUrl = LinkService.shrink($scope.url);
    	shortUrl.then(function(res){
    		$scope.results = res.data;
    	}, function(err){
    		console.log(err);
    	});

      $scope.url = "";
    };

    function unShrink(){
      LinkService.unShrink($scope.url);
      $scope.url = "";
    };

    $scope.getTopTen = function(){
      var gotTopTen = LinkService.getTopten();
      gotTopTen.then(function(data){
        $scope.topTen = data.data.topTen;
      }, function(err){
        console.log(err);
      });
    };

    $scope.getTopTen();
}]);