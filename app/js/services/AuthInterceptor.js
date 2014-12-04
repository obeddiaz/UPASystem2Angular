
var UPapp_Interceptor = angular.module('Interceptor_Service', []);
UPapp_Interceptor.config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('AuthInterceptor', ['$window', '$q', '$location', '$injector', function ($window, $q, $location, $injector) {
            return {
                request: function (config) {
                    var Auth_Service = $injector.get('authService');
                    //console.log(Auth_Service.authentication.isAuth);
                    config.headers = config.headers || {};
                    //$location.path('/login');
                    //console.log($window.sessionStorage.getItem('token'));
                    if (Auth_Service.authentication.isAuth) {
                        config.headers.Authorization = $window.sessionStorage.getItem('token');
                    } else {
                        //$location.path('/login');
                    }
                    return config || $q.when(config);
                },
                responseError: function (response) {
                    $window.sessionStorage.removeItem('token');
                    //$location.path('/login');
                    if (response.status === 401) {

                    }
                    return response || $q.when(response);
                }
            };
        }]);
    $httpProvider.interceptors.push('AuthInterceptor');
});