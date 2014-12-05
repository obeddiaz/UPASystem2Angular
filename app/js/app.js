'use strict';

var serviceBase = 'http://localhost/UPASystem2/public/index.php';
// Declare app level module which depends on filters, and services
var UPapp = angular.module('UPA_Pagos', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'Interceptor_Service',
    'ui.bootstrap',
    'Auth_Service',
    'checklist-model'
]);

UPapp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        //.../home/admin
        $routeProvider.when('/home/admin/:pagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/alumno/recibo', {
            templateUrl: 'partials/alumno/recibo.html',
            controller: 'ReciboCtrl'
        });
        $routeProvider.when('/home/alumno/:pagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/admin/:pagename/:subpagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/alumno/:pagename/:subpagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login/index.html'
        });
        //$routeProvider.otherwise({redirectTo: '/login'});
    }]);
UPapp.run(['authService', function(authService) {
        authService.fillAuthData();
    }]);
