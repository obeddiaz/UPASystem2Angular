/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//UPapp.controller('AdminCtrl', [function ($scope, $routeParams) {
//        console.log($routeParams);
//        $scope.message = "TEST";
//        //$scope.message = "(',')---I am on " + $routeParams.pagename + " page---(',')";
//    }]);

//UPapp.controller('AdminCtrl', ['$scope', '$routeParams',
//    function ($scope, $routeParams) {
//        console.log($routeParams);
//        //$scope.message = "TEST";
//        $scope.message = "(',')---I am on " + $routeParams.pagename + " page---(',')";
//    }]);
UPapp.controller('AdminCtrl', function ($scope, $routeParams) {
    console.log($routeParams);
    //$scope.message = "TEST";
    $scope.message = "(',')---I am on " + $routeParams.pagename + " pagess---(',')";

});