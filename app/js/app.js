'use strict';


// Declare app level module which depends on filters, and services
var UPapp = angular.module('UPA_Pagos', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'Interceptor_Service',
    'Auth_Service'
]);

UPapp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/administracion/:pagename', {
            templateUrl: 'partials/admin/index.html',
            controller: 'AdminCtrl'
        });
        $routeProvider.when('/view2', {
            templateUrl: 'partials/partial2.html',
            controller: 'MyCtrl2'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login/index.html'
        });
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
UPapp.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
